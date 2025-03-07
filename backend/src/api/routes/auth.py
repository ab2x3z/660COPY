# backend/src/api/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException
from models.schemas.user import ClientLogin, TokenResponse
from services.users import UserService
from core.security import create_token

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def login_client(credentials: ClientLogin):
    service = UserService()
    client, is_correct = service.authenticate(
        credentials.courriel, credentials.mot_de_passe
    )

    if not client or not is_correct:
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    token = create_token(credentials.courriel)
    return TokenResponse(token=token)
