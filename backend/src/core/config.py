from typing import List
from dataclasses import dataclass, field
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class DatabaseConfig:
    host: str
    port: str
    user: str
    password: str
    service_name: str


@dataclass
class AppConfig:
    # API Config
    API_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DB_HOST: str = os.getenv("ORACLE_HOST")
    DB_PORT: str = os.getenv("ORACLE_PORT")
    DB_USER: str = os.getenv("ORACLE_USER")
    DB_PASSWORD: str = os.getenv("ORACLE_PASSWORD")
    DB_SERVICE: str = os.getenv("ORACLE_SERVICE")

    class Config:
        env_file = ".env"


def get_app_config() -> AppConfig:
    return AppConfig()


def get_database_config() -> DatabaseConfig:
    return DatabaseConfig(
        host=os.getenv("ORACLE_HOST"),
        port=os.getenv("ORACLE_PORT"),
        user=os.getenv("ORACLE_USER"),
        password=os.getenv("ORACLE_PASSWORD"),
        service_name=os.getenv("ORACLE_SERVICE"),
    )
