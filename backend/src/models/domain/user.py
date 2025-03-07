from dataclasses import dataclass
from datetime import date
from typing import Optional


@dataclass
class User:
    nom_famille: str
    prenom: str
    courriel: str
    mot_de_passe: Optional[str] = None
    tel: Optional[str] = None
    date_anniversaire: Optional[date] = None
    adresse: Optional[str] = None
    ville: Optional[str] = None
    province: Optional[str] = None
    code_postal: Optional[str] = None
    forfait: Optional[str] = None
