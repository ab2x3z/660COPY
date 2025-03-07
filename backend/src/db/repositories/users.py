
from typing import List, Optional, Dict
from db.repositories.base import BaseRepository
from models.domain.user import User


class UserRepository(BaseRepository):
    def get_by_email(self, email: str) -> Optional[Dict]:
        query = """
            SELECT ID, NOM_FAMILLE, PRENOM, COURRIEL, TEL,
                DATE_ANNIVERSAIRE, ADRESSE, VILLE,
                PROVINCE, CODE_POSTAL, FORFAIT, CREDITS
            FROM CLIENTS
            WHERE COURRIEL = :email
        """
        rows = self.execute_query(query, {"email": email})
        return rows[0] if rows else None

    def get_by_email_password(self, email: str) -> Optional[Dict]:
        query = """
            SELECT NOM_FAMILLE, PRENOM, MOT_DE_PASSE
            FROM CLIENTS
            WHERE COURRIEL = :email
        """
        rows = self.execute_query(query, {"email": email})
        return rows[0] if rows else None

    def create(self, user: User) -> bool:
        """
        Uses execute_non_query() for the INSERT
        """
        try:
            new_id = self.generate_id()

            insert_stmt = """
                INSERT INTO CLIENTS (
                    ID, COURRIEL, MOT_DE_PASSE, NOM_FAMILLE,
                    PRENOM, TEL, DATE_ANNIVERSAIRE, ADRESSE,
                    VILLE, PROVINCE, CODE_POSTAL, FORFAIT
                ) VALUES (
                    :id, :email, :password, :lastname,
                    :firstname, :tel, :birthdate, :address,
                    :city, :province, :postal_code, :plan
                )
            """
            params = {
                "id": new_id,
                "email": user.courriel,
                "password": user.mot_de_passe,
                "lastname": user.nom_famille,
                "firstname": user.prenom,
                "tel": user.tel,
                "birthdate": user.date_anniversaire,
                "address": user.adresse,
                "city": user.ville,
                "province": user.province,
                "postal_code": user.code_postal,
                "plan": user.forfait,
            }
            self.execute_non_query(insert_stmt, params)
            return True

        except Exception as e:
            print(f"Error creating user: {e}")
            return False

    def generate_id(self) -> int:
        """
        Uses execute_query() which opens/closes connection automatically.
        """
        query = "SELECT MAX(ID) as MAX_ID FROM CLIENTS"
        rows = self.execute_query(query)  # returns a list of dicts
        max_id = rows[0]["MAX_ID"] if rows and rows[0]["MAX_ID"] else 0
        return max_id + 1

    def update_profile(self, email: str, data: dict) -> bool:
        # If you know you have all fields, this is easy
        sql = """
            UPDATE CLIENTS
            SET
                NOM_FAMILLE = :nom_famille,
                PRENOM = :prenom,
                TEL = :tel,
                DATE_ANNIVERSAIRE = :date_anniversaire,
                ADRESSE = :adresse,
                VILLE = :ville,
                PROVINCE = :province,
                CODE_POSTAL = :code_postal,
                FORFAIT = :forfait
            WHERE COURRIEL = :email
        """
        params = {
            "nom_famille": data["nom_famille"],
            "prenom": data["prenom"],
            "tel": data["tel"],
            "date_anniversaire": data["date_anniversaire"],
            "adresse": data["adresse"],
            "ville": data["ville"],
            "province": data["province"],
            "code_postal": data["code_postal"],
            "forfait": data["forfait"],
            "email": email,
        }
        try:
            self.execute_non_query(sql, params)
            return True
        except Exception as e:
            print(f"Error updating profile: {e}")
            return False

    def redeem_credits(self, email: str) -> bool:
        sql = """
            UPDATE CLIENTS
            SET CREDITS = CREDITS - 10
            WHERE COURRIEL = :email
        """
        params = {
            "email": email,
        }

        try:
            self.execute_non_query(sql, params)
            return True
        except Exception as e:
            print(f"Error redeeming credits: {e}")
            return False

    def get_user_credits(self, email: str) -> int:
        sql = """
            SELECT CREDITS
            FROM CLIENTS
            WHERE COURRIEL = :email
        """
        params = {
            "email": email,
        }
        try:
            rows = self.execute_query(sql, params)
            return rows[0]["CREDITS"] if rows else 0
        except Exception as e:
            print(f"Error getting user credits: {e}")
            return -1

    def link_film_to_client(self, client_id: int, film_id: int) -> bool:
        """
        Inserts a row into FILM_CLIENT. 
        Returns True if successful, False otherwise.
        """
        try:
            statement = """
                INSERT INTO FILM_CLIENT (ID_FILM, ID_CLIENT)
                VALUES (:film_id, :client_id)
            """
            self.execute_non_query(statement, {"film_id": film_id, "client_id": client_id})
            return True
        except Exception as e:
            print(f"Error linking film to client: {e}")
            return False

    def get_rented_movies(self, email: str) -> list[Dict]:
        self.connect()
        try:
            sql = """
                SELECT FILMS.ID AS FILM_ID,
                    FILMS.TITRE,
                    FILMS.ANNEE,
                    FILMS.RESUME,
                    FILMS.POSTER_URL
                FROM FILM_CLIENT
                JOIN FILMS ON FILM_CLIENT.ID_FILM = FILMS.ID
                JOIN CLIENTS ON FILM_CLIENT.ID_CLIENT = CLIENTS.ID
                WHERE CLIENTS.COURRIEL = :email
            """
            self.cur.execute(sql, {"email": email})
            raw_rows = self.cur.fetchall()

            results = []
            for row in raw_rows:
                film_id, titre, annee, resume_lob, poster_url = row

                if resume_lob is not None and hasattr(resume_lob, "read"):
                    resume_lob = resume_lob.read()

                movie_dict = {
                    "ID": film_id,
                    "TITRE": titre,
                    "ANNEE": annee,
                    "RESUME": resume_lob,
                    "POSTER_URL": poster_url
                }
                results.append(movie_dict)

            return results
        finally:
            self.disconnect()

