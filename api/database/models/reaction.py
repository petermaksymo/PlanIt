from api import db
from api.database import Serializer

class Reaction(db.Model):
    """Model for reactions"""

    __tablename__ = "reaction"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    rating = db.Column(db.Integer, unique=False, nullable=True)
    account_name = db.Column(db.String, unique=False, nullable=False)
    course_name = db.Column(db.String, unique=False, nullable=False)

    def serialize(self):
        d = Serializer.serialize(self)
        return d