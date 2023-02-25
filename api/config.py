import os


class Config(object):
    """Base Configuration"""

    SECRET_KEY = os.getenv("SECRET_KEY", "super secret string that will never be cracked or pushed to a public github repo")

    db_user = os.getenv("POSTGRES_USER")
    db_password = os.getenv("POSTGRES_PASSWORD")
    db_host = os.getenv("POSTGRES_HOST")
    db_name = os.getenv("POSTGRES_DB")

    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://{}:{}@{}/{}".format(
        db_user, db_password, db_host, db_name
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_ACCESS_LIFESPAN = {"hours": 24}
    JWT_REFRESH_LIFESPAN = {"days": 30}


class ProductionConfig(Config):
    """Production Configuration"""

    SECRET_KEY = os.getenv("SECRET_KEY", "super secret string that will never be cracked or pushed to a public github repo")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "test")
    # Fix for database url using outdated postgres prefix
    SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres", "postgresql")

    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    """Development Configuration"""


class TestingConfig(Config):
    """Testing Configuration"""

    TESTING = True
