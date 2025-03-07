from typing import List
from fastapi import APIRouter, Depends, HTTPException
from models.schemas.movie import MovieResponse
from models.schemas.user import ClientLogin, TokenResponse, ClientBase, ClientCreate, ClientResponse, ClientUpdate
from services.users import UserService
from core.security import create_token, verify_token, get_email_from_token
from api.routes.dependencies import get_current_user

router = APIRouter()
service = UserService()


@router.get(
    "/myaccount",
    tags=["Client"],
    summary="Get client details",
    description="Retrieve details of a client by their email",
    response_model=ClientBase,
)
async def get_current_client(current_user: str = Depends(get_current_user)):
    """Récupère le profil du client connecté"""
    client = service.get_profile(current_user)

    if not client:
        raise HTTPException(status_code=401, detail="Client non trouvé")
    return client

@router.patch("/myaccount")
async def patch_myaccount(
    updates: ClientUpdate,
    current_user: str = Depends(get_current_user),
):
    service = UserService()
    success = service.update_profile(current_user, updates.dict(exclude_unset=True))
    if not success:
        raise HTTPException(status_code=400, detail="Unable to update profile")
    return {"detail": "Profile updated"}

@router.post("/auth/register")
async def register_client(client: ClientCreate):
    """Enregistre un nouveau client"""
    result = service.register_client(client)
    if not result:
        raise HTTPException(status_code=401, detail="L'enregistrement a échoué")
    return result

@router.post("/rent/{film_id}")
async def rent_movie(
    film_id: int,
    current_user: str = Depends(get_current_user),
):
    """
    Redeems credits and associates the client with the specified film.
    """
    service = UserService()

    success = service.redeem_credits(current_user)
    if not success:
        raise HTTPException(status_code=400, detail="Unable to redeem credits")

    link_success = service.link_film_to_client(current_user, film_id)
    if not link_success:
        raise HTTPException(status_code=400, detail="Unable to link film to client")

    new_credits = service.get_user_credits(current_user)
    if new_credits < 0:
        raise HTTPException(status_code=400, detail="Unable to get user credits")

    return {"credits": new_credits}

@router.get("/rented-movies", response_model=List[MovieResponse])
async def get_rented_movies_route(current_user: str = Depends(get_current_user)):
    service = UserService()
    movies = service.get_rented_movies(current_user)
    return movies

