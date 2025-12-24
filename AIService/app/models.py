from pydantic import BaseModel
from typing import List, Dict, Any

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
    genreIds: List[int]
    castIds: List[int]

class MovieData(BaseModel):
    id: int
    title: str
    genreIds: List[int]
    castIds: List[int]
    runtime: int
    popularity: float

class ShowData(BaseModel):
    showId: int
    movieId: int
    roomId: int
    showDateTime: str
    price: float




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