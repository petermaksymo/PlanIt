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