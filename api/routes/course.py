from flask import jsonify, request
from datetime import datetime

from api.app import app
from api.database import db
from api.database.models import Course

@app.route('/course', methods=['GET', 'POST'])
def course():
    return "<h1>Course API test</h1>"

# Import the account related endpoints
import api.routes.account