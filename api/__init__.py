from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS

from api.database import db

import api.database.models
from api.database.models import Account

def create_app(config_name):
    app = Flask(__name__)

    config_module = f"api.config.{config_name.capitalize()}Config"

    app.config.from_object(config_module)
    app.app_context().push()

    CORS(app, origins=["*", "http://localhost:3000"])

    db.init_app(app)
    db.create_all()

    login_manager = LoginManager()
    login_manager.init_app(app)



    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return Account.query.get(int(user_id))

    with app.app_context():
        return app
