from flask import jsonify, request
import json

from api.app import app
from api.database import db
from api.database.models import Profile


@app.route("/profile", methods=["GET", "POST", "PATCH", "DELETE"])
def profile():
    if request.method == "POST":
        account = request.form["account"]
        profile = request.form["profile"]
        session = request.form["session"]
        course = request.form["course"]

        if len(session) == 0:
            session = None
        if len(course) == 0:
            course = None

        new_entry = Profile(
            account_name=account,
            profile_name=profile,
            session_name=session,
            course_name=course,
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.serialize())

    elif request.method == "GET":
        account = request.args.get("account")
        result = Profile.query.filter_by(account_name=account).all()

        return jsonify([item.serialize() for item in result])

    elif request.method == "PATCH":
        account = request.args.get("account")
        old_profile = request.args.get("profile")
        new_name = request.form["profile"]
        entry = Profile.query.filter_by(
            account_name=account, profile_name=old_profile
        ).all()
        for each in entry:
            each.profile_name = new_name
        db.session.commit()
        return jsonify([item.serialize() for item in entry])

    elif request.method == "DELETE":
        account = request.args.get("account")
        profile = request.args.get("profile")
        session = request.args.get("session")
        course = request.args.get("course")

        if account != None:
            if profile != None:
                if session != None:
                    if course != None:
                        result = Profile.query.filter_by(
                            account_name=account,
                            profile_name=profile,
                            session_name=session,
                            course_name=course,
                        ).delete()
                    else:
                        result = Profile.query.filter_by(
                            account_name=account,
                            profile_name=profile,
                            session_name=session,
                        ).delete()
                else:
                    result = Profile.query.filter_by(
                        account_name=account, profile_name=profile
                    ).delete()
            else:
                result = Profile.query.filter_by(account_name=account).delete()

        db.session.commit()
        return jsonify(result)
