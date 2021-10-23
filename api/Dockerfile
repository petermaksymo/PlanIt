# Use the python base image
FROM python:3.8

ENV PYTHONUNBUFFERED=1

WORKDIR api

COPY . ./

RUN pip install -r requirements.txt

CMD ["flask", "run", "--host", "0.0.0.0"]