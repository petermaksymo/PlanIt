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


@app.route("/results", methods=["GET"])
def search_results():
    search_keywords = request.args.get("search_keywords")
    year = request.args.get("year")
    divisions = request.args.get("divisions")
    departments = request.args.get("departments")
    campuses = request.args.get("campuses")
    top = request.args.get("top")
    if top is None:
        top = "50"
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
        query = query.filter_by().limit(int(top))
    results = query.all()
    return jsonify([item.serialize() for item in results])


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
