from flask import jsonify, request
import json

from api.app import app
from api.database import db
from api.database.models import Reaction


@app.route("/reaction", methods=["GET", "POST", "PATCH", "DELETE"])
def reaction():

    if request.method == "POST":
        """
        Reaction [POST] request - adds a new reaction entry into the db.
        Input:  Requires the account name, course name, and rating (optional)
                as a form - Check /models/reaction.py for details.
        Output: Returns the entry that was created.
        """
        account = request.form["account"]
        course = request.form["course"]
        rating = request.form["rating"]

        if len(account) == 0:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400
        if len(course) == 0:
            return jsonify({"status": 0, "message": "Please specify a course"}), 400
        if len(rating) == 0:
            rating = None

        new_entry = Reaction(
            rating=rating,
            account_name=account,
            course_name=course,
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.to_dict())

    elif request.method == "GET":
        """
        Reaction [GET] request - returns the views and average rating of a course.
        Input:  Requires the course name as an argument/parameter.
        Output: Returns the number of views for the specific course and the average rating.
        """
        course = request.args.get("course")
        if course is None:
            return jsonify({"status": 0, "message": "Please specify a course"}), 400

        result = Reaction.query.filter_by(
            course_name=course,
        ).all()
        views, total_ratings, total_raters = 0, 0, 0

        for each in result:
            views += 1
            if each.rating is not None:
                total_raters += 1
                total_ratings = total_ratings + float(each.rating)

        if total_raters == 0 and total_ratings == 0:
            finalrating = None
        else:
            finalrating = round(total_ratings / total_raters, 1)
        return jsonify({"views": views, "rating": finalrating}), 200

    elif request.method == "PATCH":
        """
        Reaction [PATCH] request - updates an existing entry with a new rating.
        Input:  Requires the account name, course name as an argument/parameter and the new
                rating as a form.
        Output: Returns the entry with the updated rating - should only be 1 item.
        """
        account = request.args.get("account")
        course = request.args.get("course")
        rating = request.form["rating"]

        if account is None:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400
        if course is None:
            return jsonify({"status": 0, "message": "Please specify a course"}), 400
        if rating == "":
            rating = None

        entry = Reaction.query.filter_by(
            account_name=account, course_name=course
        ).first()
        entry.rating = rating

        db.session.commit()
        return jsonify(entry.to_dict())

    elif request.method == "DELETE":
        """
        Reaction [DELETE] request - deletes an entry from the db.
        Input:  Requires the account name, course name as an argument/parameter.
        Output: Returns the number of items deleted.
        """
        account = request.args.get("account")
        course = request.args.get("course")

        if account is None:
            return jsonify({"status": 0, "message": "Please specify an account"}), 400
        if course is None:
            return jsonify({"status": 0, "message": "Please specify a course"}), 400

        result = Reaction.query.filter_by(
            account_name=account,
        ).delete()

        db.session.commit()
        return jsonify(result)
