from flask.json import jsonify
from api.database.models.account import Account
from api.database.models.course import Course
from api.database.models.profile import Profile
import pytest
import json
import sqlalchemy

from api.app import app
from api.database import db
from flask import g
from api.routes.courses import search_results


@pytest.fixture
def client():
    db.create_all()
    yield app.test_client()  # tests run here
    db.session.commit()
    db.drop_all()


def test_status(client):
    response = client.get("/status")
    assert response.status_code == 200


def login_account(client, username, password):
    return client.post(
        "/login", data=dict(username=username, password=password), follow_redirects=True
    )


def post_account(client, email, username, password):
    return client.post(
        "/signup",
        data=dict(email=email, username=username, password=password),
        follow_redirects=True,
    )


def get_token(client):
    post_account(client, "admin@admin.ca", "admin", "admin")
    result = login_account(client, "admin", "admin")
    token = json.loads(result.data)
    return token["access_token"]


def post_profile(client, token, profile, session, course):
    return client.post(
        "/profile",
        data=dict(profile=profile, session=session, course_code=course),
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )


def patch_profile(client, token, profile, newname):
    request = "/profile"
    if profile != "":
        request = request + "?profile=" + profile

    return client.patch(
        request,
        data=dict(profile=newname),
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )


def delete_profile(client, token, profile, session, course):
    request = "/profile"
    if profile != "":
        request = request + "?profile=" + profile
    if session != "":
        request = request + "&session=" + session
    if course != "":
        request = request + "&course_code=" + course

    return client.delete(
        request,
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )


def post_bookmark(client, token, course):
    return client.post(
        "/bookmark",
        data=dict(course=course),
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )


def get_bookmark(client, token, course):
    request = "/bookmark"
    if course != "":
        request = request + "?course=" + course

    return client.get(
        request, headers={"Authorization": "Bearer " + token}, follow_redirects=True
    )


def delete_bookmark(client, token, course):
    request = "/bookmark"
    if course != "":
        request = request + "?course=" + course

    return client.delete(
        request,
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )


def post_reaction(client, account, course, rating):
    return client.post(
        "/reaction",
        data=dict(account=account, course=course, rating=rating),
        follow_redirects=True,
    )


def get_reaction(client, course):
    request = "/reaction"
    if course != "":
        request = request + "?course=" + course

    return client.get(request, follow_redirects=True)


def patch_reaction(client, account, course, rating):
    request = "/reaction"
    if account != "":
        request = request + "?account=" + account
    if course != "":
        request = request + "&course=" + course

    return client.patch(
        request,
        data=dict(rating=rating),
        follow_redirects=True,
    )


def delete_reaction(client, account, course):
    request = "/reaction"
    if account != "":
        request = request + "?account=" + account
    if course != "":
        request = request + "&course=" + course

    return client.delete(
        request,
        follow_redirects=True,
    )


# Peter Maksymowsky
def test_course_success(client):
    """Ensure the correct course is returned with a successful query"""
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()
    response = client.get("/course/ECE444H1")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["name"] == "Software Engineering"


# Peter Maksymowsky
"""
Ruled out temperory, since we dont implement this.
"""
"""
def test_course_redirect(client):
    '''Ensure a redirect to a relevant course given a slightly incorrect query'''
    response = client.get("/course/ECE444")
    assert response.status_code == 302
    assert response.location == "http://localhost/course/ECE444H1"
"""


# #Alan Du
def test_account_post(client):
    """Ensure account can be created in database"""
    response = post_account(client, "admin@admin.ca", "admin", "admin")
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["email"] == "admin@admin.ca"
    assert data["username"] == "admin"
    assert data["roles"] == "user"
    assert "password" not in data


# Alan Du, modified by Yuhang Yan
def test_account_get(client):
    """Ensure account can be retrieved from database"""
    token = get_token(client)
    result = client.get(
        "/account",
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["username"] == "admin"
    assert data["email"] == "admin@admin.ca"
    assert "password" not in data


def test_profile_post(client):
    """Ensure profiles can be added"""
    # test without authentication
    result = post_profile(client, "", "main", "", "")
    assert result.status_code == 401

    token = get_token(client)
    result = post_profile(client, token, "main", "", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["account_name"] == "admin"
    assert data["profile_name"] == "main"


def test_profile_get(client):
    """Ensure profiles can be fetched"""
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    token = get_token(client)
    post_profile(client, token, "main", "", "")
    post_profile(client, token, "main", "FALL2021", "")
    post_profile(client, token, "main", "FALL2021", "ECE444H1")

    result = client.get(
        "/profile?account=wrong_account",
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["profile_name"] == "main"
    assert data[0]["session_name"] is None
    assert data[1]["session_name"] == "FALL2021"
    assert data[1]["course_code"] is None
    assert data[2]["course_code"] == "ECE444H1"


def test_profile_patch(client):
    """Ensure profiles can be updated"""
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    token = get_token(client)
    post_profile(client, token, "main", "", "")
    post_profile(client, token, "main", "FALL2021", "")
    post_profile(client, token, "main", "FALL2021", "ECE444H1")

    result = patch_profile(client, token, "main", "main2")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["profile_name"] == "main2"
    assert data[1]["profile_name"] == "main2"
    assert data[2]["profile_name"] == "main2"


def test_profile_delete(client):
    """Ensure profiles can be deleted"""
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    token = get_token(client)
    post_profile(client, token, "main", "", "")
    post_profile(client, token, "main", "FALL2021", "")
    post_profile(client, token, "main", "FALL2021", "ECE444H1")
    result = delete_profile(client, token, "main", "FALL2021", "ECE444H1")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 1

    post_profile(client, token, "main", "FALL2021", "ECE444H1")
    result = delete_profile(client, token, "main", "FALL2021", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 2

    post_profile(client, token, "main", "FALL2021", "")
    post_profile(client, token, "main", "FALL2021", "ECE444H1")
    result = delete_profile(client, token, "main", "", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 3


def test_bookmark_post(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    token = get_token(client)
    result = post_bookmark(client, token, "")
    assert result.status_code == 400

    result = post_bookmark(client, token, "ECE444H1")
    assert result.status_code == 200
    data = json.loads(result.data)

    assert data["account_name"] == "admin"
    assert data["course_code"] == "ECE444H1"
    assert data["course"]["name"] == "Software Engineering"


def test_bookmark_get(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    sample_course_2 = Course(
        code="ECE421H1", name="Intro to Machine Learning", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.add(sample_course_2)
    db.session.commit()

    token = get_token(client)
    post_bookmark(client, token, "ECE444H1")
    post_bookmark(client, token, "ECE421H1")

    result = get_bookmark(client, token, "ECE444H1")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["course_code"] == "ECE444H1"

    result = get_bookmark(client, token, "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["course_code"] == "ECE444H1"
    assert data[1]["course_code"] == "ECE421H1"


def test_bookmark_delete(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    sample_course_2 = Course(
        code="ECE421H1", name="Intro to Machine Learning", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.add(sample_course_2)
    db.session.commit()

    token = get_token(client)
    post_bookmark(client, token, "ECE444H1")
    post_bookmark(client, token, "ECE421H1")

    result = delete_bookmark(client, token, "")
    assert result.status_code == 400
    data = json.loads(result.data)
    assert data["message"] == "Please specify a course"

    result = delete_bookmark(client, token, "ECE444H1")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 1


def test_reaction_post(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    get_token(client)
    result = post_reaction(client, "admin", "", "")
    assert result.status_code == 400

    result = post_reaction(client, "admin", "ECE444H1", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["account_name"] == "admin"


def test_reaction_get(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    get_token(client)
    post_account(client, "admin2@admin.ca", "admin2", "admin")
    post_account(client, "admin3@admin.ca", "admin3", "admin")

    post_reaction(client, "admin", "ECE444H1", "")

    result = get_reaction(client, "")
    assert result.status_code == 400

    result = get_reaction(client, "ECE444H1")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["views"] == 1
    assert data["rating"] is None

    post_reaction(client, "admin2", "ECE444H1", "5")
    post_reaction(client, "admin3", "ECE444H1", "4")
    result = get_reaction(client, "ECE444H1")
    data = json.loads(result.data)
    assert data["views"] == 3
    assert data["rating"] == 4.5


def test_reaction_patch(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    get_token(client)
    post_reaction(client, "admin", "ECE444H1", "")

    result = patch_reaction(client, "admin", "", 5)
    assert result.status_code == 400

    result = patch_reaction(client, "admin", "ECE444H1", 5)
    data = json.loads(result.data)
    assert result.status_code == 200
    assert data["rating"] == 5


def test_reaction_delete(client):
    sample_course = Course(
        code="ECE444H1", name="Software Engineering", division="a", department="a"
    )
    db.session.add(sample_course)
    db.session.commit()

    get_token(client)
    post_reaction(client, "admin", "ECE444H1", "")

    result = delete_reaction(client, "admin", "")
    assert result.status_code == 400

    result = delete_reaction(client, "admin", "ECE444H1")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 1
