import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super secret string that will never be cracked or pushed to a public github repo'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

@app.route('/', methods=['GET'])
def index():
    return jsonify(status='API is Up!')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('API_PORT'))