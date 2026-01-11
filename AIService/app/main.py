
from fastapi import FastAPI
from .core.config import setup_cors
from .core.logging import setup_logging
from .controller.recommendForUserController import recommendForUserController, init_recommender
from app.services.hybrid_recommender_service import HybridRecommenderService
from .routers import router

def create_app() -> FastAPI:
    logger = setup_logging()
    app = FastAPI(title="CineZone AI Service", version="1.0.0")

    setup_cors(app)
    recommender = HybridRecommenderService(logger)
    init_recommender(recommender)
    app.include_router(recommendForUserController)
    app.include_router(router)
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)