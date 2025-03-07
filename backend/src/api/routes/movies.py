from typing import List

from fastapi import APIRouter, Depends, HTTPException

from core.security import create_token, get_email_from_token, verify_token
from models.schemas.movie import (
    MovieBase,
    MovieRequest,
    MovieResponse,
    MoviesPaginatedResponse,
)
from models.schemas.person import NameSuggestion, NameSuggestionResponse
from services.movies import MovieService

router = APIRouter()
service = MovieService()


@router.post("/", response_model=MoviesPaginatedResponse)
async def search_movies(movie: MovieRequest):
    """Search for movies"""
    # print("Searching for movies", movie)
    # print("Received search request:", movie.dict())
    result = service.search_movies(movie)
    # print("Sending to db", result)

    if not result:
        raise HTTPException(status_code=401, detail="No movies found")
    return result


@router.get("/movie/{id}", response_model=MovieBase)
async def get_movie(id: int):
    """Get a movie by its ID"""
    result = service.get_movie(id)
    if not result:
        raise HTTPException(status_code=401, detail="Movie not found")
    return result


@router.get("/movie/{id}/trailer")
async def get_movie_trailer(id: int):
    """Get a movie trailer by its ID"""
    result = service.get_movie_trailer(id)
    print("Result", result)
    if not result:
        raise HTTPException(status_code=404, detail="Trailer not found")
    return result


@router.get("/suggestions/{term}")
async def get_suggestions(term: str):
    """Get movie suggestions"""
    result = service.get_suggestions(term)
    if not result:
        raise HTTPException(status_code=401, detail="No suggestions found")
    return result


@router.get("/all-genres")
async def get_genres():
    """Get all genres"""
    result = service.get_genres()
    if not result:
        raise HTTPException(status_code=401, detail="No genres found")
    return result


@router.get("/scenariste/{nom_scenariste}", response_model=List[MovieBase])
async def get_movies_by_scenariste(nom_scenariste: str):
    """Get movies by scenariste name"""
    try:
        result = service.get_movies_by_scenariste(nom_scenariste)
        if not result:
            raise HTTPException(
                status_code=404, detail="No movies found for this scenariste"
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/actor/suggestion/{term}", response_model=NameSuggestionResponse)
async def get_actor_suggestions(term: str):
    """Get actor or director name suggestions"""
    try:
        result = service.get_actor_suggestions(term)
        if not result:
            raise HTTPException(status_code=404, detail="No suggestions found")

        name_suggestions = [
            NameSuggestion(id=item["ID"], name=item["NOM"]) for item in result
        ]
        return NameSuggestionResponse(suggestions=name_suggestions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/director/suggestion/{term}", response_model=NameSuggestionResponse)
async def get_scenarist_suggestions(term: str):
    """Get director name suggestions"""
    try:
        result = service.get_scenarist_suggestions(term)
        if not result:
            raise HTTPException(status_code=404, detail="No suggestions found")

        print("Result", result)
        name_suggestions = [
            NameSuggestion(id=int(item["ID"]), name=item["NOM"]) for item in result
        ]
        return NameSuggestionResponse(suggestions=name_suggestions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
