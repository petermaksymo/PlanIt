# Production Dockerfile, derrived from: https://testdriven.io/blog/deploying-flask-to-heroku-with-docker-and-gitlab/

# Build step #1: build the React front end
FROM node:16.10 as react

WORKDIR /app
COPY ./app ./

ENV REACT_APP_API_BASE_URL='/api'

RUN yarn install
RUN yarn build

# Build step #2: build the api and the nginx proxy
FROM nginx:stable as production
WORKDIR /app

# Install python3
RUN apt update && apt install -y python3-pip libpq-dev

# Copy the built static files from the react stage
COPY --from=react /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./api /app/api
WORKDIR /app/api
RUN pip3 install -r requirements.txt
RUN pip3 install gunicorn

WORKDIR /app

# Run gunicorn as a daemon, replace the post in the nginx config with the assigned heroku port, start nginx
CMD gunicorn -b 0.0.0.0:5000 api.app:app & \
   sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && \
   nginx -g 'daemon off;'