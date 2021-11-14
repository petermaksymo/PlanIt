from flask import jsonify, request

from api.app import app
from api.database import db
from api.database.models import Profile


@app.route("/profile", methods=["GET", "POST", "PATCH", "DELETE"])
def profile():
    if request.method == "POST":
        """
        Profile [POST] request - adds a new profile entry into the db.
        Input:  Requires the account name, profile name, session name (optional),
                course name (optional) as a form. - Check /models/profile.py for details.
        Output: Returns the entry that was created.
        """
        account = request.form["account"]
        profile = request.form["profile"]
        session = request.form["session"]
        course = request.form["course"]

        if len(account) == 0:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400
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
        """
        Profile [GET] request - returns the entries related to the account.
        Input:  Requires the account name as an argument/parameter.
        Output: Returns the entries associated with the account.
        """
        account = request.args.get("account")
        if account is None:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400

        result = Profile.query.filter_by(account_name=account).all()
        return jsonify([item.serialize() for item in result])

    elif request.method == "PATCH":
        """
        Profile [PATCH] request - updates an existing entry with a new profile name.
        Input:  Requires the account name, current profile name as an argument/parameter
                and the new profile name as a form.
        Output: Returns the entry with the updated profile name.
        """
        account = request.args.get("account")
        old_profile = request.args.get("profile")
        new_name = request.form["profile"]

        if account is None:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400
        if old_profile is None:
            return jsonify({"status": 0, "message": "Please specify a profile"}), 400
        if len(new_name) == 0:
            return jsonify({"status": 0, "message": "Please specify a new name"}), 400

        entry = Profile.query.filter_by(
            account_name=account, profile_name=old_profile
        ).all()
        for each in entry:
            each.profile_name = new_name
        db.session.commit()
        return jsonify([item.serialize() for item in entry])

    elif request.method == "DELETE":
        """
        Profile [DELETE] request - deletes an entry (or multiple) from the db.
        Input:  Requires the account name, profile name (optional), session name (optional),
                course name (optional) as an argument/parameter
                Note: If only an account name is given, then all entries associated
                to the account will be deleted. If only account name and profile name
                is given then the profile, related sessions and courses will be deleted etc...
        Output: Returns the entry with the updated profile name.
        """
        account = request.args.get("account")
        profile = request.args.get("profile")
        session = request.args.get("session")
        course = request.args.get("course")

        if account is not None:
            if profile is not None:
                if session is not None:
                    if course is not None:
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
        else:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400

        db.session.commit()
        return jsonify(result)
