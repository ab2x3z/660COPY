from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services.credits import CreditsService

router = APIRouter()
service = CreditsService()

class CreditAdjustmentRequest(BaseModel):
    amount: int = Field(..., description="Number of credits to add or redeem")

@router.get("/{client_id}/balance")
def get_balance(client_id: int):
    """
    Returns the current credit balance for the given client ID.
    """
    balance = service.get_balance(client_id)
    return {"client_id": client_id, "balance": balance}

@router.post("/{client_id}/credits/add")
def add_credits(client_id: int, request: CreditAdjustmentRequest):
    """
    Adds 'amount' credits to the user's balance.
    """
    success = service.add_credits(client_id, request.amount)
    if not success:
        raise HTTPException(status_code=400, detail="Unable to add credits.")
    return {"client_id": client_id, "amount_added": request.amount}

@router.post("/{client_id}/redeem")
def redeem_credits(client_id: int, request: CreditAdjustmentRequest):
    """
    Redeems 'amount' credits from the user's balance.
    """
    success = service.redeem_credits(client_id, request.amount)
    if not success:
        raise HTTPException(status_code=400, detail="Not enough credits to redeem.")
    return {"client_id": client_id, "amount_redeemed": request.amount}
