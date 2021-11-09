from api.app import app


@app.route("/course", methods=["GET", "POST"])
def course():
    return "<h1>Course API test</h1>"
