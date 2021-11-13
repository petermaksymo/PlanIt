from api.database.models.account import Account
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


def test_profile_add(client):
    """Ensure profiles can be added"""
    result = client.post(
        "/profile",
        data=dict(account="admin", profile="main", session="", course=""),
        follow_redirects=True,
    )
    data = json.loads(result.data)
    assert data["account_name"] == "admin"


def test_profile_get(client):
    """Ensure profiles can be fetched"""
    client.post(
        "/profile",
        data=dict(account="admin", profile="main", session="", course=""),
        follow_redirects=True,
    )
    client.post(
        "/profile",
        data=dict(account="admin", profile="main", session="FALL2021", course=""),
        follow_redirects=True,
    )
    client.post(
        "/profile",
        data=dict(account="admin", profile="main", session="FALL2021", course="ECE444"),
        follow_redirects=True,
    )

    result = client.get("/profile?name=admin", follow_redirects=True)
    assert result.status_code == 200
