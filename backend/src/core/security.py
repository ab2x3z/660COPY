from datetime import datetime, timedelta
import jwt
from dotenv import load_dotenv
import os

load_dotenv()
# Clé secrète simple (à mettre dans .env en production)
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


if ALGORITHM is None:
    ALGORITHM = "HS256"


def create_token(email: str) -> str:
    """Créer un token simple"""
    data = {
        "user_email": email,
        "expires": str(datetime.utcnow() + timedelta(minutes=30)),
    }

    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str) -> bool:
    """Vérifier si le token est valide"""
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return True
    except:
        return False


def get_email_from_token(token: str) -> str:
    """Récupérer l'email du token"""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])["user_email"]
    except:
        return None
