from flask import jsonify

from api import create_app

app = create_app('development')

@app.route('/', methods=['GET'])
def index():
    return jsonify(status='API is Up!')

# Import the account related endpoints
import api.routes.account
import api.routes.courses
