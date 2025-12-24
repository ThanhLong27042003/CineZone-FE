from fastapi import APIRouter, HTTPException, BackgroundTasks
from datetime import datetime
from typing import List

from .models import (
    AnalyticsRequest, BookingData, ScheduleOptimizationRequest, MovieData, ShowData
)
from .services import revenue_analyzer, schedule_optimizer

router = APIRouter()


@router.get("/")
async def root():
    return {
        "service": "CineZone AI Service",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": [
            "/analyze-revenue",
            "/optimize-schedule",
            "/predict-demand",
            "/train-model"
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
    try:
        optimized = schedule_optimizer.optimize_schedule(
            request.movies,
            request.existingShows,
            request.rooms,
            request.dateRange,
            request.constraints
        )

        return {
            "success": True,
            "schedule": optimized,
            "total_shows": len(optimized),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@router.post("/train-model")
async def train_model(background_tasks: BackgroundTasks, bookings: List[BookingData]):

    def train():
        schedule_optimizer.train_demand_model(bookings)

    background_tasks.add_task(train)

    return {
        "success": True,
        "message": "Model training started in background",
        "data_points": len(bookings)
    }


@router.post("/predict-demand")
async def predict_demand(hour: int, day_of_week: int, is_weekend: bool):
    try:
        demand = schedule_optimizer._predict_demand(hour, day_of_week, 1 if is_weekend else 0)

        return {
            "success": True,
            "predicted_demand": round(demand, 2),
            "confidence": 0.85 if schedule_optimizer.is_trained else 0.65,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")