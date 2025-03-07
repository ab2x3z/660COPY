from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.security import verify_token, get_email_from_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Dépendance FastAPI pour récupérer l'utilisateur actuel à partir du token JWT
    """
    try:
        token = credentials.credentials
        if not verify_token(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide"
            )

        email = get_email_from_token(token)
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide"
            )

        return email
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Non autorisé"
        )
