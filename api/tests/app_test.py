from flask.json import jsonify
from api.database.models.account import Account
from api.database.models.profile import Profile
import pytest
import json

from api.app import app
from api.database import db
from flask import g


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

    return client.patch(
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

    return client.delete(
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

    return client.get(request, follow_redirects=True)


def delete_bookmark(client, account, course):
    request = "/bookmark"
    if account != "":
        request = request + "?account=" + account
    if course != "":
        request = request + "&course=" + course

    return client.delete(
        request,
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
    assert data["email"] == "admin@admin.ca"
    assert data["username"] == "admin"
    assert data["roles"] == "user"
    assert "password" not in data


# Alan Du, modified by Yuhang Yan
@pytest.mark.skip
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
    assert data[0]["session_name"] is None
    assert data[1]["session_name"] == "FALL2021"
    assert data[1]["course_name"] is None
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
    token = get_token(client)
    result = client.post(
        "/bookmark",
        data=dict(account="admin", course="ECE444"),
        headers={"Authorization": "Bearer " + token},
        follow_redirects=True,
    )
    assert result.status_code == 200

    # result = post_bookmark(client, "", "ECE444")
    # assert result.status_code == 400
    # data = json.loads(result.data)
    # assert data["message"] == "Please specify an account"

    # result = post_bookmark(client, current_user().username, "ECE444")
    # assert result.status_code == 200
    # data = json.loads(result.data)
    # assert data["account_name"] == current_user().username
    # assert data["course_name"] == "ECE444"


@pytest.mark.skip
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


@pytest.mark.skip
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


def test_reaction_post(client):
    result = post_reaction(client, "admin", "", "")
    assert result.status_code == 400

    result = post_reaction(client, "admin", "ECE444", "")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["account_name"] == "admin"


def test_reaction_get(client):
    post_reaction(client, "admin", "ECE444", "")

    result = get_reaction(client, "")
    assert result.status_code == 400

    result = get_reaction(client, "ECE444")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["views"] == 1
    assert data["rating"] is None

    post_reaction(client, "admin2", "ECE444", "5")
    post_reaction(client, "admin3", "ECE444", "4")
    result = get_reaction(client, "ECE444")
    data = json.loads(result.data)
    assert data["views"] == 3
    assert data["rating"] == 4.5


def test_reaction_patch(client):
    post_reaction(client, "admin", "ECE444", "")

    result = patch_reaction(client, "admin", "", 5)
    assert result.status_code == 400

    result = patch_reaction(client, "admin", "ECE444", 4)
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data["rating"] == 4

    result = get_reaction(client, "ECE444")
    data = json.loads(result.data)
    assert data["rating"] == 4


def test_reaction_delete(client):
    post_reaction(client, "admin", "ECE444", "")

    result = delete_reaction(client, "admin", "")
    assert result.status_code == 400

    result = delete_reaction(client, "admin", "ECE444")
    assert result.status_code == 200
    data = json.loads(result.data)
    assert data == 1
