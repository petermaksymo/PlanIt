import pickle5 as pickle
import numpy as np
import pandas as pd
import networkx as nx
from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
from flask import request, redirect, jsonify, render_template
from wtforms import Form, StringField, SelectField
from api.database.models import Course
import json
from api.app import app
from api.database import db


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
        query = query.filter(Course.name.ilike(f"%{search_keywords}%"))
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
"""


@app.route("/course/<code>")
def course(code):
    query = db.session.query(Course)
    course = query.filter_by(code=code).first()
    if course:
        return jsonify(course.serialize())
    else:
        raise Exception("Invalid Course Code!")

