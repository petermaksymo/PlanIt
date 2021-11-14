from flask import jsonify, request
from flask_praetorian import auth_required, current_user

from api.app import app
from api.database import db
from api.database.models import Bookmark


@app.route("/bookmark", methods=["GET", "POST", "DELETE"])
@auth_required
def bookmark():
    if request.method == "POST":
        course = request.form["course"]

        if len(course) == 0:
            return jsonify({"status": 0, "message": "Please specify a course"}), 400

        new_entry = Bookmark(
            account_name=current_user().username,
            course_name=course,
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.serialize())

    elif request.method == "GET":
        course = request.args.get("course")

        if course is None:
            result = Bookmark.query.filter_by(
                account_name=current_user.username(),
            ).all()
            return jsonify([item.serialize() for item in result])
        else:
            result = Bookmark.query.filter_by(
                account_name=current_user().username, course_name=course
            ).all()
            return jsonify([item.serialize() for item in result])

    elif request.method == "DELETE":
        course = request.args.get("course")
        if course is None:
            return jsonify({"status": 0, "message": "Please specify a course"}), 400

        result = Bookmark.query.filter_by(
            account_name=current_user().username,
            course_name=course,
        ).delete()
        db.session.commit()
        return jsonify(result)
