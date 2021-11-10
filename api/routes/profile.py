from flask import jsonify, request

from api.app import app
from api.database import db 
from api.database.models import Profile

@app.route('/profile', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def profile():
    if request.method == 'POST':   
        account = request.form['account']
        profile = request.form['profile']
        session = request.form['session']
        course = request.form['course']

        new_entry = Profile(account_name=account, profile_name=profile, session_name=session, course_name=course)
        db.session.add(new_entry)
        db.session.commit()
        return jsonify(new_entry.serialize())

    elif request.method == 'GET':
        account = request.args.get('account')
        result = Profile.query.filter_by(account_name=account).all()
        return jsonify(result.serialize())
        
    elif request.method == 'PATCH':
        account = request.form['account']
        new_name = request.form['new_name']
        entry = Profile.query.filter_by(account_name=account).all()
        for each in entry:
            each.account_name = new_name
        db.session.commit()
        return jsonify(entry.serialize())

    elif request.method == 'DELETE':
        account = request.form['account']
        profile = request.form['profile']
        session = request.form['session']
        course = request.form['course']

        todelete = None
        if(account != None):
            if(profile != None):
                if(session != None):
                    if(course != None):
                        todelete = Profile(account_name=account, profile_name=profile, session_name=session, course_name=course)
                    else:
                        todelete = Profile()                        
            