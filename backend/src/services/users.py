# backend/src/services/user.py
from typing import Tuple, Dict, Optional
from db.repositories.users import UserRepository
from services.cache import CacheService


class UserService:
    def __init__(self):
        self.repository = UserRepository()
        self.cache = CacheService()

    def authenticate(self, email: str, password: str) -> Tuple[Dict, bool]:
        client = self.repository.get_by_email_password(email)
        if client and client["MOT_DE_PASSE"] == password:
            return client, True
        return None, False

    def get_profile(self, email: str) -> Optional[Dict]:
        cache_key = f"client_{email}"
        if cached := self.cache.get(cache_key):
            return cached

        sql_result = self.repository.get_by_email(email)
        result = self.sql_to_ClientBase(sql_result) if sql_result else None
        if result:
            self.cache.set(cache_key, result, 30)
        return result

    def sql_to_ClientBase(self, sql_result: Dict) -> Dict:
        return {
            "nom_famille": sql_result["NOM_FAMILLE"],
            "prenom": sql_result["PRENOM"],
            "courriel": sql_result["COURRIEL"],
            "tel": sql_result["TEL"],
            "date_anniversaire": sql_result["DATE_ANNIVERSAIRE"],
            "adresse": sql_result["ADRESSE"],
            "ville": sql_result["VILLE"],
            "province": sql_result["PROVINCE"],
            "code_postal": sql_result["CODE_POSTAL"],
            "forfait": sql_result["FORFAIT"],
            "credits": sql_result["CREDITS"],
        }
    
    def update_profile(self, email: str, updated_data: dict) -> bool:
        existing_user = self.repository.get_by_email(email)
        if not existing_user:
            return False
        current_profile = self.sql_to_ClientBase(existing_user)
        merged_data = {**current_profile, **updated_data} 
        return self.repository.update_profile(email, merged_data)


    def register_client(self, user) -> bool:
        return self.repository.create(user)

    def redeem_credits(self, email: str) -> bool:
        return self.repository.redeem_credits(email)
    
    def link_film_to_client(self, email: str, film_id: int) -> bool:
        """
        1) Get the client from email
        2) Insert a row (ID_FILM, ID_CLIENT) into FILM_CLIENT table
        """
        client = self.repository.get_by_email(email)
        if not client:
            return False

        client_id = client["ID"]
        return self.repository.link_film_to_client(client_id, film_id)
    
    def get_rented_movies(self, email: str) -> list:
        return self.repository.get_rented_movies(email)

    def get_user_credits(self, email: str) -> int:
        return self.repository.get_user_credits(email)

