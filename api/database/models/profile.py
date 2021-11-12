from api import db
from api.database import Serializer


class Profile(db.Model):
    """Model for profiles"""

    __tablename__ = "profile"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    account_name = db.Column(db.String, unique=False, nullable=False)
    profile_name = db.Column(db.String, unique=False, nullable=False)
    session_name = db.Column(db.String, unique=False, nullable=True)
    course_name = db.Column(db.String, unique=False, nullable=True)

    def serialize(self):
        d = Serializer.serialize(self)
        return d
