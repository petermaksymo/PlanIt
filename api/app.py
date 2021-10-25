from flask import jsonify

from api import create_app, database

from api.database import db

app = create_app('development')

@app.route('/', methods=['GET'])
def index():
    return jsonify(status='API is Up!')

@app.route('/recreatedatabase')
def recreatedatabase():
    return '<h1> Database Re-created'
    
# Import the account related endpoints
import api.routes.account

# Import the course related endpoints
import api.routes.course
