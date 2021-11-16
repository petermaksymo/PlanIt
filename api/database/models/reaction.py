from sqlalchemy_serializer import SerializerMixin
from api import db


class Reaction(db.Model, SerializerMixin):
    """
    Model for reactions
    Reactions includes both the number of views and the ratings of a course.
    Every entry in the db is a view but only the entries with a rating value
    are included in the rating calculation.
    """

    __tablename__ = "reaction"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    rating = db.Column(db.Integer, unique=False, nullable=True)
    account_name = db.Column(
        db.String, db.ForeignKey("account.username"), unique=False, nullable=False
    )
    course_name = db.Column(
        db.String, db.ForeignKey("course.code"), unique=False, nullable=False
    )
