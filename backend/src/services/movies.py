# backend/src/services/user.py
from typing import Dict, List, Optional, Tuple

from db.repositories.movies import MoviesRepository
from services.cache import CacheService


class MovieService:
    def __init__(self):
        self.repository = MoviesRepository()
        self.cache = CacheService()

    def get_movie(self, movie_id: int) -> Optional[Dict]:
        cache_key = f"movie_{movie_id}"
        if cached := self.cache.get(cache_key):
            return cached

        sql_result = self.repository.get_film_by_id(movie_id)
        if sql_result:
            self.cache.set(cache_key, sql_result, 30)
        return sql_result

    def _create_cache_key(self, properties: Dict) -> str:
        parameter_hashable = {}
        for key, value in properties.items():
            if isinstance(value, list):
                parameter_hashable[key] = tuple(sorted(value))
            else:
                parameter_hashable[key] = value
        params_string = str((sorted(parameter_hashable.items())))
        return f"film_search{hash(params_string)}"

    def get_movie_trailer(self, movie_id: int) -> Optional[str]:
        cache_key = f"trailer_{movie_id}"
        if cached := self.cache.get(cache_key):
            return cached

        result = self.repository.get_trailer_by_id(movie_id)
        if result:
            self.cache.set(cache_key, result, 30)
        return result

    def search_movies(self, properties: Dict) -> List[Dict]:
        search_params = properties.dict()
        cache_key = self._create_cache_key(search_params)
        cache_result = self.cache.get(cache_key)
        if cache_result:
            return cache_result
        result = self.repository.search_films(properties.dict())
        if not result:
            return []
        self.cache.set(cache_key, result, 30)

        return result

    def get_suggestions(self, term: str) -> List[Dict]:
        result = self.repository.get_suggestion(term)
        return result

    def get_genres(self) -> List[str]:
        result = self.repository.get_genres()
        return result

    def get_movies_by_scenariste(self, nom_scenariste: str) -> List[Dict]:
        films = self.repository.get_films_by_scenariste(nom_scenariste)
        print("Films found:", films)  # Log the result
        return films

    def get_actor_suggestions(self, term: str) -> List[str]:
        result = self.repository.get_actor_suggestions(term)
        return result

    def get_scenarist_suggestions(self, term: str) -> List[str]:
        result = self.repository.get_scenariste_suggestions(term)
        return result
