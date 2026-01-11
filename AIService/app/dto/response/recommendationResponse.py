from typing import List,Optional, Dict
from pydantic import BaseModel

class RecommendationResponse(BaseModel):
    movieId: int
    recommendations: List[Dict]
    algorithm: str
    processingTime: float