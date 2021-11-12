import pytest
import json

from api.app import app
from api.database import db


@pytest.fixture
def client():
    db.create_all()
    yield app.test_client()  # tests run here
    db.session.commit()
    db.drop_all()


def test_index(client):
    response = client.get("/")
    assert response.status_code == 200


def get_account(client, name):
    return client.get("/account?name=admin", follow_redirects=True)


def post_account(client, name, password):
    return client.post(
        "/account", data=dict(name=name, password=password), follow_redirects=True
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
    response = post_account(client, "admin", "admin")
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["name"] == "admin"


# Alan Du
def test_account_get(client):
    """Ensure account can be retrieved from database"""
    post_account(client, "admin", "admin")
    response = get_account(client, "admin")
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data["name"] == "admin"
    response = client.get("/account", data=dict(name="not_admin"))
    assert response.status_code == 404


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
