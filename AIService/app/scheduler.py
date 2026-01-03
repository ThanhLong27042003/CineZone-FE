"""
AI-powered Cinema Show Scheduler
Combines: Rule-based filtering → XGBoost prediction → Integer Programming optimization
"""

from typing import List, Dict, Any, Optional
from datetime import datetime

from .models import MovieData, ShowData, BookingData, RoomData
from .feature_engineering import FeatureExtractor, RuleBasedFilter
from .demand_predictor import DemandPredictor
from .integer_optimizer import IntegerProgrammingOptimizer


class ScheduleOptimizer:
    """
    Main scheduler class that orchestrates the optimization pipeline.
    """
    
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.rule_filter = RuleBasedFilter()
        self.demand_predictor = DemandPredictor(self.feature_extractor)
        self.ip_optimizer = IntegerProgrammingOptimizer(
            self.feature_extractor,
            self.demand_predictor,
            self.rule_filter
        )
        
        # Try to load existing model
        self.demand_predictor.load_model()
    
    @property
    def is_trained(self) -> bool:
        return self.demand_predictor.is_trained
    
    def train_demand_model(
        self, 
        historical_data: List[BookingData],
        movies_lookup: Optional[Dict[int, MovieData]] = None
    ) -> Dict[str, Any]:
        """
        Train the XGBoost demand prediction model.
        """
        if movies_lookup is None:
            movies_lookup = {}
        
        # Build historical patterns first
        self.feature_extractor.build_historical_patterns(historical_data)
        
        # Train model
        result = self.demand_predictor.train(historical_data, movies_lookup)
        
        return result
    
    def optimize_schedule(
        self,
        movies: List[MovieData],
        existing_shows: List[ShowData],
        rooms: List[int], 
        date_range: Dict[str, str],
        constraints: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Generate optimized show schedule.
        
        Pipeline:
        1. Convert room IDs to RoomData objects
        2. Apply rule-based filtering
        3. Predict demand using XGBoost
        4. Optimize using Integer Programming
        """
        
        # Convert room IDs to RoomData
        room_objects = [
            RoomData(roomId=rid, name=f"Room {rid}", capacity=90)
            for rid in rooms
        ]
        
        # Validate inputs
        if not movies:
            return []
        
        if not room_objects:
            return []
        
        # Apply default constraints
        default_constraints = {
            'max_shows_per_day': 10,
            'min_break_between_shows': 30,
            'max_shows_per_movie_per_day': 4,
            'min_shows_per_day': 3,
            'max_candidates': 2000,
        }
        default_constraints.update(constraints)
        
        # Run optimization
        schedule = self.ip_optimizer.optimize(
            movies=movies,
            existing_shows=existing_shows,
            rooms=room_objects,
            date_range=date_range,
            constraints=default_constraints
        )
        
        return schedule
    
    def predict_single_demand(
        self,
        movie: MovieData,
        show_datetime: datetime,
        room_id: int
    ) -> Dict[str, Any]:
        """
        Predict demand for a single show.
        """
        demand, confidence = self.demand_predictor.predict(
            movie, show_datetime, room_id
        )
        
        return {
            'predicted_demand': round(demand, 1),
            'confidence': round(confidence, 2),
            'is_ml_prediction': self.is_trained
        }
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the current model state.
        """
        return {
            'is_trained': self.is_trained,
            'training_stats': self.demand_predictor.training_stats,
            'feature_importance': self.demand_predictor.feature_importance,
            'historical_patterns': self.feature_extractor.historical_patterns
        }
    
    # Legacy method compatibility
    def _predict_demand(self, hour: int, day_of_week: int, is_weekend: int) -> float:
        """
        Legacy method for backward compatibility.
        """
        # Create dummy movie for prediction
        dummy_movie = MovieData(
            id=0, title="", genreIds=[], castIds=[],
            runtime=120, popularity=5.0
        )
        
        dt = datetime.now().replace(hour=hour, minute=0)
        # Adjust to correct day of week (simplified)
        
        demand, _ = self.demand_predictor._rule_based_predict(
            dummy_movie, dt, room_id=1
        )
        
        return demand