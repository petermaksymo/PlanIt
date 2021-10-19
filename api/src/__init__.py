import os
from datetime import datetime as dt
from flask import Flask, jsonify, request
from flask_cors import CORS

from src.database import db
from src.database.models import Account

def create_app(config_name):
    app = Flask(__name__)

    config_module = f"src.config.{config_name.capitalize()}Config"

    app.config.from_object(config_module)
    app.app_context().push()

    CORS(app, origins=['*', 'http://localhost:3000'])

    db.init_app(app)
    db.create_all()

    with app.app_context():
        @app.route('/', methods=['GET'])
        def index():
            return jsonify(status='API is Up!')

        @app.route('/account', methods=['GET', 'POST'])
        def account():
            if request.method == 'POST':
                name = request.form['name']
                password = request.form['password']

                new_account = Account(name=name, password=password, created_at=dt.now())
                db.session.add(new_account)  # Adds new User record to database
                db.session.commit()  # Commits all changes
                return jsonify(new_account.serialize())

            elif request.method == 'GET':
                name = request.args.get('name', '')

                account = Account.query.filter_by(name=name).first()
                return jsonify(account.serialize())

        return app
