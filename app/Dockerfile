# pull base image of node
FROM node:16.10

# set working directory
WORKDIR /app

# Copy over files
COPY . ./

# Install packages
RUN yarn install

# Start React App
CMD yarn start
