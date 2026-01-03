"""
Feature Engineering Module for Cinema Scheduling
Extracts meaningful features from existing entity data without requiring schema changes.
"""

from typing import List, Dict, Any, Tuple, Optional, Set
from datetime import datetime, timedelta
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
import numpy as np
import pandas as pd

from .models import BookingData, MovieData, ShowData, RoomData


class FeatureExtractor:
    """
    Extract features từ dữ liệu hiện có của các entity.
    Không yêu cầu thêm field hay entity mới.
    """
    
    # Time slot categories dựa trên nghiên cứu thực tế về cinema attendance
    TIME_SLOT_CONFIG = {
        'early_morning': (6, 10),
        'morning': (10, 12),
        'lunch': (12, 14),
        'afternoon': (14, 17),
        'early_evening': (17, 19),
        'prime_time': (19, 22),
        'late_night': (22, 24),
    }
    
    DAY_MULTIPLIERS = {
        0: 0.7, 1: 0.75, 2: 0.8, 3: 0.85,
        4: 1.1, 5: 1.3, 6: 1.2,
    }
    
    HOUR_MULTIPLIERS = {
        10: 0.5, 11: 0.6, 12: 0.7, 13: 0.75,
        14: 0.8, 15: 0.85, 16: 0.9, 17: 1.0,
        18: 1.1, 19: 1.3, 20: 1.4, 21: 1.3,
        22: 1.0, 23: 0.7
    }
    
    def __init__(self):
        self.genre_popularity_cache: Dict[int, float] = {}
        self.movie_performance_cache: Dict[int, Dict] = {}
        self.room_utilization_cache: Dict[int, float] = {}
        self.historical_patterns: Dict[str, Any] = {}
        
    def build_historical_patterns(self, bookings: List[BookingData]) -> None:
        """
        Xây dựng patterns từ dữ liệu booking lịch sử.
        """
        if not bookings:
            return
            
        df = pd.DataFrame([b.dict() for b in bookings])
        df['showDateTime'] = pd.to_datetime(df['showDateTime'])
        df['bookingDate'] = pd.to_datetime(df['bookingDate'])
        
        # 1. Genre popularity từ actual bookings
        genre_bookings = defaultdict(lambda: {'total_seats': 0, 'total_revenue': 0, 'count': 0})
        for _, row in df.iterrows():
            for genre_id in row.get('genreIds', []):
                genre_bookings[genre_id]['total_seats'] += row['seatCount']
                genre_bookings[genre_id]['total_revenue'] += row['totalPrice']
                genre_bookings[genre_id]['count'] += 1
        
        if genre_bookings:
            max_seats = max(g['total_seats'] for g in genre_bookings.values()) or 1
            self.genre_popularity_cache = {
                gid: data['total_seats'] / max_seats 
                for gid, data in genre_bookings.items()
            }
        
        # 2. Movie performance metrics
        movie_stats = df.groupby('movieId').agg({
            'seatCount': ['sum', 'mean', 'count'],
            'totalPrice': ['sum', 'mean']
        })
        
        movie_stats.columns = ['_'.join(col).strip() for col in movie_stats.columns.values]
        movie_stats = movie_stats.reset_index()
        
        for _, row in movie_stats.iterrows():
            movie_id = int(row['movieId'])
            self.movie_performance_cache[movie_id] = {
                'total_seats': float(row['seatCount_sum']),
                'avg_seats': float(row['seatCount_mean']),
                'booking_count': int(row['seatCount_count']),
                'total_revenue': float(row['totalPrice_sum']),
                'avg_revenue': float(row['totalPrice_mean']),
            }
        
        # 3. Time-based patterns
        df['hour'] = df['showDateTime'].dt.hour
        df['day_of_week'] = df['showDateTime'].dt.dayofweek
        
        hourly_demand = df.groupby('hour')['seatCount'].mean().to_dict()
        daily_demand = df.groupby('day_of_week')['seatCount'].mean().to_dict()
        
        self.historical_patterns = {
            'hourly_demand': hourly_demand,
            'daily_demand': daily_demand,
            'avg_booking_lead_time': float((df['showDateTime'] - df['bookingDate']).dt.days.mean()),
            'avg_seats_per_booking': float(df['seatCount'].mean()),
            'total_bookings': len(df),
        }
        
    def extract_temporal_features(self, dt: datetime) -> Dict[str, Any]:
        """Extract temporal features từ datetime."""
        hour = dt.hour
        day_of_week = dt.weekday()
        
        time_slot = 'other'
        for slot_name, (start, end) in self.TIME_SLOT_CONFIG.items():
            if start <= hour < end:
                time_slot = slot_name
                break
        
        month = dt.month
        day = dt.day
        
        return {
            'hour': hour,
            'day_of_week': day_of_week,
            'month': month,
            'day_of_month': day,
            'is_weekend': int(day_of_week in [5, 6]),
            'is_friday_evening': int(day_of_week == 4 and hour >= 17),
            'is_holiday_season': int(month in [12, 1, 6, 7, 8]),
            'is_month_end': int(day >= 25),
            'time_slot': time_slot,
            'time_slot_encoded': list(self.TIME_SLOT_CONFIG.keys()).index(time_slot) if time_slot in self.TIME_SLOT_CONFIG else 0,
            'hour_multiplier': self.HOUR_MULTIPLIERS.get(hour, 0.8),
            'day_multiplier': self.DAY_MULTIPLIERS.get(day_of_week, 0.8),
        }
    
    def extract_movie_features(self, movie: MovieData) -> Dict[str, Any]:
        """Extract features từ Movie entity."""
        movie_age = 0
        if movie.releaseDate:
            try:
                if isinstance(movie.releaseDate, str):
                    release = datetime.fromisoformat(movie.releaseDate.replace('Z', '+00:00'))
                else:
                    release = movie.releaseDate
                movie_age = (datetime.now() - release.replace(tzinfo=None)).days
            except:
                movie_age = 30
        
        vote_score = movie.voteAverage or 0
        vote_count = movie.voteCount or 0
        
        min_votes = 100
        global_avg = 6.5
        bayesian_avg = (vote_count * vote_score + min_votes * global_avg) / (vote_count + min_votes)
        
        genre_score = 0
        if movie.genreIds:
            genre_scores = [self.genre_popularity_cache.get(gid, 0.5) for gid in movie.genreIds]
            genre_score = np.mean(genre_scores) if genre_scores else 0.5
        
        perf = self.movie_performance_cache.get(movie.id, {})
        historical_avg_seats = perf.get('avg_seats', 0)
        historical_booking_count = perf.get('booking_count', 0)
        
        if movie_age <= 14:
            freshness = 1.5
        elif movie_age <= 30:
            freshness = 1.2
        elif movie_age <= 60:
            freshness = 1.0
        elif movie_age <= 90:
            freshness = 0.8
        else:
            freshness = 0.6
        
        runtime = movie.runtime or 120
            
        return {
            'movie_id': movie.id,
            'runtime': runtime,
            'vote_average': vote_score,
            'vote_count': vote_count,
            'bayesian_rating': bayesian_avg,
            'popularity_score': movie.popularity or 5.0,
            'movie_age_days': movie_age,
            'freshness_score': freshness,
            'genre_popularity_score': genre_score,
            'historical_avg_seats': historical_avg_seats,
            'historical_booking_count': historical_booking_count,
            'num_genres': len(movie.genreIds) if movie.genreIds else 0,
        }
    
    def calculate_demand_features(
        self, 
        movie: MovieData, 
        show_datetime: datetime,
        room_id: int
    ) -> np.ndarray:
        """Tạo feature vector cho XGBoost prediction."""
        temporal = self.extract_temporal_features(show_datetime)
        movie_feats = self.extract_movie_features(movie)
        
        feature_vector = [
            temporal['hour'],
            temporal['day_of_week'],
            temporal['is_weekend'],
            temporal['is_friday_evening'],
            temporal['is_holiday_season'],
            temporal['is_month_end'],
            temporal['time_slot_encoded'],
            temporal['hour_multiplier'] * temporal['day_multiplier'],
            movie_feats['runtime'] / 60,
            movie_feats['bayesian_rating'] / 10,
            np.log1p(movie_feats['vote_count']) / 10,
            movie_feats['popularity_score'] / 10,
            movie_feats['freshness_score'],
            movie_feats['genre_popularity_score'],
            movie_feats['historical_avg_seats'] / 100 if movie_feats['historical_avg_seats'] else 0.4,
            movie_feats['num_genres'] / 5,
            room_id / 10,
        ]
        
        return np.array(feature_vector, dtype=np.float32)
    
    def get_feature_names(self) -> List[str]:
        """Return tên các features để debug/explain"""
        return [
            'hour', 'day_of_week', 'is_weekend', 'is_friday_evening',
            'is_holiday_season', 'is_month_end', 'time_slot_encoded', 'time_multiplier',
            'runtime_hours', 'bayesian_rating', 'log_vote_count', 'popularity',
            'freshness', 'genre_popularity', 'historical_avg_seats', 'num_genres',
            'room_id_encoded'
        ]


class RuleBasedFilter:
    """
    Heuristic + Rule-based filtering với OPTIMIZED PERFORMANCE.
    Sử dụng vectorization và early filtering để tăng tốc.
    """
    
    MIN_BREAK_BETWEEN_SHOWS = 30
    OPERATING_HOURS = (9, 24)
    MAX_SHOWS_PER_MOVIE_PER_DAY = 4
    
    # Optimal time slots - chỉ generate các slots này thay vì mỗi 30 phút
    OPTIMAL_START_TIMES = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
    
    def __init__(self):
        # Pre-computed caches
        self._existing_shows_index: Dict[str, List[Tuple[datetime, datetime]]] = {}
        self._movie_features_cache: Dict[int, Dict] = {}
        
    def _build_existing_shows_index(
        self, 
        existing_shows: List[ShowData]
    ) -> Dict[str, List[Tuple[datetime, datetime]]]:
        """
        Tạo index cho existing shows theo room và ngày để lookup O(1).
        """
        index = defaultdict(list)
        
        for show in existing_shows:
            try:
                show_start = datetime.fromisoformat(
                    show.showDateTime.replace('Z', '+00:00')
                ).replace(tzinfo=None)
                show_end = show_start + timedelta(minutes=150)  # Default buffer
                
                # Key = "roomId_date"
                key = f"{show.roomId}_{show_start.date()}"
                index[key].append((show_start, show_end))
            except:
                continue
                
        return dict(index)
    
    def _check_room_conflict_fast(
        self,
        room_id: int,
        proposed_start: datetime,
        proposed_end: datetime
    ) -> bool:
        """
        Check room conflict với O(k) thay vì O(n).
        k = số shows trong room đó vào ngày đó (thường < 10)
        n = tổng số existing shows (có thể hàng trăm)
        """
        key = f"{room_id}_{proposed_start.date()}"
        existing_slots = self._existing_shows_index.get(key, [])
        
        for show_start, show_end in existing_slots:
            # Check overlap
            if not (proposed_end <= show_start or proposed_start >= show_end):
                return True  # Conflict!
                
        return False  # No conflict
    
    def _get_movie_release_date(self, movie: MovieData) -> Optional[datetime]:
        """Parse release date một lần và cache."""
        if movie.id in self._movie_features_cache:
            return self._movie_features_cache[movie.id].get('release_date')
            
        release_date = None
        if movie.releaseDate:
            try:
                if isinstance(movie.releaseDate, str):
                    release_date = datetime.fromisoformat(
                        movie.releaseDate.replace('Z', '+00:00')
                    ).replace(tzinfo=None)
                else:
                    release_date = movie.releaseDate.replace(tzinfo=None)
            except:
                pass
                
        self._movie_features_cache[movie.id] = {'release_date': release_date}
        return release_date
    
    def _is_kids_movie(self, movie: MovieData) -> bool:
        """Check if movie is for kids."""
        kids_genres = {16, 10751}  # Animation, Family
        return bool(movie.genreIds and any(g in kids_genres for g in movie.genreIds))
    
    def _filter_movies_for_date(
        self,
        movies: List[MovieData],
        target_date: datetime
    ) -> List[MovieData]:
        """
        Filter movies có thể chiếu vào ngày cụ thể.
        Chỉ chạy 1 lần cho mỗi ngày thay vì mỗi slot.
        """
        available = []
        target_date_only = target_date.date()
        
        for movie in movies:
            release_date = self._get_movie_release_date(movie)
            
            # Phim chưa ra mắt
            if release_date and target_date_only < release_date.date():
                continue
                
            available.append(movie)
            
        return available
    
    def _calculate_priority_batch(
        self,
        movies: List[MovieData],
        proposed_dt: datetime,
        feature_extractor: FeatureExtractor
    ) -> Dict[int, float]:
        """
        Tính priority cho nhiều movies cùng lúc với temporal features chung.
        """
        temporal = feature_extractor.extract_temporal_features(proposed_dt)
        hour = temporal['hour']
        
        priorities = {}
        
        for movie in movies:
            movie_feats = feature_extractor.extract_movie_features(movie)
            
            score = 1.0
            
            # Heuristic 1: Prime time + popular movie
            if temporal['time_slot'] == 'prime_time':
                score *= 1.5
                if movie_feats['popularity_score'] > 7:
                    score *= 1.3
            
            # Heuristic 2: Weekend + blockbuster
            if temporal['is_weekend']:
                score *= 1.2
                if movie_feats['vote_count'] > 1000:
                    score *= 1.15
            
            # Heuristic 3: New release bonus
            score *= movie_feats['freshness_score']
            
            # Heuristic 4: Historical performance
            if movie_feats['historical_booking_count'] > 0:
                score *= (1 + movie_feats['historical_avg_seats'] / 100)
            
            # Heuristic 5: Genre-time matching
            action_genres = {28, 53, 27}
            comedy_genres = {35, 10749}
            
            if movie.genreIds:
                genre_set = set(movie.genreIds)
                if genre_set & action_genres and hour >= 18:
                    score *= 1.1
                if genre_set & comedy_genres and 14 <= hour <= 18:
                    score *= 1.1
            
            priorities[movie.id] = score
            
        return priorities
    
    def prefilter_candidates(
        self,
        movies: List[MovieData],
        rooms: List[RoomData],
        date_range: Dict[str, str],
        existing_shows: List[ShowData],
        feature_extractor: FeatureExtractor
    ) -> List[Dict[str, Any]]:
        """
        Tạo danh sách candidates với OPTIMIZED PERFORMANCE.
        
        Optimizations:
        1. Build index cho existing shows một lần
        2. Filter movies theo ngày một lần (không lặp lại mỗi slot)
        3. Batch calculate priorities
        4. Early exit khi đủ candidates
        5. Skip slots không hiệu quả (đêm khuya)
        """
        import time
        start_time = time.time()
        
        candidates = []
        daily_movie_count: Dict[str, int] = defaultdict(int)
        
        # Parse date range
        start_date = datetime.fromisoformat(date_range['start'])
        end_date = datetime.fromisoformat(date_range['end'])
        
        # OPTIMIZATION 1: Build index một lần
        self._existing_shows_index = self._build_existing_shows_index(existing_shows)
        print(f"  → Built existing shows index: {len(self._existing_shows_index)} room-date combinations")
        
        # OPTIMIZATION 2: Pre-filter movies globally (loại phim chưa ra mắt trong toàn bộ range)
        available_movies = self._filter_movies_for_date(movies, end_date)
        print(f"  → {len(available_movies)}/{len(movies)} movies available in date range")
        
        if not available_movies:
            return []
        
        # OPTIMIZATION 3: Pre-compute movie features
        for movie in available_movies:
            if movie.id not in self._movie_features_cache:
                self._movie_features_cache[movie.id] = {
                    'release_date': self._get_movie_release_date(movie),
                    'is_kids': self._is_kids_movie(movie),
                    'runtime': movie.runtime or 120,
                    'is_long': (movie.runtime or 120) > 150,
                }
        
        # Iterate through dates
        current_date = start_date
        total_days = (end_date - start_date).days + 1
        
        while current_date <= end_date:
            # OPTIMIZATION 4: Filter movies cho ngày này
            date_available_movies = self._filter_movies_for_date(available_movies, current_date)
            
            if not date_available_movies:
                current_date += timedelta(days=1)
                continue
            
            # OPTIMIZATION 5: Chỉ iterate qua optimal start times
            for hour in self.OPTIMAL_START_TIMES:
                proposed_dt = current_date.replace(hour=hour, minute=0, second=0, microsecond=0)
                
                # OPTIMIZATION 6: Batch calculate priorities cho tất cả movies ở slot này
                priorities = self._calculate_priority_batch(
                    date_available_movies, proposed_dt, feature_extractor
                )
                
                for room in rooms:
                    room_id = room.roomId
                    
                    for movie in date_available_movies:
                        movie_cache = self._movie_features_cache.get(movie.id, {})
                        runtime = movie_cache.get('runtime', 120)
                        
                        # OPTIMIZATION 7: Quick checks trước (không cần gọi function)
                        
                        # Check max shows per movie per day
                        movie_key = f"{movie.id}_{current_date.date()}"
                        if daily_movie_count.get(movie_key, 0) >= self.MAX_SHOWS_PER_MOVIE_PER_DAY:
                            continue
                        
                        # Check phim dài vào late night
                        if hour >= 22 and movie_cache.get('is_long', False):
                            continue
                        
                        # Check phim thiếu nhi vào late night
                        if hour >= 21 and movie_cache.get('is_kids', False):
                            continue
                        
                        # OPTIMIZATION 8: Fast room conflict check
                        proposed_end = proposed_dt + timedelta(minutes=runtime + self.MIN_BREAK_BETWEEN_SHOWS)
                        
                        if self._check_room_conflict_fast(room_id, proposed_dt, proposed_end):
                            continue
                        
                        # Get priority từ batch calculation
                        priority = priorities.get(movie.id, 1.0)
                        
                        if priority >= 0.5:
                            candidates.append({
                                'movie': movie,
                                'room': room,
                                'room_id': room_id,
                                'datetime': proposed_dt,
                                'date_key': str(proposed_dt.date()),
                                'priority': priority
                            })
                            
                            # Update count
                            daily_movie_count[movie_key] += 1
            
            current_date += timedelta(days=1)
        
        # Sort by priority descending
        candidates.sort(key=lambda x: x['priority'], reverse=True)
        
        elapsed = time.time() - start_time
        print(f"  → Generated {len(candidates)} candidates in {elapsed:.2f}s")
        
        return candidates
    
    def filter_valid_slots(
        self,
        movie: MovieData,
        room_id: int,
        proposed_datetime: datetime,
        existing_shows: List[ShowData],
        daily_movie_count: Dict[int, int]
    ) -> Tuple[bool, str]:
        """
        Legacy method - giữ lại để backward compatibility.
        Recommend sử dụng prefilter_candidates() với optimizations.
        """
        hour = proposed_datetime.hour
        
        # Check release date
        release_date = self._get_movie_release_date(movie)
        if release_date and proposed_datetime.date() < release_date.date():
            return False, f"Movie not released yet"
        
        # Operating hours
        if hour < self.OPERATING_HOURS[0] or hour >= self.OPERATING_HOURS[1]:
            return False, "Outside operating hours"
        
        # Max shows per movie per day
        movie_key = f"{movie.id}_{proposed_datetime.date()}"
        if daily_movie_count.get(movie_key, 0) >= self.MAX_SHOWS_PER_MOVIE_PER_DAY:
            return False, "Max shows per movie per day reached"
        
        # Room conflict
        runtime = movie.runtime or 120
        proposed_end = proposed_datetime + timedelta(minutes=runtime + self.MIN_BREAK_BETWEEN_SHOWS)
        
        if self._check_room_conflict_fast(room_id, proposed_datetime, proposed_end):
            return False, f"Room {room_id} conflict"
        
        # Long movie late night
        if hour >= 22 and runtime > 150:
            return False, "Long movie too late"
        
        # Kids movie late
        if hour >= 21 and self._is_kids_movie(movie):
            return False, "Kids movie too late"
        
        return True, "Valid"
    
    def calculate_slot_priority(
        self,
        movie: MovieData,
        proposed_datetime: datetime,
        feature_extractor: FeatureExtractor
    ) -> float:
        """Legacy method - sử dụng _calculate_priority_batch() thay thế."""
        priorities = self._calculate_priority_batch([movie], proposed_datetime, feature_extractor)
        return priorities.get(movie.id, 1.0)