from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import relationship
from api import db


class Bookmark(db.Model, SerializerMixin):
    """Model for bookmarks"""

    __tablename__ = "bookmark"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    account_name = db.Column(
        db.String, db.ForeignKey("account.username"), unique=False, nullable=False
    )
    course_code = db.Column(
        db.String, db.ForeignKey("course.code"), unique=False, nullable=False
    )
    course = relationship("Course")
    serialize_only = ("id", "account_name", "course_code", "course.name")
