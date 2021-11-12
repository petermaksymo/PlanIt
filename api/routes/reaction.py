from flask import jsonify, request
import json

from api.app import app
from api.database import db
from api.database.models import Reaction

@app.route("/reaction", methods=["GET", "POST", "PATCH", "DELETE"])
def reaction():
    if request.method == "POST":
        account = request.form["account"]
        course = request.form["course"]
        rating = request.form["rating"]

        if len(rating) == 0:
            rating = None
        
        new_entry = Reaction(
            rating=rating,
            account_name=account,
            course_name=course,
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.serialize())

    elif request.method == "GET":
        course = request.args.get("course")
        result = Reaction.query.filter_by(
            course_name=course,
            ).all()
        views, total_ratings, total_raters = 0, 0, 0
        
        for each in result:
            views+=1
            if each.rating is not None:
                total_raters+=1
                total_ratings = total_ratings + int(each.rating)
        
        return json.dumps([views, total_ratings/total_raters])

    elif request.method == "PATCH":
        account = request.args.get("account")
        course = request.args.get("course")
        rating = request.form["rating"]
        entry = Reaction.query.filter_by(
            account_name=account, 
            course_name=course,
        )
        entry.rating = rating
        
        db.session.commit()
        return jsonify(entry.serialize())

    elif request.method == "DELETE":
        account = request.args.get("account")
        course = request.args.get("course")

        if account is not None:
            if course is None:
                result = Reaction.query.filter_by(
                    account_name=account,
                ).delete()
            else:
                result = Reaction.query.filter_by(
                    account_name=account,
                    course_name=course,
                ).delete()

        db.session.commit()
        return jsonify(result)