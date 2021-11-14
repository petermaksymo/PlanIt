from api import db
from api.database import Serializer


class Account(db.Model):
    """Model for accounts."""

    __tablename__ = "account"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    username = db.Column(db.String(64), index=False, unique=True, nullable=False)
    password = db.Column(db.Text, index=False, unique=False, nullable=False)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default="true")
    created_at = db.Column(db.DateTime, index=False, unique=False, nullable=False)

    @property
    def identity(self):
        return self.id

    @property
    def rolenames(self):
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    def is_valid(self):
        return self.is_active

    def serialize(self):
        d = Serializer.serialize(self)
        del d["password"]
        return d
