from api import db
from api.database import Serializer
from flask_login import UserMixin


class Account(UserMixin, db.Model):
    """Model for accounts."""

    __tablename__ = "account"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(64), index=False, unique=True, nullable=False)
    password = db.Column(db.String(512), index=False, unique=False, nullable=False)
    created_at = db.Column(db.DateTime, index=False, unique=False, nullable=False)

    def serialize(self):
        d = Serializer.serialize(self)
        del d["password"]
        return d
