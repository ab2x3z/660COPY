from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class ClientBase(BaseModel):
    nom_famille: str = Field(..., max_length=50)
    prenom: str = Field(..., max_length=50)
    courriel: str = Field(..., max_length=100)
    tel: Optional[str] = Field(None, max_length=20)
    date_anniversaire: Optional[date] = None
    adresse: Optional[str] = Field(None, max_length=200)
    ville: Optional[str] = Field(None, max_length=100)
    province: Optional[str] = Field(None, max_length=2)
    code_postal: Optional[str] = Field(None, max_length=7)
    forfait: Optional[str] = Field(None, max_length=1)
    credits: Optional[int] = Field(None)



class ClientLogin(BaseModel):
    courriel: str
    mot_de_passe: str = Field(..., max_length=100)


class ClientResponse(BaseModel):
    nom_famille: str
    prenom: str
    courriel: str
    tel: Optional[str]
    date_anniversaire: Optional[date]
    adresse: Optional[str]
    ville: Optional[str]
    province: Optional[str]
    code_postal: Optional[str]
    forfait: Optional[str]


class ClientCreate(BaseModel):
    nom_famille: str
    prenom: str
    courriel: str
    mot_de_passe: str
    tel: Optional[str]
    date_anniversaire: Optional[date]
    adresse: Optional[str]
    ville: Optional[str]
    province: Optional[str]
    code_postal: Optional[str]
    forfait: Optional[str]


class ClientCreateResponse(BaseModel):
    nom_famille: str
    prenom: str
    courriel: str
    mot_de_passe: str
    tel: Optional[str]
    date_anniversaire: Optional[date]
    adresse: Optional[str]
    ville: Optional[str]
    province: Optional[str]
    code_postal: Optional[str]
    forfait: Optional[str]

class ClientUpdate(BaseModel):
    nom_famille: Optional[str] = Field(None, max_length=50)
    prenom: Optional[str] = Field(None, max_length=50)
    courriel: Optional[str] = Field(None, max_length=100)
    tel: Optional[str] = Field(None, max_length=20)
    date_anniversaire: Optional[date] = None
    adresse: Optional[str] = Field(None, max_length=200)
    ville: Optional[str] = Field(None, max_length=100)
    province: Optional[str] = Field(None, max_length=2)
    code_postal: Optional[str] = Field(None, max_length=7)
    mot_de_passe: Optional[str] = Field(None, max_length=100)
    forfait: Optional[str] = Field(None, max_length=1)

class TokenResponse(BaseModel):
    token: str
