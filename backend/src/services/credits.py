from typing import Optional
from db.repositories.credits import CreditsRepository

class CreditsService:
    def __init__(self):
        self.repository = CreditsRepository()

    def get_balance(self, client_id: int) -> int:
        row = self.repository.get_by_client_id(client_id)
        if not row:
            return 0
        return row["BALANCE"]

    def add_credits(self, client_id: int, amount: int) -> bool:
        """
        Increase the user's BALANCE by 'amount'.
        """
        row = self.repository.get_by_client_id(client_id)
        if not row:
            self.repository.create_credits(client_id, initial_balance=0)
            row = self.repository.get_by_client_id(client_id)

        new_balance = row["BALANCE"] + amount
        self.repository.update_balance(row["ID"], new_balance)
        return True

    def redeem_credits(self, client_id: int, amount: int) -> bool:
        """
        Decrease the user's BALANCE by 'amount'.
        If you want to prevent negative balances, check before updating.
        """
        row = self.repository.get_by_client_id(client_id)
        if not row:
            return False 

        current_balance = row["BALANCE"]
        if current_balance < amount:
            return False

        new_balance = current_balance - amount
        self.repository.update_balance(row["ID"], new_balance)
        return True
