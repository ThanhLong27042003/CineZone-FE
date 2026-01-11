from typing import List,Optional
from pydantic import BaseModel
from app.models.movie import Movie


class RecommendationRequest(BaseModel):
    movieId: int
    allMovies: List[Movie]
    limit: int = 4
    useCollaborative: bool= False
    userHistory: Optional[List[int]] = None
