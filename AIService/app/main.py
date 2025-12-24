
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import router


def create_app() -> FastAPI:
    app = FastAPI(title="CineZone AI Service", version="1.0.0")

    # CORS configuration (same origins as original file)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:8080", "http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)