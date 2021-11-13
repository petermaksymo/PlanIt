from api import db
from api.database import Serializer


class Profile(db.Model):
    """
    Model for profiles
    Profiles includes the Profile, the Sessions, and the Courses in each session.
    There are three types of entries that will be in this db.
    1. When a new Profile is created, an entry will be created with the account_name
       and profile_name only. The session_name and course_name will both be NULL/None.
    2. When a new Session is added to a Profile, an entry will be created with the
       account_name, profile_name, and session_name. The course_name will be NULL/None.
    3. When a new Course is added to a Session, an entry will be created with the
       account_name, profile_name, session_name, and course_name.
    """

    __tablename__ = "profile"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    account_name = db.Column(db.String, unique=False, nullable=False)
    profile_name = db.Column(db.String, unique=False, nullable=False)
    session_name = db.Column(db.String, unique=False, nullable=True)
    course_name = db.Column(db.String, unique=False, nullable=True)

    def serialize(self):
        d = Serializer.serialize(self)
        return d
