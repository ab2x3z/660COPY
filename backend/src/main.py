from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import get_app_config
from api.routes import auth, movies, users


def create_app() -> FastAPI:
    config = get_app_config()

    app = FastAPI(
        title="Film Location API",
        description="API pour la location de films",
        version="1.0.0",
    )

    # Configuration CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Inclusion des routers
    app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

    app.include_router(movies.router, prefix="/movies", tags=["Movies"])

    app.include_router(users.router, prefix="/users", tags=["Users"])

    @app.get("/health")
    async def health_check():
        return {"status": "healthy"}

    return app


app = create_app()
