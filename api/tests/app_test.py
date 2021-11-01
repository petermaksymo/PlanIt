import pytest
import json
from pathlib import Path

from api.app import app
from api.database import db

@pytest.fixture
def client():
    BASE_DIR = Path(__file__).resolve().parent.parent

    yield app.test_client()  # tests run here

def test_index(client):
    response = client.get('/')
    assert response.status_code == 200


# Peter Maksymowsky
def test_course_success(client):
    """Ensure the correct course is returned with a successful query"""
    response = client.get('/course/ECE444H1')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['Name'] == 'Software Engineering'


# Peter Maksymowsky
def test_course_redirect(client):
    """Ensure a redirect to a relevant course given a slightly incorrect query"""
    response = client.get('/course/ECE444')
    assert response.status_code == 302
    assert response.location == 'http://localhost/course/ECE444H1'
