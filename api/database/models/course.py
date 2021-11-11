from api import db
from api.database import Serializer


"""
Construct the courses information table

Columns in df_processed.csv file:
Code,Name,Division,Course Description,Department,Pre-requisites,Course Level,UTSC Breadth,APSC Electives,Campus,
Term,Activity,Last updated,Exclusion,UTM Distribution,Corequisite,Recommended Preparation,Arts and Science Breadth,
Arts and Science Distribution,Later term course details,Course,FASEAvailable,MaybeRestricted,MajorsOutcomes,MinorsOutcomes,AIPreReqs

The data can be imported to database using pgAdmin4
"""


class Course(db.Model):
    """Model for courses."""

    __tablename__ = "course"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    code = db.Column(db.String, index=False, unique=True, nullable=False)
    name = db.Column(
        db.String, index=False, unique=False, nullable=False
    )  # Some courses have the same name, so this cannot be unique.
    division = db.Column(db.String, nullable=False)
    course_description = db.Column(db.Text)
    department = db.Column(db.Text, nullable=False)
    pre_requisites = db.Column(db.String)
    course_level = db.Column(db.SmallInteger)
    UTSC_breadth = db.Column(db.String)
    APSC_electives = db.Column(db.String)
    campus = db.Column(db.String)
    term = db.Column(db.String)
    activity = db.Column(db.String)
    last_updated = db.Column(db.DateTime)
    exclusion = db.Column(db.String)
    UTM_distribution = db.Column(db.String)
    corequisites = db.Column(db.String)
    recommended_preparation = db.Column(db.String)
    arts_and_science_breadth = db.Column(db.String)
    arts_and_science_distribution = db.Column(db.String)
    later_term_course_details = db.Column(db.String)
    course_link = db.Column(db.String)
    FASE_available = db.Column(db.Boolean)
    may_be_restricted = db.Column(db.Boolean)
    Majors_outcomes = db.Column(db.String)
    Minors_outcomes = db.Column(db.String)
    ai_Pre_Reqs = db.Column(db.String)

    def serialize(self):
        d = Serializer.serialize(self)
        return d
