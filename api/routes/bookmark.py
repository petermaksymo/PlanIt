from flask import jsonify, request

from api.app import app
from api.database import db
from api.database.models import Bookmark


@app.route("/bookmark", methods=["GET", "POST", "DELETE"])
def bookmark():
    if request.method == "POST":
        account = request.form["account"]
        course = request.form["course"]

        new_entry = Bookmark(
            account_name=account,
            course_name=course,
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.serialize())

    elif request.method == "GET":
        account = request.args.get("account")
        result = Bookmark.query.filter_by(
            account_name=account,
        ).all()
        return jsonify([item.serialize() for item in result])

    elif request.method == "DELETE":
        account = request.args.get("account")
        course = request.args.get("course")
        result = Bookmark.query.filter_by(
            account_name=account,
            course_name=course,
        ).delete()
        db.session.commit()
        return jsonify(result)
