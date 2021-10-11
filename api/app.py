import os
from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super secret string that will never be cracked or pushed to a public github repo'

@app.route('/')
def index():
    return 'API is Up!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT'))