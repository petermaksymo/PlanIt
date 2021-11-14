from flask.json import jsonify
from api.database.models.account import Account
from api.database.models.profile import Profile
import pytest
import json

from api.app import app
from api.database import db
from flask_login import current_user
from contextlib import contextmanager
from flask import appcontext_pushed, g


@contextmanager
def user_set(app, user):
    def handler(sender, **kwargs):
        g.user = user

    with appcontext_pushed.connected_to(handler, app):
        yield


@pytest.fixture
def client():
    db.create_all()
    yield app.test_client()  # tests run here
    db.session.commit()
    db.drop_all()


def test_status(client):
    response = client.get("/status")
    assert response.status_code == 200


def login_account(client, email, password):
    return client.post(
        "/login", data=dict(email=email, password=password), follow_redirects=True
    )


def post_account(client, email, name, password):
    return client.post(
        "/signup",
        data=dict(email=email, name=name, password=password),
        follow_redirects=True,
    )


def post_profile(client, account, profile, session, course):
    return client.post(
        "/profile",
        data=dict(account=account, profile=profile, session=session, course=course),
        follow_redirects=True,
    )


def patch_profile(client, account, profile, newname):
    request = "/profile"
    if account != "":
        request = request + "?account=" + account
    if profile != "":
        request = request + "&profile=" + profile
    
    return client.patch (
        request,
        data=dict(profile=newname),
        follow_redirects=True,
    )


def delete_profile(client, account, profile, session, course):
    request = "/profile"
    if account != "":
        request = request + "?account=" + account
    if profile != "":
        request = request + "&profile=" + profile
    if session != "":
        request = request + "&session=" + session
    if course != "":
        request = request + "&course=" + course

    return client.delete (
        request,
        follow_redirects=True,
    )


def post_bookmark(client, account, course):
    return client.post(
        "/bookmark",
        data=dict(account=account, course=course),
        follow_redirects=True,
    )


def get_bookmark(client, account):
    request = "/bookmark"
    if account != "":
        request = request + "?account=" + account
    
    return client.get(
        request,
        follow_redirects=True
    )


def delete_bookmark(client, account, course):
    request  = "/bookmark"
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
    response = client.get("/course/ECE444H1")
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["Name"] == "Software Engineering"


# Peter Maksymowsky
def test_course_redirect(client):
    """Ensure a redirect to a relevant course given a slightly incorrect query"""
    response = client.get("/course/ECE444")
    assert response.status_code == 302
    assert response.location == "http://localhost/course/ECE444H1"


# #Alan Du
def test_account_post(client):
    """Ensure account can be created in database"""
    response = post_account(client, "admin@admin.ca", "admin", "admin")
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["name"] == "admin"


# Alan Du, modified by Yuhang Yan
def test_account_get(client):
    """Ensure account can be retrieved from database"""
    post_account(client, "admin@admin.ca", "admin", "admin")
    response = login_account(client, "admin@admin.ca", "admin")
    assert response.status_code == 200
    accounts = Account.query.filter_by(email="admin@admin.ca").all()
    assert len(accounts) == 1
    assert accounts[0].name == "admin"


def test_profile_post(client):
    """Ensure profiles can be added"""
    result = post_profile(client, "", "main", "", "")
    assert result.status_code == 400
    data = json.loads(result.data)
    assert data["message"] == "Please specify an account"

    result = post_profile(client, "admin", "main", "", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["account_name"] == "admin"


def test_profile_get(client):
    """Ensure profiles can be fetched"""
    post_profile(client, "admin", "main", "", "")
    post_profile(client, "admin", "main", "FALL2021", "")
    post_profile(client, "admin", "main", "FALL2021", "ECE444")

    result = client.get("/profile?account=admin", follow_redirects=True)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["profile_name"] == "main"
    assert data[0]["session_name"] == None
    assert data[1]["session_name"] == "FALL2021"
    assert data[1]["course_name"] == None
    assert data[2]["course_name"] == "ECE444"


def test_profile_patch(client):
    """Ensure profiles can be updated"""
    post_profile(client, "admin", "main", "", "")
    post_profile(client, "admin", "main", "FALL2021", "")
    post_profile(client, "admin", "main", "FALL2021", "ECE444")

    result = patch_profile(client, "admin", "main", "main2")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["profile_name"] == "main2"
    assert data[1]["profile_name"] == "main2"
    assert data[2]["profile_name"] == "main2"


def test_profile_delete(client):
    """Ensure profiles can be deleted"""
    post_profile(client, "admin", "main", "", "")
    post_profile(client, "admin", "main", "FALL2021", "")
    post_profile(client, "admin", "main", "FALL2021", "ECE444")
    result = delete_profile(client, "admin", "main", "FALL2021", "ECE444")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 1

    post_profile(client, "admin", "main", "FALL2021", "ECE444")
    result = delete_profile(client, "admin", "main", "FALL2021", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 2

    post_profile(client, "admin", "main", "FALL2021", "")
    post_profile(client, "admin", "main", "FALL2021", "ECE444")
    result = delete_profile(client, "admin", "main", "", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 3


def test_bookmark_post(client):
    result = post_bookmark(client, "", "ECE444")
    assert result.status_code == 400
    data = json.loads(result.data)
    assert data["message"] == "Please specify an account"

    result = post_bookmark(client, "admin", "ECE444")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["account_name"] == "admin"
    assert data["course_name"] == "ECE444"


def test_bookmark_get(client):
    post_bookmark(client, "admin", "ECE444")
    post_bookmark(client, "admin", "ECE421")

    result = get_bookmark(client, "")
    assert result.status_code == 400
    data = json.loads(result.data)
    assert data["message"] == "Please specify an account"

    result = get_bookmark(client, "admin")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["course_name"] == "ECE444"
    assert data[1]["course_name"] == "ECE421"


def test_bookmark_delete(client):
    post_bookmark(client, "admin", "ECE444")
    post_bookmark(client, "admin", "ECE421")

    result = delete_bookmark(client, "admin", "")
    assert result.status_code == 400
    data = json.loads(result.data)
    assert data["message"] == "Please specify a course"

    result = delete_bookmark(client, "admin", "ECE444")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 1