from typing import Optional, List, Dict, Any
import oracledb
from core.config import get_database_config


class BaseRepository:
    def __init__(self):
        self.config = get_database_config()
        self.conn = None
        self.cur = None

    def connect(self):
        try:
 
            dsn = f"{self.config.host}:{self.config.port}/{self.config.service_name}"

            # Connect in Thin mode
            self.conn = oracledb.connect(
                user=self.config.user,
                password=self.config.password,
                dsn=dsn,
            )
            self.cur = self.conn.cursor()
        except Exception as e:
            print(f"Error connecting to database: {e}")
            raise

    def disconnect(self):
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()

    def execute_query(self, query: str, params: Dict[str, Any] = None) -> List[Dict]:
        try:
            self.connect()
            self.cur.execute(query, params or {})
            columns = [col[0] for col in self.cur.description]
            return [dict(zip(columns, row)) for row in self.cur.fetchall()]
        finally:
            self.disconnect()

    def execute_non_query(self, statement: str, params: Dict[str, Any] = None) -> None:
        """
        For INSERT/UPDATE/DELETE statements. Opens/closes a connection each time.
        """
        try:
            self.connect()
            self.cur.execute(statement, params or {})
            self.conn.commit()
        finally:
            self.disconnect()

