from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field


class MovieResponse(BaseModel):
    """Modèle simplifié pour l'affichage basique d'un film"""

    ID: Optional[int] = Field(None, description="Identifiant unique du film")
    TITRE: str = Field(..., description="Titre du film")
    ANNEE: Optional[int] = Field(None, ge=1888, le=2025, description="Année de sortie")
    RESUME: Optional[str] = Field(None, description="Synopsis du film")
    POSTER_URL: Optional[str] = Field(None, description="URL de l'affiche du film")
    LANGUE: Optional[str] = Field(None, description="Langue du film")
    DUREE: Optional[int] = Field(None, gt=0, description="Durée en minutes")

    class Config:
        from_attributes = True
        schema_extra = {
            "example": {
                "TITRE": "Matrix",
                "ANNEE": 1999,
                "RESUME": "Un programmeur découvre que le monde est une simulation...",
                "POSTER_URL": "http://example.com/matrix.jpg",
            }
        }


class MovieBase(BaseModel):
    """Modèle complet d'un film avec toutes ses informations"""

    ID: Optional[int] = Field(None, description="Identifiant unique du film")
    TITRE: str = Field(..., description="Titre du film")
    ANNEE: Optional[int] = Field(None, ge=1888, le=2025, description="Année de sortie")
    LANGUE: Optional[str] = Field(None, description="Langue originale du film")
    DUREE: Optional[int] = Field(None, gt=0, description="Durée en minutes")
    RESUME: Optional[str] = Field(None, description="Synopsis du film")
    ID_REALISATEUR: Optional[int] = Field(None, description="ID du réalisateur")
    POSTER_URL: Optional[str] = Field(None, description="URL de l'affiche du film")

    # Relations (informations des tables jointes)
    GENRES: Optional[List[str]] = Field(default=[], description="Liste des genres")
    PAYS: Optional[List[str]] = Field(default=[], description="Pays de production")
    SCENARISTES: Optional[List[str]] = Field(
        default=[], description="Liste des scénaristes"
    )
    ACTEURS: Optional[List[dict]] = Field(
        default=[],
        description="Liste des acteurs et leurs rôles",
        example=[{"id": 1, "nom": "Keanu Reeves", "role": "Neo"}],
    )
    ANNONCES: Optional[List[str]] = Field(
        default=[], description="URLs des bandes annonces"
    )

    class Config:
        from_attributes = True
        schema_extra = {
            "example": {
                "ID": 1,
                "TITRE": "Matrix",
                "ANNEE": 1999,
                "LANGUE": "Anglais",
                "DUREE": 136,
                "RESUME": "Un programmeur découvre que le monde est une simulation...",
                "ID_REALISATEUR": 1,
                "POSTER_URL": "http://example.com/matrix.jpg",
                "GENRES": ["Science Fiction", "Action"],
                "PAYS": ["États-Unis"],
                "SCENARISTES": ["Lana Wachowski", "Lilly Wachowski"],
                "ACTEURS": [
                    {"id": 1, "nom": "Keanu Reeves", "role": "Neo"},
                    {"id": 2, "nom": "Laurence Fishburne", "role": "Morpheus"},
                ],
                "BANDE_ANNONCE": ["http://example.com/matrix-trailer.mp4"],
            }
        }


class MoviesPaginatedResponse(BaseModel):
    """Réponse paginée contenant une liste de films"""

    items: List[MovieResponse] = Field(..., description="Liste des films")
    total: int = Field(..., description="Nombre total de films")
    page: int = Field(..., ge=1, description="Page actuelle")
    per_page: int = Field(..., gt=0, description="Nombre d'éléments par page")
    total_pages: int = Field(..., ge=0, description="Nombre total de pages")

    class Config:
        schema_extra = {
            "example": {
                "items": [
                    {
                        "TITRE": "Matrix",
                        "ANNEE": 1999,
                        "RESUME": "Un programmeur découvre que le monde est une simulation...",
                        "POSTER_URL": "http://example.com/matrix.jpg",
                        "LANGUE": "Anglais",
                    }
                ],
                "total": 100,
                "page": 1,
                "per_page": 10,
                "total_pages": 10,
            }
        }


class MovieRequest(BaseModel):
    # Champs correspondant aux colonnes de la table FILMS
    TITRE: Optional[str] = Field(None, description="Titre complet ou partiel du film")
    ANNEE: Optional[int] = Field(None, ge=1888, le=2025, description="Année de sortie")

    LANGUE: Optional[str] = Field(None, description="Langue du film")
    DUREE_MIN: Optional[int] = Field(None, gt=0, description="Durée en minutes minimum")
    DUREE_MAX: Optional[int] = Field(None, gt=0, description="Durée en minutes maximum")
    RESUME: Optional[str] = Field(
        None, description="Texte à rechercher dans le synopsis"
    )
    # Champs pour les relations (tables de jonction)
    GENRES_INCLUS: Optional[List[str]] = Field(
        default=[], description="Liste des genres inclus"
    )
    GENRES_EXCLUS: Optional[List[str]] = Field(
        default=[], description="Liste des genres exclus"
    )
    SCENARISTES: Optional[List[str]] = Field(
        default=[], description="Liste des scénaristes"
    )
    ACTEURS: Optional[List[str]] = Field(default=[], description="Liste des acteurs")

    # Champs pour la pagination
    page: int = Field(default=1, ge=1, description="Numéro de la page")
    limit: int = Field(
        default=10, ge=1, le=100, description="Nombre d'éléments par page"
    )

    class Config:
        # Permet d'utiliser les noms exacts des colonnes SQL
        allow_population_by_field_name = True

        # Exemple pour la documentation
        schema_extra = {
            "example": {
                "TITRE": "Matrix",
                "ANNEE": 1999,
                "LANGUE": "Anglais",
                "DUREE_MIN": 120,
                "DUREE_MAX": 150,
                "RESUME": "intelligence artificielle",
                "GENRES_INCLUS": ["Science Fiction"],
                "GENRES_EXCLUS": ["Horreur"],
                "page": 1,
                "limit": 10,
            }
        }
