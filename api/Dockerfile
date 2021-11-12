# Use the python base image
FROM python:3.7

ENV PYTHONUNBUFFERED=1

WORKDIR api

COPY . ./

RUN pip install -r requirements.txt

WORKDIR /
ENV FLASK_APP=api.app
CMD ["flask", "run", "--host", "0.0.0.0"]