import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from core.config import settings
import os

def setup_database():
    # Connect to PostgreSQL server
    conn = psycopg2.connect(
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        host=settings.POSTGRES_SERVER,
        port=settings.POSTGRES_PORT
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()

    # Create database if it doesn't exist
    try:
        cursor.execute(f"CREATE DATABASE {settings.POSTGRES_DB}")
        print(f"Database '{settings.POSTGRES_DB}' created successfully")
    except psycopg2.errors.DuplicateDatabase:
        print(f"Database '{settings.POSTGRES_DB}' already exists")
    finally:
        cursor.close()
        conn.close()

    # Connect to the created database
    conn = psycopg2.connect(
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        host=settings.POSTGRES_SERVER,
        port=settings.POSTGRES_PORT,
        database=settings.POSTGRES_DB
    )
    cursor = conn.cursor()

    # Execute SQL files
    sql_files = [
        'sql/create_tables.sql',
        'sql/insert_sample_data.sql'
    ]

    for sql_file in sql_files:
        try:
            with open(os.path.join(os.path.dirname(__file__), sql_file), 'r') as f:
                sql = f.read()
                cursor.execute(sql)
                conn.commit()
                print(f"Successfully executed {sql_file}")
        except Exception as e:
            print(f"Error executing {sql_file}: {str(e)}")
            conn.rollback()

    cursor.close()
    conn.close()

if __name__ == "__main__":
    setup_database() 