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
from api.app import app

"""Temporary for now, from: https://github.com/nelaturuk/education_pathways/blob/main/__init__.py"""

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
    courses_contain_keywords = Course.query.filter(Course.name.like(f'%{search_keywords}%')).all()
    # compete the search clause here
    return courses_contain_keywords
"""     if year != None:
        courses_contain_keywords = courses_contain_keywords.query.filter_by(course_level=year).all()
    if divisions != None:
        courses_contain_keywords = courses_contain_keywords.query.filter_by(division=divisions).all()
    if departments != None:
        courses_contain_keywords = courses_contain_keywords.query.filter_by(department=departments).all()
    if campuses != None:
        courses_contain_keywords = courses_contain_keywords.query.filter_by(campus=campuses).all()
    if top != None:
        courses_contain_keywords = courses_contain_keywords.query.first(int(top)) """


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


"""
Main algorithm for searching courses.
In a nutshell:
1. Split search into phrases e.g. machine learning, biology ==> ['machine learning','biology']
2. Find phrases that occur in the vectorizer (if none, give up).
3. Find all courses with a nonzero value for each term, and compare all courses against the set of courses with that non-zero value.
4. For every course that is listed as a pre-requisite, add the relevance of its referrer to a list.
5. Take the average of that list and assign it to the pre-requisite.
6. Get the course data for relevant courses in order of score.

"""


def filter_courses(pos_terms, year, division, department, campus, n_return=10):
    print(pos_terms, year)
    n_return = int(n_return)  # How many courses are we sending back
    year = int(year)  # What year are we primarily looking for
    pos_vals = np.zeros((len(df),))

    # 1. Split search into phrases e.g. machine learning, biology ==> ['machine learning','biology']
    # 2. Find phrases that occur in the vectorizer (if none, give up).
    terms = [
        t for t in pos_terms.split(",") if t.strip() in vectorizer.get_feature_names()
    ]
    print(terms)
    if len(terms) == 0:
        return []

    # 3. Find all courses with a nonzero value for each term, and compare all courses against the set of courses with that non-zero value.
    # To explain, for each term we look for similarity with all the terms that co-occur with it, to give us a wider scope.
    for term in terms:
        idx = vectorizer.transform([term.strip()]).nonzero()[1][0]
        relevants = course_vectors[:, idx].nonzero()[0]
        pos_vals += np.mean(
            cosine_similarity(course_vectors, course_vectors[relevants, :]), axis=1
        )

    # 4. For every course that is listed as a pre-requisite, add the relevance of its referrer to a list.
    requisite_vals = defaultdict(list)
    for (k, v), i in zip(df.iterrows(), list(pos_vals)):
        if i > 100:
            break
        for col in ["Pre-requisites", "Recommended Preparation"]:
            for c in v[col]:
                if c in df.index:
                    requisite_vals[c].append(i)

    # 5. Take the average of that list and assign it to the pre-requisite.
    for (k, v) in requisite_vals.items():
        requisite_vals[k] = np.mean(v)

    # 6. Get the course data for relevant courses in order of score.
    idxs = [
        t[1]
        for t in sorted(
            list(zip(list(pos_vals), list(df.index))), key=lambda x: x[0], reverse=True
        )
    ]
    print(idxs)
    tf = df.loc[idxs]

    print(tf)
    print(tf.columns)

    # 7. Separate results by year, starting with the table for the year actually searched for and then decreasing by year. Apply any filters now.
    tf["Code"] = tf.index
    main_table = tf
    for name, filter in [
        ("Division", division),
        ("Department", department),
        ("Campus", campus),
    ]:
        if filter != "Any":
            main_table = main_table[main_table[name] == filter]

    return main_table[0:n_return][
        [
            "Code",
            "Name",
            "Division",
            "Course Description",
            "Department",
            "Course Level",
            "Pre-requisites",
        ]
    ]


with open("api/resources/course_vectorizer.pickle", "rb") as f:
    vectorizer = pickle.load(f)
with open("api/resources/course_vectors.npz", "rb") as f:
    course_vectors = pickle.load(f)
with open("api/resources/graph.pickle", "rb") as f:
    G = pickle.load(f)
df = pd.read_pickle("api/resources/df_processed.pickle").set_index("Code")
