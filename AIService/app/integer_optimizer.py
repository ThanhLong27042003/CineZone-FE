"""
Integer Programming based Schedule Optimizer
Sử dụng PuLP để tối ưu hóa việc allocation shows vào rooms/slots.
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict
import numpy as np

try:
    from pulp import (
        LpProblem, LpMaximize, LpVariable, LpBinary, 
        lpSum, LpStatus, PULP_CBC_CMD, value
    )
    PULP_AVAILABLE = True
except ImportError:
    PULP_AVAILABLE = False
    print("Warning: PuLP not available, using greedy fallback")

from .models import MovieData, ShowData, RoomData, OptimizedShow
from .feature_engineering import FeatureExtractor, RuleBasedFilter
from .demand_predictor import DemandPredictor


class IntegerProgrammingOptimizer:
    """
    Integer Programming để QUYẾT ĐỊNH optimal schedule.
    Tối đa hóa expected revenue dựa trên demand predictions.
    """
    
    def __init__(
        self, 
        feature_extractor: FeatureExtractor,
        demand_predictor: DemandPredictor,
        rule_filter: RuleBasedFilter
    ):
        self.feature_extractor = feature_extractor
        self.demand_predictor = demand_predictor
        self.rule_filter = rule_filter
        
    def optimize(
        self,
        movies: List[MovieData],
        existing_shows: List[ShowData],
        rooms: List[RoomData],
        date_range: Dict[str, str],
        constraints: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Main optimization function.
        
        Workflow:
        1. Rule-based filtering để giảm search space
        2. XGBoost prediction cho remaining candidates
        3. Integer Programming để select optimal schedule
        """
        
        # Step 1: Pre-filter candidates
        print("Step 1: Pre-filtering candidates...")
        candidates = self.rule_filter.prefilter_candidates(
            movies, rooms, date_range, existing_shows, self.feature_extractor
        )
        
        if not candidates:
            return []
        
        print(f"  → {len(candidates)} candidates after rule-based filtering")
        
        # Limit candidates để IP tractable (max ~2000)
        max_candidates = constraints.get('max_candidates', 2000)
        if len(candidates) > max_candidates:
            candidates = candidates[:max_candidates]
            print(f"  → Limited to top {max_candidates} candidates")
        
        # Step 2: Predict demand for all candidates
        print("Step 2: Predicting demand...")
        predictions = self.demand_predictor.predict_batch(candidates)
        
        for i, (demand, confidence) in enumerate(predictions):
            candidates[i]['predicted_demand'] = demand
            candidates[i]['confidence'] = confidence
            # Calculate expected revenue
            base_price = 10.0  # Base ticket price
            candidates[i]['expected_revenue'] = demand * base_price * (1 + candidates[i]['priority'] * 0.2)
        
        # Step 3: Integer Programming optimization
        print("Step 3: Running Integer Programming optimization...")
        if PULP_AVAILABLE:
            selected = self._solve_ip(candidates, rooms, constraints)
        else:
            selected = self._greedy_fallback(candidates, rooms, constraints)
        
        print(f"  → Selected {len(selected)} shows")
        
        # Step 4: Format output
        return self._format_schedule(selected, movies)
    
    def _solve_ip(
        self, 
        candidates: List[Dict], 
        rooms: List[RoomData],
        constraints: Dict[str, Any]
    ) -> List[Dict]:
        """
        Solve Integer Programming problem.
        
        Decision variables: x[i] = 1 nếu candidate i được chọn
        
        Objective: Maximize sum of expected_revenue * x[i]
        
        Constraints:
        1. Room-time conflict: Không 2 shows cùng room cùng lúc
        2. Max shows per movie per day
        3. Max total shows per day
        4. Balanced distribution across movies
        """
        
        n = len(candidates)
        if n == 0:
            return []
        
        # Create problem
        prob = LpProblem("Cinema_Schedule_Optimization", LpMaximize)
        
        # Decision variables
        x = [LpVariable(f"x_{i}", cat=LpBinary) for i in range(n)]
        
        # Objective: Maximize expected revenue
        prob += lpSum([
            candidates[i]['expected_revenue'] * x[i] 
            for i in range(n)
        ]), "Total_Expected_Revenue"
        
        # Constraint 1: Room-time conflicts
        # Group candidates by room and time slot
        room_time_groups = defaultdict(list)
        for i, cand in enumerate(candidates):
            room_id = cand['room'].roomId
            dt = cand['datetime']
            runtime = cand['movie'].runtime
            
            # Create time blocks (30-minute slots)
            start_slot = dt.hour * 2 + dt.minute // 30
            end_slot = start_slot + (runtime + 30) // 30  # Include cleanup time
            
            time_key = f"{cand['date_key']}_{room_id}"
            room_time_groups[time_key].append((i, start_slot, end_slot))
        
        # Add conflict constraints
        conflict_count = 0
        for room_time_key, indices in room_time_groups.items():
            # Check all pairs for overlap
            for j in range(len(indices)):
                for k in range(j + 1, len(indices)):
                    i1, start1, end1 = indices[j]
                    i2, start2, end2 = indices[k]
                    
                    # Check if overlapping
                    if not (end1 <= start2 or end2 <= start1):
                        prob += x[i1] + x[i2] <= 1, f"conflict_{conflict_count}"
                        conflict_count += 1
        
        print(f"    Added {conflict_count} conflict constraints")
        
        # Constraint 2: Max shows per movie per day
        max_per_movie = constraints.get('max_shows_per_movie_per_day', 4)
        movie_day_groups = defaultdict(list)
        for i, cand in enumerate(candidates):
            key = f"{cand['movie'].id}_{cand['date_key']}"
            movie_day_groups[key].append(i)
        
        for key, indices in movie_day_groups.items():
            prob += lpSum([x[i] for i in indices]) <= max_per_movie, f"max_movie_{key}"
        
        # Constraint 3: Max shows per day
        max_per_day = constraints.get('max_shows_per_day', 10) * len(rooms)
        day_groups = defaultdict(list)
        for i, cand in enumerate(candidates):
            day_groups[cand['date_key']].append(i)
        
        for day, indices in day_groups.items():
            prob += lpSum([x[i] for i in indices]) <= max_per_day, f"max_day_{day}"
        
        # Constraint 4: Min shows per day (ensure coverage)
        min_per_day = constraints.get('min_shows_per_day', 3)
        for day, indices in day_groups.items():
            if len(indices) >= min_per_day:
                prob += lpSum([x[i] for i in indices]) >= min_per_day, f"min_day_{day}"
        
        # Constraint 5: Balanced movie distribution (soft constraint via diversity bonus in objective)
        # Already handled through priority scores
        
        # Solve
        solver = PULP_CBC_CMD(msg=0, timeLimit=60)  # 60 second time limit
        prob.solve(solver)
        
        if LpStatus[prob.status] != 'Optimal':
            print(f"    Warning: IP status = {LpStatus[prob.status]}, using best found solution")
        
        # Extract selected candidates
        selected = []
        for i in range(n):
            if value(x[i]) == 1:
                selected.append(candidates[i])
        
        return selected
    
    def _greedy_fallback(
        self, 
        candidates: List[Dict],
        rooms: List[RoomData],
        constraints: Dict[str, Any]
    ) -> List[Dict]:
        """
        Greedy fallback khi không có PuLP.
        """
        selected = []
        occupied_slots: Dict[str, List[Tuple[int, int]]] = defaultdict(list)
        movie_day_count: Dict[str, int] = defaultdict(int)
        
        max_per_movie = constraints.get('max_shows_per_movie_per_day', 4)
        
        # Sort by expected revenue
        sorted_candidates = sorted(
            candidates, 
            key=lambda x: x['expected_revenue'], 
            reverse=True
        )
        
        for cand in sorted_candidates:
            room_id = cand['room'].roomId
            dt = cand['datetime']
            movie_id = cand['movie'].id
            date_key = cand['date_key']
            
            # Check movie limit
            movie_key = f"{movie_id}_{date_key}"
            if movie_day_count[movie_key] >= max_per_movie:
                continue
            
            # Check room conflict
            room_key = f"{room_id}_{date_key}"
            runtime = cand['movie'].runtime
            start_slot = dt.hour * 2 + dt.minute // 30
            end_slot = start_slot + (runtime + 30) // 30
            
            conflict = False
            for existing_start, existing_end in occupied_slots[room_key]:
                if not (end_slot <= existing_start or start_slot >= existing_end):
                    conflict = True
                    break
            
            if conflict:
                continue
            
            # Select this candidate
            selected.append(cand)
            occupied_slots[room_key].append((start_slot, end_slot))
            movie_day_count[movie_key] += 1
        
        return selected
    
    def _format_schedule(
        self, 
        selected: List[Dict],
        movies: List[MovieData]
    ) -> List[Dict[str, Any]]:
        """
        Format selected candidates into output schedule.
        """
        # Create movie lookup
        movie_lookup = {m.id: m for m in movies}
        
        schedule = []
        for cand in selected:
            movie = cand['movie']
            
            # Calculate dynamic price
            price = self._calculate_price(cand)
            
            # Generate reasoning
            reasoning = self._generate_reasoning(cand)
            
            schedule.append({
                'movieId': movie.id,
                'movieTitle': movie.title,
                'roomId': cand['room'].roomId,
                'showDateTime': cand['datetime'].isoformat(),
                'price': round(price, 2),
                'predictedDemand': round(cand['predicted_demand'], 1),
                'expectedRevenue': round(cand['expected_revenue'], 2),
                'confidence': round(cand['confidence'], 2),
                'reasoning': reasoning,
                'priority_score': round(cand['priority'], 2),
            })
        
        # Sort by datetime
        schedule.sort(key=lambda x: x['showDateTime'])
        
        return schedule
    
    def _calculate_price(self, candidate: Dict) -> float:
        """
        Dynamic pricing dựa trên demand prediction.
        """
        base_price = 10.0
        demand = candidate['predicted_demand']
        
        # Demand-based pricing
        if demand > 60:
            price_mult = 1.4
        elif demand > 45:
            price_mult = 1.25
        elif demand > 30:
            price_mult = 1.1
        else:
            price_mult = 1.0
        
        # Time-based pricing
        hour = candidate['datetime'].hour
        if 19 <= hour <= 21:
            price_mult *= 1.15
        
        # Weekend pricing
        if candidate['datetime'].weekday() in [5, 6]:
            price_mult *= 1.1
        
        return base_price * price_mult
    
    def _generate_reasoning(self, candidate: Dict) -> str:
        """
        Generate human-readable reasoning.
        """
        reasons = []
        
        dt = candidate['datetime']
        movie = candidate['movie']
        demand = candidate['predicted_demand']
        
        # Time reasoning
        if 19 <= dt.hour <= 21:
            reasons.append("prime time slot")
        elif 14 <= dt.hour <= 18:
            reasons.append("popular afternoon slot")
        
        # Day reasoning
        if dt.weekday() in [5, 6]:
            reasons.append("weekend advantage")
        elif dt.weekday() == 4 and dt.hour >= 17:
            reasons.append("Friday evening boost")
        
        # Demand reasoning
        if demand > 50:
            reasons.append(f"high predicted demand ({demand:.0f} seats)")
        elif demand > 35:
            reasons.append(f"good demand ({demand:.0f} seats)")
        
        # Movie reasoning
        if movie.popularity and movie.popularity > 7:
            reasons.append("popular movie")
        
        if hasattr(movie, 'voteAverage') and movie.voteAverage and movie.voteAverage > 7.5:
            reasons.append("highly rated")
        
        # Priority reasoning
        if candidate['priority'] > 1.5:
            reasons.append("high priority match")
        
        if reasons:
            return "Selected due to: " + ", ".join(reasons)
        else:
            return "Standard scheduling based on availability"