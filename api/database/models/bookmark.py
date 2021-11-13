from api import db
from api.database import Serializer


class Bookmark(db.Model):
    """Model for bookmarks"""

    __tablename__ = "bookmark"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    account_name = db.Column(db.String, unique=False, nullable=False)
    course_name = db.Column(db.String, unique=False, nullable=False)

    def serialize(self):
        d = Serializer.serialize(self)
        return d
