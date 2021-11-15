import pickle5 as pickle
import numpy as np
import pandas as pd
import networkx as nx
from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
from flask import request, redirect, jsonify, render_template
from wtforms import Form, StringField, SelectField
from api.database.models import Course
from sqlalchemy import or_, and_
import json
from api import db
from api.app import app


"""Handle the data from the POST request that will go to the main algorithm.
If we get an empty search, just go back to home.
Otherwise, pull out the elements of the POST request that are used by the algorithm, and get the results.
Then, render the results page with a list of pandas tables containing the results for each year.
Pass the original search to the template as well, so the user can see the context of what they asked for.
"""


@app.route("/results", methods=["POST"])
def search_results():
    results = search_courses(
        request.form["search_keywords"],
        request.form["year"],
        request.form["divisions"],
        request.form["departments"],
        request.form["campuses"],
        request.form["top"],
    )
    return jsonify([item.serialize() for item in results])


def search_courses(search_keywords, year, divisions, departments, campuses, top):
    query = db.session.query(Course)
    if search_keywords:
        query = query.filter(Course.name.ilike(f'%{search_keywords}%'))
    if year:
        query = query.filter_by(course_level=year)
    if divisions:
        query = query.filter_by(division=divisions)
    if departments:
        query = query.filter_by(department=departments)
    if campuses:
        query = query.filter_by(campus=campuses)
    if top:
        query = query.filter_by().limit(top)
    results = query.all()
    return results


"""
This method shows the information about a single course.
First, some basic error handling for if a course is passed that does not exist.
Then, separate the course information into the elements which have specific display functionality and the rest, which we show in a big table.
Pass all that to render template.
"""
@app.route("/course/<code>")
def course(code):

    # If the course code is not present in the dataset, progressively remove the last character until we get a match.
    # For example, if there is no CSC413 then we find the first match that is CSC41.
    # If there are no matches for any character, just go home.
    if code not in df.index:
        while True:
            code = code[:-1]
            if len(code) == 0:
                return redirect("/")
            t = df[df.index.str.contains(code)]
            if len(t) > 0:
                code = t.index[0]
                return redirect("/course/" + code)

    course = df.loc[code]
    # use course network graph to identify pre and post requisites
    course = {
        k: v
        for k, v in course.items()
        if k
        not in [
            "Course",
            "Course Level Number",
            "FASEAvailable",
            "MaybeRestricted",
            "URL",
            "Pre-requisites",
            "Exclusion",
            "Corequisite",
            "Recommended Preparation",
            "AIPreReqs",
            "MajorsOutcomes",
            "MinorsOutcomes",
            "Term",
            "Activity",
        ]
        and v == v
    }
    return jsonify(course)

