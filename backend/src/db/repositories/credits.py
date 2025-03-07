from typing import Optional
from db.repositories.base import BaseRepository

class CreditsRepository(BaseRepository):
    def get_by_client_id(self, client_id: int) -> Optional[dict]:
        """
        Return the credits row for the given client_id, or None if not found.
        """
        query = "SELECT ID, CLIENT_ID, BALANCE FROM CREDITS WHERE CLIENT_ID = :client_id"
        rows = self.execute_query(query, {"client_id": client_id})
        return rows[0] if rows else None

    def create_credits(self, client_id: int, initial_balance: int) -> None:
        """
        Insert a new row into CREDITS for this client_id, if not already present.
        """
        statement = """
            INSERT INTO CREDITS (CLIENT_ID, BALANCE)
            VALUES (:client_id, :balance)
        """
        self.execute_non_query(statement, {"client_id": client_id, "balance": initial_balance})

    def update_balance(self, credits_id: int, new_balance: int) -> None:
        """
        Update the BALANCE column for the given credits row ID.
        """
        statement = """
            UPDATE CREDITS
            SET BALANCE = :balance
            WHERE ID = :id
        """
        self.execute_non_query(statement, {"balance": new_balance, "id": credits_id})
