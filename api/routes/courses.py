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


def course_filter(query, year, division, department, campus, top, sort_by):
    if year:
        query = query.filter_by(course_level=year)
    if division:
        query = query.filter_by(division=division)
    if department:
        query = query.filter_by(department=department)
    if campus:
        query = query.filter_by(campus=campus)
    if sort_by:
        query = query.order_by(getattr(Course, sort_by))
    if top:
        query = query.limit(int(top))
    return query


def search_by_courses_code_number(
    search_keywords, year, division, department, campus, top, sort_by
):
    query = db.session.query(Course)
    query = query.filter(Course.code.ilike(f"%{search_keywords}%"))
    query = course_filter(query, year, division, department, campus, top, sort_by)
    return query


def search_by_courses_code(
    search_keywords, year, division, department, campus, top, sort_by
):
    query = db.session.query(Course)
    query = query.filter(Course.code.ilike(f"{search_keywords}%"))
    query = course_filter(query, year, division, department, campus, top, sort_by)
    return query


def search_by_courses_name(
    search_keywords, year, division, department, campus, top, sort_by
):
    query = db.session.query(Course)
    query = query.filter(Course.name.ilike(f"%{search_keywords}%"))
    query = course_filter(query, year, division, department, campus, top, sort_by)
    return query


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
    division = request.args.get("division")
    department = request.args.get("department")
    campus = request.args.get("campus")
    top = request.args.get("top")
    sort_by = request.args.get("sort_by")
    if top is None:
        top = "50"
    if search_keywords:
        if len(search_keywords) <= 4 and all(
            char.isdigit() for char in search_keywords
        ):
            # Search by course code (number only)
            query = search_by_courses_code_number(
                search_keywords, year, division, department, campus, top, sort_by
            )
            if query.count() != 0:
                results = query.all()
                return jsonify([item.to_dict() for item in results])
        if len(search_keywords) <= 8:
            # Search by course code
            query = search_by_courses_code(
                search_keywords, year, division, department, campus, top, sort_by
            )
            if query.count() != 0:
                results = query.all()
                return jsonify([item.to_dict() for item in results])
        # Search by course name
        # Met "and" or "&" in search_keywords
        if "and" in search_keywords.lower() or "&" in search_keywords:
            search_keywords = search_keywords.replace("and", "&")
            query1 = search_by_courses_name(
                search_keywords, year, division, department, campus, top, sort_by
            )
            search_keywords = search_keywords.replace("&", "and")
            query2 = search_by_courses_name(
                search_keywords, year, division, department, campus, top, sort_by
            )
            l1 = query1.all()
            l2 = query2.all()
            results = [*l1, *l2]
            return jsonify([item.to_dict() for item in results])
        # Search by course name. Normal search.
        query = search_by_courses_name(
            search_keywords, year, division, department, campus, top, sort_by
        )
        results = query.all()
        return jsonify([item.to_dict() for item in results])
    else:
        # If search_keywords not exist, just do filters.
        query = db.session.query(Course)
        query = course_filter(query, year, division, department, campus, top, sort_by)
        results = query.all()
        return jsonify([item.to_dict() for item in results])


"""
This method shows the information about a single course.
"""


@app.route("/course/<code>")
def course(code):
    query = db.session.query(Course)
    course = query.filter(Course.code.ilike(f"{code}%")).first()
    if course:
        return jsonify(course.to_dict())
    else:
        raise Exception("Invalid Course Code!")
