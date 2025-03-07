from typing import Dict, List, Optional

from db.repositories.base import BaseRepository


class MoviesRepository(BaseRepository):

    def search_films(self, criteria: dict) -> Dict:
        """
        Recherche des films selon plusieurs critères
        Retourne un format compatible avec MoviesPaginatedResponse
        """
        try:
            self.connect()

            conditions = []
            params = {}

            # Recherche par titre
            if criteria.get("TITRE"):
                conditions.append("UPPER(F.TITRE) LIKE UPPER(:titre)")
                params["titre"] = f"%{criteria['TITRE']}%"

            # Recherche par année
            if criteria.get("ANNEE_MIN"):
                conditions.append("F.ANNEE >= :annee_min")
                params["annee_min"] = criteria["ANNEE_MIN"]
            if criteria.get("ANNEE_MAX"):
                conditions.append("F.ANNEE <= :annee_max")
                params["annee_max"] = criteria["ANNEE_MAX"]

            # Recherche par langue
            if criteria.get("LANGUE"):
                conditions.append("UPPER(F.LANGUE) = UPPER(:langue)")
                params["langue"] = criteria["LANGUE"]

            # Recherche par durée
            if criteria.get("DUREE_MIN"):
                conditions.append("F.DUREE >= :duree_min")
                params["duree_min"] = criteria["DUREE_MIN"]
            if criteria.get("DUREE_MAX"):
                conditions.append("F.DUREE <= :duree_max")
                params["duree_max"] = criteria["DUREE_MAX"]

            # Recherche dans le résumé
            if criteria.get("RESUME"):
                conditions.append("UPPER(F.RESUME) LIKE UPPER(:resume)")
                params["resume"] = f"%{criteria['RESUME']}%"

            # Genres à inclure
            if criteria.get("GENRES_INCLUS"):
                genres_inclus = criteria["GENRES_INCLUS"]
                if isinstance(genres_inclus, str):
                    genres_inclus = [genres_inclus]
                for i, genre in enumerate(genres_inclus):
                    param_name = f"genre_inclus_{i}"
                    conditions.append(
                        f"""
                        EXISTS (
                            SELECT 1 FROM FILM_GENRE FG
                            JOIN GENRES G ON FG.ID_GENRE = G.ID
                            WHERE FG.ID_FILM = F.ID 
                            AND UPPER(G.NOM) = UPPER(:{param_name})
                        )
                    """
                    )
                    params[param_name] = genre

            # Genres à exclure
            if criteria.get("GENRES_EXCLUS"):
                genres_exclus = criteria["GENRES_EXCLUS"]
                if isinstance(genres_exclus, str):
                    genres_exclus = [genres_exclus]
                for i, genre in enumerate(genres_exclus):
                    param_name = f"genre_exclus_{i}"
                    conditions.append(
                        f"""
                        NOT EXISTS (
                            SELECT 1 FROM FILM_GENRE FG
                            JOIN GENRES G ON FG.ID_GENRE = G.ID
                            WHERE FG.ID_FILM = F.ID 
                            AND UPPER(G.NOM) = UPPER(:{param_name})
                        )
                    """
                    )
                    params[param_name] = genre

            if criteria.get("SCENARISTES") and len(criteria["SCENARISTES"]) > 0:
                for i, scenariste in enumerate(criteria["SCENARISTES"]):
                    param_name = f"scenariste_{i}"
                    conditions.append(
                        f"""
                        EXISTS (
                            SELECT 1 FROM FILM_SCENARISTES FS
                            JOIN SCENARISTES S ON FS.ID_SCENARISTE = S.ID
                            WHERE FS.ID_FILM = F.ID 
                            AND UPPER(S.NOM) LIKE UPPER(:{param_name})
                        )
                    """
                    )
                    params[param_name] = f"%{scenariste}%"

            if criteria.get("ACTEURS") and len(criteria["ACTEURS"]) > 0:
                for i, acteur in enumerate(criteria["ACTEURS"]):
                    param_name = f"acteur_{i}"
                    conditions.append(
                        f"""
                        EXISTS (
                            SELECT 1 FROM ROLES R
                            JOIN PERSONNES P ON R.ID_ACTEUR = P.ID
                            WHERE R.ID_FILM = F.ID 
                            AND UPPER(P.NOM) LIKE UPPER(:{param_name})
                        )
                    """
                    )
                    params[param_name] = f"%{acteur}%"

            # Combine all conditions
            where_clause = " AND ".join(conditions) if conditions else "1=1"

            # Count total records
            count_query = f"""
                SELECT COUNT(DISTINCT F.ID) 
                FROM FILMS F 
                WHERE {where_clause}
            """

            self.cur.execute(count_query, params)
            total_count = self.cur.fetchone()[0]

            # Pagination parameters
            page = criteria.get("page", 1)
            per_page = criteria.get("limit", 10)
            offset = (page - 1) * per_page

            # Main query with pagination
            main_query = f"""
                SELECT * FROM (
                    SELECT a.*, ROWNUM rnum FROM (
                        SELECT DISTINCT 
                            F.ID,
                            F.TITRE,
                            F.ANNEE,
                            F.RESUME,
                            F.POSTER_URL,
                            F.LANGUE,
                            F.DUREE
                        FROM FILMS F
                        WHERE {where_clause}
                        ORDER BY F.TITRE
                    ) a WHERE ROWNUM <= :upper_limit
                ) WHERE rnum > :lower_limit
            """

            params["upper_limit"] = offset + per_page
            params["lower_limit"] = offset

            # Execute main query
            self.cur.execute(main_query, params)

            # Process results
            results = []
            for row in self.cur.fetchall():
                movie = {
                    "ID": row[0],
                    "TITRE": row[1],
                    "ANNEE": row[2],
                    "RESUME": str(row[3]) if row[3] else None,
                    "POSTER_URL": row[4],
                    "LANGUE": row[5],
                    "DUREE": row[6],
                }
                results.append(movie)

            # Calculate total pages
            total_pages = (total_count + per_page - 1) // per_page

            return {
                "items": results,
                "total": total_count,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages,
            }

        except Exception as e:
            print(f"Error searching films: {e}")
            raise
        finally:
            self.disconnect()

    def get_film_by_id(self, film_id: int) -> Optional[Dict]:
        """
        Récupère les détails d'un film par son ID
        """
        try:
            self.connect()
            # Requête principale pour les informations de base du film
            query = """
                SELECT 
                    F.ID,
                    F.TITRE,
                    F.ANNEE,
                    F.LANGUE,
                    F.DUREE,
                    F.RESUME,
                    F.POSTER_URL,
                    F.ID_REALISATEUR
                FROM FILMS F
                WHERE F.ID = :film_id
            """

            self.cur.execute(query, {"film_id": film_id})
            result = self.cur.fetchone()

            if not result:
                return None

            # Création du dictionnaire de base
            film_dict = {
                "ID": result[0],
                "TITRE": result[1],
                "ANNEE": result[2],
                "LANGUE": result[3],
                "DUREE": result[4],
                "RESUME": str(result[5]),
                "POSTER_URL": result[6],
                "ID_REALISATEUR": result[7],
            }

            # Requête séparée pour les genres
            genres_query = """
                SELECT G.NOM
                FROM FILM_GENRE FG
                JOIN GENRES G ON FG.ID_GENRE = G.ID
                WHERE FG.ID_FILM = :film_id
            """
            self.cur.execute(genres_query, {"film_id": film_id})
            film_dict["GENRES"] = [row[0] for row in self.cur.fetchall()]

            # Requête séparée pour les pays
            pays_query = """
                SELECT P.NOM
                FROM FILM_PAYS FP
                JOIN PAYS P ON FP.ID_PAYS = P.ID
                WHERE FP.ID_FILM = :film_id
            """
            self.cur.execute(pays_query, {"film_id": film_id})
            film_dict["PAYS"] = [row[0] for row in self.cur.fetchall()]

            # Requête séparée pour les scénaristes
            scenaristes_query = """
                SELECT S.NOM
                FROM FILM_SCENARISTES FS
                JOIN SCENARISTES S ON FS.ID_SCENARISTE = S.ID
                WHERE FS.ID_FILM = :film_id
            """
            self.cur.execute(scenaristes_query, {"film_id": film_id})
            film_dict["SCENARISTES"] = [row[0] for row in self.cur.fetchall()]

            # Requête séparée pour les acteurs et leurs rôles
            actors_query = """
                SELECT 
                    P.ID,
                    P.NOM,
                    R.PERSONNAGE
                FROM ROLES R
                JOIN PERSONNES P ON R.ID_ACTEUR = P.ID
                WHERE R.ID_FILM = :film_id
            """

            self.cur.execute(actors_query, {"film_id": film_id})
            film_dict["ACTEURS"] = [
                {"id": row[0], "nom": row[1], "role": row[2]}
                for row in self.cur.fetchall()
            ]

            # Requête pour récupérer les bandes annonces
            trailers_query = """
                SELECT URL
                FROM ANNONCES
                WHERE ID_FILM = :film_id
                ORDER BY ID
            """
            self.cur.execute(trailers_query, {"film_id": film_id})
            film_dict["ANNONCES"] = [row[0] for row in self.cur.fetchall()]

            return film_dict

        except Exception as e:
            print(f"Error getting film by id: {e}")
            raise
        finally:
            self.disconnect()

    def get_trailer_by_id(self, film_id: int) -> Optional[str]:
        """
        Récupère l'URL de la bande annonce d'un film par son ID
        """
        try:
            self.connect()
            query = """
                SELECT * FROM ANNONCES a 
                JOIN FILMS f ON a.ID_FILM = f.ID
                WHERE f.ID = :film_id
            """
            self.cur.execute(query, {"film_id": film_id})
            result = self.cur.fetchone()
            print(result)
            return result[0] if result else None
        except Exception as e:
            print(f"Error getting trailer by id: {e}")
            raise
        finally:
            self.disconnect()

    def get_suggestion(self, search_term, limit: int = 5):
        """
        Get movie suggestions using Oracle's built-in string functions
        """
        try:
            self.connect()  # Always start with a connection

            query = """
                SELECT DISTINCT F.ID, F.TITRE
                FROM FILMS F
                WHERE 
                    UPPER(F.TITRE) LIKE UPPER(:search_term || '%')
                    OR UPPER(F.TITRE) LIKE UPPER('% ' || :search_term || '%')
                    OR UPPER(F.TITRE) LIKE UPPER('%' || :search_term || '%')
                ORDER BY 
                    CASE 
                        WHEN UPPER(F.TITRE) LIKE UPPER(:search_term || '%') THEN 1
                        WHEN UPPER(F.TITRE) LIKE UPPER('%' || :search_term || '%') THEN 2
                        ELSE 3
                    END,
                    LENGTH(F.TITRE), 
                    F.TITRE        
                FETCH FIRST :limit ROWS ONLY
            """

            # Execute query with both parameters properly bound
            self.cur.execute(
                query, {"search_term": search_term.upper(), "limit": limit}
            )

            # Fetch results before disconnecting
            results = [{"ID": row[0], "TITRE": row[1]} for row in self.cur.fetchall()]
            print(results)
            return results

        except Exception as e:
            print(f"Error getting suggestions: {e}")
            raise
        finally:
            self.disconnect()  # Always disconnect in finally block

    def get_genres(self):
        """
        Récupère la liste de tous les genres
        """
        try:
            self.connect()
            query = "SELECT NOM FROM GENRES"
            self.cur.execute(query)
            return [row[0] for row in self.cur.fetchall()]
        except Exception as e:
            print(f"Error getting genres: {e}")
            raise
        finally:
            self.disconnect()

    def get_films_by_scenariste(self, nom_scenariste: str) -> List[Dict]:
        """
        Récupère les films par le nom du scénariste
        """
        try:
            self.connect()
            query = """
                SELECT f.id, f.titre, f.annee, f.duree, f.poster_url
                FROM FILMS f
                JOIN FILM_SCENARISTES fs ON f.id = fs.id_film
                JOIN SCENARISTES s ON fs.id_scenariste = s.id
                WHERE s.nom = :nom_scenariste
            """
            self.cur.execute(query, {"nom_scenariste": nom_scenariste})
            result = self.cur.fetchall()
            films = [
                {
                    "ID": row[0],
                    "TITRE": row[1],
                    "ANNEE": row[2],
                    "DUREE": row[3],
                    "POSTER_URL": row[4],
                }
                for row in result
            ]
            return films
        except Exception as e:
            print(f"Error getting films by scenariste: {e}")
            raise
        finally:
            self.disconnect()

    def get_actor_suggestions(self, term: str, limit: int = 5):
        """
        Get actor name suggestions
        """
        try:
            self.connect()  # Establish the connection first

            query = """
                SELECT DISTINCT P.ID, P.NOM
                FROM PERSONNES P
                JOIN ROLES R ON P.ID = R.ID_ACTEUR
                WHERE 
                    UPPER(P.NOM) LIKE UPPER(:search_term || '%')
                    OR UPPER(P.NOM) LIKE UPPER('% ' || :search_term || '%')
                    OR UPPER(P.NOM) LIKE UPPER('%' || :search_term || '%')
                ORDER BY 
                    CASE 
                        WHEN UPPER(P.NOM) LIKE UPPER(:search_term || '%') THEN 1
                        WHEN UPPER(P.NOM) LIKE UPPER('%' || :search_term || '%') THEN 2
                        ELSE 3
                    END,
                    LENGTH(P.NOM), 
                    P.NOM        
                FETCH FIRST :limit ROWS ONLY
            """

            self.cur.execute(query, {"search_term": term.upper(), "limit": limit})
            result = self.cur.fetchall()
            return [{"ID": row[0], "NOM": row[1]} for row in result]
        except Exception as e:
            print(f"Error getting actor suggestions: {e}")
            raise
        finally:
            self.disconnect()  # Always disconnect in finally block

    def get_scenariste_suggestions(self, term: str, limit: int = 5):
        """
        Get screenwriter (scenariste) name suggestions
        """
        try:
            self.connect()  # Establish the connection first

            query = """
                SELECT DISTINCT S.ID, S.NOM
                FROM SCENARISTES S
                WHERE 
                    UPPER(S.NOM) LIKE UPPER(:search_term || '%')
                    OR UPPER(S.NOM) LIKE UPPER('% ' || :search_term || '%')
                    OR UPPER(S.NOM) LIKE UPPER('%' || :search_term || '%')
                ORDER BY 
                    CASE 
                        WHEN UPPER(S.NOM) LIKE UPPER(:search_term || '%') THEN 1
                        WHEN UPPER(S.NOM) LIKE UPPER('%' || :search_term || '%') THEN 2
                        ELSE 3
                    END,
                    LENGTH(S.NOM), 
                    S.NOM        
                FETCH FIRST :limit ROWS ONLY
            """

            self.cur.execute(query, {"search_term": term.upper(), "limit": limit})
            result = self.cur.fetchall()
            return [{"ID": row[0], "NOM": row[1]} for row in result]
        except Exception as e:
            print(f"Error getting screenwriter suggestions: {e}")
            raise
        finally:
            self.disconnect()  # Always disconnect in finally block
