from typing import List

from pydantic import BaseModel


class NameSuggestion(BaseModel):
    id: int
    name: str


class NameSuggestionResponse(BaseModel):
    suggestions: List[NameSuggestion]
