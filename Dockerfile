# Use the official Node 20 slim image.
FROM node:20-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY app/package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY app/ ./

# Run the web service on container startup.
CMD [ "npm", "start" ]
