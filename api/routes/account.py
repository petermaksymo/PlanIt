from flask import jsonify, request, abort
from datetime import datetime

from api.app import app
from api.database import db
from api.database.models import Account

@app.route('/account', methods=['GET', 'POST'])
def account():
    if request.method == 'POST':
        name = request.form['name']
        password = request.form['password']

        new_account = Account(name=name, password=password, created_at=datetime.now())
        db.session.add(new_account)  # Adds new User record to database
        db.session.commit()  # Commits all changes
        return jsonify(new_account.serialize())

    elif request.method == 'GET':
        name = request.args.get('name', '')
        account = Account.query.filter_by(name=name).first()

        if not account:
            return jsonify({ 'error': 'account does not exist' }), 404

        return jsonify(account.serialize())