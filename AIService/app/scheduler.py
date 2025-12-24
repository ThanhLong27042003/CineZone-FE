from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import numpy as np

from .models import MovieData, ShowData, BookingData

from sklearn.ensemble import GradientBoostingRegressor


class ScheduleOptimizer:
    """AI-powered show schedule optimizer"""

    def __init__(self):
        self.demand_predictor = GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.is_trained = False

    def train_demand_model(self, historical_data: List[BookingData]):
        """Train ML model to predict demand"""

        if len(historical_data) < 50:
            print("⚠️ Insufficient training data, using rule-based predictions")
            return

        import pandas as pd
        df = pd.DataFrame([b.dict() for b in historical_data])
        df['showDateTime'] = pd.to_datetime(df['showDateTime'])

        # Feature engineering
        df['hour'] = df['showDateTime'].dt.hour
        df['dayOfWeek'] = df['showDateTime'].dt.dayofweek
        df['isWeekend'] = df['dayOfWeek'].isin([5, 6]).astype(int)
        df['month'] = df['showDateTime'].dt.month

        # Aggregate by show
        features = df.groupby(['showId', 'hour', 'dayOfWeek', 'isWeekend', 'month']).agg({
            'seatCount': 'sum',
            'totalPrice': 'sum'
        }).reset_index()

        X = features[['hour', 'dayOfWeek', 'isWeekend', 'month']]
        y = features['seatCount']

        self.demand_predictor.fit(X, y)
        self.is_trained = True
        print("✅ Demand prediction model trained successfully")

    def optimize_schedule(
        self,
        movies: List[MovieData],
        existing_shows: List[ShowData],
        rooms: List[int],
        date_range: Dict[str, str],
        constraints: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate optimized show schedule"""

        start_date = datetime.fromisoformat(date_range['start'])
        end_date = datetime.fromisoformat(date_range['end'])

        optimized_schedule = []

        # Time slots (assuming cinema operates 10 AM - 11 PM)
        time_slots = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]

        current_date = start_date

        while current_date <= end_date:
            day_of_week = current_date.weekday()
            is_weekend = day_of_week in [5, 6]

            # Sort movies by predicted popularity
            sorted_movies = self._rank_movies_by_demand(movies, day_of_week, is_weekend)

            # Allocate shows to rooms and time slots
            room_schedules = {room: [] for room in rooms}

            for time_slot in time_slots:
                for room_id in rooms:
                    # Check if room is available
                    if self._is_room_available(room_schedules[room_id], time_slot):
                        # Select best movie for this slot
                        movie = self._select_movie_for_slot(
                            sorted_movies,
                            time_slot,
                            is_weekend,
                            room_schedules
                        )

                        if movie:
                            show_time = current_date.replace(hour=time_slot, minute=0)

                            # Predict demand and calculate optimal price
                            predicted_demand = self._predict_demand(time_slot, day_of_week, is_weekend)

                            optimal_price = self._calculate_dynamic_price(
                                movie, time_slot, is_weekend, predicted_demand
                            )

                            show = {
                                "movieId": movie.id,
                                "movieTitle": movie.title,
                                "roomId": room_id,
                                "showDateTime": show_time.isoformat(),
                                "price": round(optimal_price, 2),
                                "predictedDemand": round(predicted_demand, 2),
                                "confidence": 0.75 + (0.15 if self.is_trained else 0),
                                "reasoning": self._generate_reasoning(movie, time_slot, is_weekend, predicted_demand)
                            }

                            optimized_schedule.append(show)
                            room_schedules[room_id].append({
                                "time": time_slot,
                                "duration": movie.runtime,
                                "movie": movie
                            })

            current_date += timedelta(days=1)

        return optimized_schedule

    def _rank_movies_by_demand(self, movies: List[MovieData], day_of_week: int, is_weekend: bool) -> List[MovieData]:
        """Rank movies by predicted demand"""

        scored_movies = []
        for movie in movies:
            score = movie.popularity

            # Boost for weekend
            if is_weekend:
                score *= 1.3

            # Boost for popular genres (assumed: Action=1, Comedy=2, Drama=3)
            if 1 in movie.genreIds or 2 in movie.genreIds:
                score *= 1.2

            scored_movies.append((score, movie))

        scored_movies.sort(reverse=True, key=lambda x: x[0])
        return [m for _, m in scored_movies]

    def _is_room_available(self, schedule: List[Dict], time_slot: int) -> bool:
        """Check if room is available at given time"""

        for show in schedule:
            show_start = show['time']
            show_end = show_start + (show['duration'] / 60) + 0.5  # 30 min buffer

            if show_start <= time_slot < show_end:
                return False

        return True

    def _select_movie_for_slot(self, movies: List[MovieData], time_slot: int, is_weekend: bool, room_schedules: Dict) -> Optional[MovieData]:
        """Select best movie for time slot"""

        for movie in movies:
            # Check if movie already scheduled too many times today
            times_scheduled = sum(
                1 for schedule in room_schedules.values()
                for show in schedule
                if show['movie'].id == movie.id
            )

            if times_scheduled < 3:  # Max 3 shows per movie per day
                return movie

        return None

    def _predict_demand(self, hour: int, day_of_week: int, is_weekend: int) -> float:
        """Predict demand for given time slot"""

        if self.is_trained:
            X = np.array([[hour, day_of_week, is_weekend, 1]])
            return max(self.demand_predictor.predict(X)[0], 10)

        # Rule-based fallback
        base_demand = 40

        # Time of day factors
        if 18 <= hour <= 21:  # Prime time
            base_demand *= 1.5
        elif 14 <= hour <= 17:  # Afternoon
            base_demand *= 1.2

        # Weekend boost
        if is_weekend:
            base_demand *= 1.4

        return base_demand

    def _calculate_dynamic_price(self, movie: MovieData, hour: int, is_weekend: bool, predicted_demand: float) -> float:
        """Calculate optimal price based on demand"""

        base_price = 10.0

        # Demand-based pricing
        if predicted_demand > 50:
            base_price *= 1.3
        elif predicted_demand > 35:
            base_price *= 1.15

        # Time-based pricing
        if 18 <= hour <= 21:  # Prime time
            base_price *= 1.2

        # Weekend pricing
        if is_weekend:
            base_price *= 1.15

        # Popularity factor
        if movie.popularity > 8.0:
            base_price *= 1.1

        return base_price

    def _generate_reasoning(self, movie: MovieData, hour: int, is_weekend: bool, demand: float) -> str:
        """Generate human-readable reasoning"""

        reasons = []

        if 18 <= hour <= 21:
            reasons.append("prime time slot")

        if is_weekend:
            reasons.append("weekend advantage")

        if demand > 45:
            reasons.append("high predicted demand")

        if movie.popularity > 7.5:
            reasons.append("popular movie")

        return "Selected due to: " + ", ".join(reasons) if reasons else "Standard scheduling"