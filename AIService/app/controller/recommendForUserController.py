from fastapi import APIRouter, HTTPException
from datetime import datetime
from app.dto.request.recommendationRequest import RecommendationRequest
from app.dto.response.recommendationResponse import RecommendationResponse
from app.services.hybrid_recommender_service import HybridRecommenderService

recommendForUserController = APIRouter()
recommender: HybridRecommenderService = None

def init_recommender(instance):
    global recommender
    recommender = instance

@recommendForUserController.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "CineZone AI Service"
    }

@recommendForUserController.post("/recommendations", response_model=RecommendationResponse)
async def recommend(request: RecommendationRequest):
    start = datetime.now()
    try:
        recs, algo = recommender.get_recommendations(
            request.movieId,
            request.allMovies,
            request.limit,
            request.useCollaborative,
            request.userHistory,
        )

        return RecommendationResponse(
            movieId=request.movieId,
            recommendations=recs,
            algorithm=algo,
            processingTime=(datetime.now() - start).total_seconds(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
