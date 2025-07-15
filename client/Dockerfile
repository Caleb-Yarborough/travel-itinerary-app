# Dockerfile (for React frontend - production build)
# -----------------------------------------------------------------------------
# This Dockerfile defines a two-stage build process for deploying the
# AI Travel Itinerary Planner frontend using React and Vite.
#
# Stage 1: Build the app with Node.js (compiles TypeScript and bundles assets)
# Stage 2: Serve the built static files with Nginx for fast production delivery
#
# This method ensures a small, optimized final image with only the static files,
# not the entire Node.js toolchain.
#
# Used when deploying the frontend with Docker or Fly.io in production.
# -----------------------------------------------------------------------------

# -------------------- STAGE 1: React App Build --------------------

# Use Node.js v18 for building the app
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy only dependency-related files first for better Docker caching
COPY package.json package-lock.json ./

# Install project dependencies (React, Vite, etc.)
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Build the app (output will go to /app/dist)
RUN npm run build

# -------------------- STAGE 2: Static File Serving via Nginx --------------------

# Use the official lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy the built frontend from the previous stage into Nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# (Optional) If you have a custom Nginx config, you can copy it here:
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 so the app is accessible via HTTP
EXPOSE 80

# Start Nginx in the foreground (container main process)
CMD ["nginx", "-g", "daemon off;"]
