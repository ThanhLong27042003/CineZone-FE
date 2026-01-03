from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class BookingData(BaseModel):
    id: int
    userId: str
    showId: int
    movieId: int
    movieTitle: str
    showDateTime: str
    totalPrice: float
    seatCount: int
    bookingDate: str
    status: str
    genreIds: List[int] = Field(default_factory=list)
    castIds: List[int] = Field(default_factory=list)


class MovieData(BaseModel):
    id: int
    title: str
    genreIds: List[int] = Field(default_factory=list)
    castIds: List[int] = Field(default_factory=list)
    runtime: int
    popularity: Optional[float] = 0.0
    voteAverage: Optional[float] = 0.0
    voteCount: Optional[int] = 0
    releaseDate: Optional[str] = None


class ShowData(BaseModel):
    showId: int
    movieId: int
    roomId: int
    showDateTime: str
    price: float


class RoomData(BaseModel):
    roomId: int
    name: str
    capacity: int = 90


class AnalyticsRequest(BaseModel):
    bookings: List[BookingData]
    fromDate: str
    toDate: str


class ScheduleOptimizationRequest(BaseModel):
    movies: List[MovieData]
    existingShows: List[ShowData]
    rooms: List[int]
    dateRange: Dict[str, str]
    constraints: Dict[str, Any]


class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    insights: List[str]
    confidence: float


class OptimizedShow(BaseModel):
    movieId: int
    movieTitle: str
    roomId: int
    showDateTime: str
    price: float
    predictedDemand: float
    expectedRevenue: float
    confidence: float
    reasoning: str
    priority_score: float