from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.inspection import inspect

db = SQLAlchemy()


# From https://stackoverflow.com/a/27951648
class Serializer(object):
    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    def serialize_list(list):
        return [m.serialize() for m in list]
