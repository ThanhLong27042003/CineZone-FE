from fastapi import APIRouter, HTTPException, BackgroundTasks
from datetime import datetime
from typing import List, Dict, Any

from .modelss import (
    AnalyticsRequest, BookingData, ScheduleOptimizationRequest, 
    MovieData, ShowData
)
from .servicess import revenue_analyzer, schedule_optimizer

router = APIRouter()


@router.get("/")
async def root():
    model_info = schedule_optimizer.get_model_info()
    return {
        "service": "CineZone AI Service",
        "version": "2.0.0",
        "status": "operational",
        "model_trained": model_info['is_trained'],
        "endpoints": [
            "/analyze-revenue",
            "/optimize-schedule",
            "/predict-demand",
            "/train-model",
            "/model-info"
        ],
        "features": [
            "XGBoost Demand Prediction",
            "Integer Programming Optimization",
            "Rule-based Pre-filtering",
            "Dynamic Pricing"
        ]
    }


@router.post("/analyze-revenue")
async def analyze_revenue(request: AnalyticsRequest):
    try:
        analysis = revenue_analyzer.analyze_patterns(request.bookings)
        return {
            "success": True,
            "data": analysis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/optimize-schedule")
async def optimize_schedule(request: ScheduleOptimizationRequest):
    """
    Optimize show schedule using:
    1. Rule-based filtering
    2. XGBoost demand prediction  
    3. Integer Programming optimization
    """
    try:
        # Extract room IDs from RoomData objects
        room_ids = [roomId for roomId in request.rooms]
        
        optimized = schedule_optimizer.optimize_schedule(
            movies=request.movies,
            existing_shows=request.existingShows,
            rooms=room_ids,
            date_range=request.dateRange,
            constraints=request.constraints
        )

        # Calculate summary statistics
        total_revenue = sum(s.get('expectedRevenue', 0) for s in optimized)
        avg_demand = sum(s.get('predictedDemand', 0) for s in optimized) / len(optimized) if optimized else 0
        
        return {
            "success": True,
            "schedule": optimized,
            "total_shows": len(optimized),
            "total_expected_revenue": round(total_revenue, 2),
            "average_predicted_demand": round(avg_demand, 1),
            "model_used": "XGBoost + Integer Programming" if schedule_optimizer.is_trained else "Rule-based + Greedy",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@router.post("/train-model")
async def train_model(background_tasks: BackgroundTasks, bookings: List[BookingData]):
    """
    Train XGBoost demand prediction model with historical booking data.
    """
    if len(bookings) < 30:
        return {
            "success": False,
            "message": f"Insufficient data: {len(bookings)} bookings (need at least 30)",
            "data_points": len(bookings)
        }
    
    # Build movies lookup from booking data
    movies_lookup: Dict[int, MovieData] = {}
    for b in bookings:
        if b.movieId not in movies_lookup:
            movies_lookup[b.movieId] = MovieData(
                id=b.movieId,
                title=b.movieTitle,
                genreIds=b.genreIds,
                castIds=b.castIds,
                runtime=120, 
                popularity=5.0,
            )
    
    def train_async():
        result = schedule_optimizer.train_demand_model(bookings, movies_lookup)
        print(f"Training completed: {result}")

    background_tasks.add_task(train_async)

    return {
        "success": True,
        "message": "Model training started in background",
        "data_points": len(bookings),
        "unique_movies": len(movies_lookup)
    }


@router.post("/predict-demand")
async def predict_demand(
    movie_id: int = 1,
    movie_title: str = "Test Movie",
    hour: int = 19,
    day_of_week: int = 5,
    is_weekend: bool = True,
    room_id: int = 1
):
    """
    Predict demand for a specific show configuration.
    """
    try:
        # Create movie data
        movie = MovieData(
            id=movie_id,
            title=movie_title,
            genreIds=[],
            castIds=[],
            runtime=120,
            popularity=5.0
        )
        
        # Create datetime
        now = datetime.now()
        show_dt = now.replace(hour=hour, minute=0, second=0, microsecond=0)
        # Adjust to correct day of week
        days_diff = day_of_week - now.weekday()
        if days_diff < 0:
            days_diff += 7
        from datetime import timedelta
        show_dt += timedelta(days=days_diff)
        
        result = schedule_optimizer.predict_single_demand(movie, show_dt, room_id)

        return {
            "success": True,
            "predicted_demand": result['predicted_demand'],
            "confidence": result['confidence'],
            "is_ml_prediction": result['is_ml_prediction'],
            "show_datetime": show_dt.isoformat(),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/model-info")
async def get_model_info():
    """
    Get current model status and statistics.
    """
    info = schedule_optimizer.get_model_info()
    return {
        "success": True,
        "model_info": info,
        "timestamp": datetime.now().isoformat()
    }