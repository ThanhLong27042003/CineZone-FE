"""
XGBoost-based Demand Prediction Model
Sử dụng các feature được extract từ entity hiện có.
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import numpy as np
import pandas as pd
import pickle
import os
from pathlib import Path

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    print("Warning: XGBoost not available, using fallback")

from .modelss import BookingData, MovieData
from .feature_engineering import FeatureExtractor


class DemandPredictor:
    """
    XGBoost-based demand predictor với fallback rule-based.
    """
    
    MODEL_PATH = Path("models/demand_model.pkl")
    
    # Hyperparameters được tune cho cinema data
    XGBOOST_PARAMS = {
        'objective': 'reg:squarederror',
        'eval_metric': 'rmse',
        'max_depth': 6,
        'learning_rate': 0.1,
        'n_estimators': 200,
        'min_child_weight': 3,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'reg_alpha': 0.1,
        'reg_lambda': 1.0,
        'random_state': 42,
        'n_jobs': -1,
    }
    
    def __init__(self, feature_extractor: FeatureExtractor):
        self.feature_extractor = feature_extractor
        self.model: Optional[xgb.XGBRegressor] = None
        self.is_trained = False
        self.training_stats: Dict[str, Any] = {}
        self.feature_importance: Dict[str, float] = {}
        
    def train(self, bookings: List[BookingData], movies_lookup: Dict[int, MovieData]) -> Dict[str, Any]:
        """
        Train XGBoost model từ historical booking data.
        """
        if not XGBOOST_AVAILABLE:
            return {"success": False, "error": "XGBoost not installed"}
        
        if len(bookings) < 30:
            return {
                "success": False, 
                "error": f"Insufficient data: {len(bookings)} bookings (need at least 30)"
            }
        
        # Build historical patterns first
        self.feature_extractor.build_historical_patterns(bookings)
        
        # Prepare training data
        X, y = self._prepare_training_data(bookings, movies_lookup)
        
        if len(X) < 30:
            return {"success": False, "error": "Insufficient valid training samples"}
        
        # Train-test split (80-20)
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Initialize and train model
        self.model = xgb.XGBRegressor(**self.XGBOOST_PARAMS)
        
        # Train với early stopping
        self.model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=False
        )
        
        # Evaluate
        train_pred = self.model.predict(X_train)
        test_pred = self.model.predict(X_test)
        
        train_rmse = np.sqrt(np.mean((train_pred - y_train) ** 2))
        test_rmse = np.sqrt(np.mean((test_pred - y_test) ** 2))
        
        # Feature importance
        feature_names = self.feature_extractor.get_feature_names()
        importances = self.model.feature_importances_
        self.feature_importance = dict(zip(feature_names, importances))
        
        self.is_trained = True
        self.training_stats = {
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'train_rmse': float(train_rmse),
            'test_rmse': float(test_rmse),
            'feature_importance': dict(sorted(
                self.feature_importance.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:10])
        }
        
        # Save model
        self._save_model()
        
        return {
            "success": True,
            "stats": self.training_stats,
            "message": f"Model trained successfully on {len(X_train)} samples"
        }
    
    def _prepare_training_data(
        self, 
        bookings: List[BookingData], 
        movies_lookup: Dict[int, MovieData]
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Prepare feature matrix X và target vector y từ bookings.
        """
        X_list = []
        y_list = []
        
        # Aggregate bookings by show để tính total demand
        show_demand: Dict[int, Dict] = {}
        
        for booking in bookings:
            show_id = booking.showId
            if show_id not in show_demand:
                show_demand[show_id] = {
                    'total_seats': 0,
                    'booking': booking,
                    'count': 0
                }
            show_demand[show_id]['total_seats'] += booking.seatCount
            show_demand[show_id]['count'] += 1
        
        for show_id, data in show_demand.items():
            booking = data['booking']
            movie = movies_lookup.get(booking.movieId)
            
            if movie is None:
                # Create dummy movie from booking data
                movie = MovieData(
                    id=booking.movieId,
                    title=booking.movieTitle,
                    genreIds=booking.genreIds,
                    castIds=booking.castIds,
                    runtime=120,
                    popularity=5.0
                )
            
            try:
                show_dt = datetime.fromisoformat(booking.showDateTime.replace('Z', '+00:00')).replace(tzinfo=None)
            except:
                continue
            
            # Extract features
            features = self.feature_extractor.calculate_demand_features(
                movie, show_dt, room_id=1  # Default room
            )
            
            X_list.append(features)
            y_list.append(data['total_seats'])
        
        return np.array(X_list), np.array(y_list)
    
    def predict(
        self, 
        movie: MovieData, 
        show_datetime: datetime, 
        room_id: int
    ) -> Tuple[float, float]:
        """
        Predict demand cho một show.
        Returns: (predicted_demand, confidence)
        """
        if self.is_trained and self.model is not None:
            features = self.feature_extractor.calculate_demand_features(
                movie, show_datetime, room_id
            )
            features = features.reshape(1, -1)
            
            prediction = self.model.predict(features)[0]
            
            # Confidence dựa trên training stats
            confidence = min(0.9, 0.6 + (self.training_stats.get('train_samples', 0) / 1000))
            
            return max(5, float(prediction)), confidence
        else:
            # Fallback to rule-based prediction
            return self._rule_based_predict(movie, show_datetime, room_id)
    
    def _rule_based_predict(
        self, 
        movie: MovieData, 
        show_datetime: datetime, 
        room_id: int
    ) -> Tuple[float, float]:
        """
        Rule-based fallback prediction khi chưa có trained model.
        """
        temporal = self.feature_extractor.extract_temporal_features(show_datetime)
        movie_feats = self.feature_extractor.extract_movie_features(movie)
        
        # Base demand (average for a cinema)
        base_demand = 35
        
        # Apply multipliers
        demand = base_demand * temporal['hour_multiplier'] * temporal['day_multiplier']
        
        # Weekend boost
        if temporal['is_weekend']:
            demand *= 1.3
        
        # Movie factors
        demand *= movie_feats['freshness_score']
        demand *= (0.5 + movie_feats['bayesian_rating'] / 20)  # 0.5 - 1.0 range
        
        # Genre popularity
        demand *= (0.8 + movie_feats['genre_popularity_score'] * 0.4)
        
        # Historical performance bonus
        if movie_feats['historical_avg_seats'] > 0:
            historical_factor = min(1.5, movie_feats['historical_avg_seats'] / 40)
            demand = demand * 0.7 + movie_feats['historical_avg_seats'] * 0.3 * historical_factor
        
        return max(10, min(100, demand)), 0.55  # Lower confidence for rule-based
    
    def predict_batch(
        self, 
        candidates: List[Dict[str, Any]]
    ) -> List[Tuple[float, float]]:
        """
        Batch prediction cho nhiều candidates.
        """
        if not candidates:
            return []
        
        if self.is_trained and self.model is not None:
            # Prepare batch features
            features_list = []
            for cand in candidates:
                features = self.feature_extractor.calculate_demand_features(
                    cand['movie'], cand['datetime'], cand['room'].roomId
                )
                features_list.append(features)
            
            X = np.array(features_list)
            predictions = self.model.predict(X)
            confidence = min(0.9, 0.6 + (self.training_stats.get('train_samples', 0) / 1000))
            
            return [(max(5, float(p)), confidence) for p in predictions]
        else:
            # Fallback
            return [
                self._rule_based_predict(c['movie'], c['datetime'], c['room'].roomId)
                for c in candidates
            ]
    
    def _save_model(self):
        """Save trained model to disk"""
        if self.model is not None:
            self.MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(self.MODEL_PATH, 'wb') as f:
                pickle.dump({
                    'model': self.model,
                    'training_stats': self.training_stats,
                    'feature_importance': self.feature_importance
                }, f)
    
    def load_model(self) -> bool:
        """Load model từ disk nếu có"""
        if self.MODEL_PATH.exists():
            try:
                with open(self.MODEL_PATH, 'rb') as f:
                    data = pickle.load(f)
                    self.model = data['model']
                    self.training_stats = data.get('training_stats', {})
                    self.feature_importance = data.get('feature_importance', {})
                    self.is_trained = True
                    return True
            except:
                pass
        return False