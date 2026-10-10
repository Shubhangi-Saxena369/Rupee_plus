import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes.claims import router as claims_router
from backend.app.api.routes.cover import router as cover_router
from backend.app.api.routes.onboarding import router as onboarding_router
from backend.app.api.routes.premium import router as premium_router
from backend.app.api.routes.transactions import router as transactions_router
from backend.app.api.routes.wallet import router as wallet_router


app = FastAPI(
    title="Rupee+ API",
    description="Micro-savings and personalized micro-insurance backend",
    version="1.0.0",
)
allowed_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("FRONTEND_URL", "").split(",")
    if origin.strip()
]
if allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

app.include_router(premium_router)
app.include_router(onboarding_router)
app.include_router(transactions_router)
app.include_router(wallet_router)
app.include_router(cover_router)
app.include_router(claims_router)


@app.get("/")
def root():
    return {
        "name": "Rupee+",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
