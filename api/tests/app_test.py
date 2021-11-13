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
    post_profile(client, "admin", "main", "", "")
    query = Profile.query.filter_by(account_name="admin").first()
    assert query.account_name == "admin"


def test_profile_get(client):
    """Ensure profiles can be fetched"""
    post_profile(client, "admin", "main", "", "")
    post_profile(client, "admin", "main", "FALL2021", "")
    post_profile(client, "admin", "main", "FALL2201", "ECE444")

    result = client.get("/profile?account=admin", follow_redirects=True)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data[0]["profile_name"] == "main"
    assert data[0]["session_name"] == None
    assert data[1]["session_name"] == "FALL2021"
    assert data[1]["course_name"] == None
    assert data[2]["course_name"] == "ECE444"


def patch_profile(client, account, profile, newname):
    return client.patch (
        "/profile?account=" + account + "&profile=" + profile,
        data=dict(profile=newname),
        follow_redirects=True,
    )


def delete_profile(client, account, profile, session, course):
    request = "/profile?account=" + account + "&profile"
    if profile != "":
        request = request + "=" + profile
    request = request + "&session"
    if session != "":
        request = request + "=" + session
    request = request + "&course"
    if course != "":
        request = request + "=" + course

    print(request)

    return client.delete (
        request,
        follow_redirects=True,
    )

def test_profile_patch(client):
    """Ensure profiles can be updated"""
    post_profile(client, "admin", "main", "", "")
    post_profile(client, "admin", "main", "FALL2021", "")
    post_profile(client, "admin", "main", "FALL2201", "ECE444")

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

    post_profile(client, "admin", "main", "FALL2201", "ECE444")
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
