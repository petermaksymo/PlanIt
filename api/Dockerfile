# Use the python base image
FROM python:3.8

WORKDIR api

COPY . ./

RUN pip install -r requirements.txt

CMD ["python", "app.py"]
