from typing import Optional, List
from pydantic import BaseModel
class Movie(BaseModel):
    id: int
    title: str
    overview: str
    releaseDate: Optional[str] = None
    runtime: Optional[int] = None
    voteAverage: Optional[float] = None
    voteCount: Optional[int] = None
    genreIds: List[int] = []
    castIds: List[int] = []
