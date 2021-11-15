from flask import jsonify, request
import datetime
from flask_praetorian import auth_required, current_user
from api import guard
from api.app import app
from api.database import db
from api.database.models import Account


@app.route("/account", methods=["GET", "PATCH", "DELETE"])
@auth_required
def account():
    if request.method == "GET":
        return jsonify(current_user.to_dict())
    elif request.method == "PATCH":
        email = request.form.get("email")
        username = request.form.get("username")
        password = request.form.get("password")
        new_account = Account.query.filter_by(id=current_user.id).first()
        if email:
            new_account.email = email
        if username:
            new_account.username = username
        if password:
            new_account.password = guard.hash_password(password)
        db.session.add(new_account)
        db.session.commit()
        return (jsonify(new_account), 200)
    elif request.method == "DELETE":
        deleting_account = Account.query.filter_by(id=current_user.id).first()
        db.session.delete(deleting_account)
        db.session.commit()
        return 200
    else:
        raise Exception("Unsupported Request!")


@app.route("/signup", methods=["POST"])
def signup():
    email = request.form.get("email")
    username = request.form.get("username")
    password = request.form.get("password")
    user = Account.query.filter_by(email=email, username=username).first()
    if user:
        raise Exception("User already exists")
    new_user = Account(
        email=email,
        username=username,
        password=guard.hash_password(password),
        roles="user",
        created_at=datetime.datetime.now(),
    )
    db.session.add(new_user)
    db.session.commit()
    return (jsonify(new_user.to_dict()), 200)


@app.route("/login", methods=["POST"])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and issuing a JWT token.
    """
    username = request.form.get("username")
    password = request.form.get("password")
    user = guard.authenticate(username, password)
    ret = {"access_token": guard.encode_jwt_token(user)}
    return jsonify(ret), 200


@app.route("/refresh", methods=["POST"])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old except that it has a refrehsed access expiration.
    """
    old_token = guard.read_token_from_header()
    new_token = guard.refresh_jwt_token(old_token)
    return jsonify(access_token=new_token)
