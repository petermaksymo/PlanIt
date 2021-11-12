from flask import jsonify, request, abort, render_template, redirect, url_for, request, flash
from werkzeug.security import generate_password_hash, check_password_hash
import datetime 

from werkzeug.utils import html
from api.app import app
from api.database import db
from api.database.models import Account
from flask_login import login_user, logout_user, login_required, current_user

""" @app.route('/account', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def account():
    if request.method == 'POST':
        signup_post()
    elif request.method == 'GET':
        name = request.args.get('name', '')
        account = Account.query.filter_by(name=name).first()

        if not account:
            return jsonify({ 'error': 'account does not exist' }), 404

        return jsonify(account.serialize()) """

@app.route('/account', methods=['GET', 'PATCH', 'DELETE'])
@login_required
def account():
    if request.method == 'GET':
        return jsonify(current_user.serialize())
    elif request.method == 'PATCH':
        email = request.form.get('email')
        name = request.form.get('name')
        password = request.form.get('password')
        new_account = Account.query.filter_by(id=current_user.id).first()
        if (email):
            new_account.email = email
        elif (name):
            new_account.name = name
        elif (password):
            new_account.password = generate_password_hash(password, method='sha256')
        db.session.add(new_account)
        db.session.commit()
        return '<h1>complete update</h1>'
    elif request.method == 'DELETE':
        deleting_account = Account.query.filter_by(id=current_user.id).first()
        db.session.delete(deleting_account)
        db.session.commit()
        return '<h1>complete delete</h1>'
    else:
        raise Exception("Unsupported Request!")

        

@app.route('/signup')
def signup():
    return  render_template("signup.html")

@app.route('/signup', methods=['POST'])
def signup_post():
    email = request.form.get('email')
    name = request.form.get('name')
    password = request.form.get('password')
    user = Account.query.filter_by(email=email).first()
    if (user):
        flash('Email address already exists')
        return redirect(url_for('signup'))
    new_user = Account(email=email, name=name, password=generate_password_hash(password, method='sha256'), created_at= datetime.datetime.now()) 
    db.session.add(new_user)
    db.session.commit()
    return "<h1>has signed up</h1>"

@app.route('/login')
def login():
    return render_template("login.html")
    
@app.route('/login', methods=["POST"])
def login_post():
    email = request.form.get('email')
    password = request.form.get('password')
    user = Account.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        flash('Please check your login details and try again.')
        return "<h1>wrong password or wrong email</h1>"
    login_user(user)
    return redirect(url_for('profile'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))