# Dockerfile
# -----------------------------------------------------------------------------
# This Dockerfile defines how to build a Docker image for a Node.js-based
# service — either the frontend (React + Vite) or backend (Express).
#
# Used in combination with `docker-compose.yml`, this allows the app to run
# in an isolated, consistent environment across different machines.
#
# Key stages:
# - Use Node.js 18 as the base image
# - Set up the working directory
# - Copy app source code into the container
# - Install dependencies
# - Start the development server using `npm run dev`
#
# This Dockerfile supports development and local testing, and can be extended
# for production builds if needed.
# -----------------------------------------------------------------------------

# Use the official Node.js v18 image as the base
FROM node:18

# Set the working directory inside the container to /app
WORKDIR /app

# Copy all files from the current host directory into the container’s /app directory
COPY . .

# Install all dependencies listed in package.json
RUN npm install

# Specify the default command to run when the container starts
# In this case, it starts the app in development mode
CMD ["npm", "run", "dev"]
