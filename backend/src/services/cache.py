from datetime import datetime, timedelta
from typing import Dict, Any, Optional


class CacheService:
    def __init__(self):
        # Structure simple: { "clé": {"data": données, "expiry": date_expiration} }
        self.cache = {}

    def get(self, key: str) -> Optional[Any]:
        """Récupère une donnée du cache"""
        if key in self.cache:
            # Vérifie si la donnée n'a pas expiré
            if datetime.now() < self.cache[key]["expiry"]:
                return self.cache[key]["data"]
            del self.cache[key]
        return None

    def set(self, key: str, data: Any, minutes: int = 30):
        """Stocke une donnée dans le cache pour X minutes"""
        self.cache[key] = {
            "data": data,
            "expiry": datetime.now() + timedelta(minutes=minutes),
        }

    def delete(self, key: str):
        """Supprime une donnée du cache"""
        if key in self.cache:
            del self.cache[key]

    def clear(self):
        """Vide tout le cache"""
        self.cache.clear()
