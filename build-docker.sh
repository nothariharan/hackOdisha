#!/bin/bash

# Build and tag Docker images
echo "Building backend Docker image..."
docker build -t ecotrack/backend:latest ./backend

echo "Building frontend Docker image..."
docker build -t ecotrack/frontend:latest ./eco-tracker

echo "Docker images built successfully!"
echo "To push to a registry:"
echo "docker tag ecotrack/backend:latest your-registry/ecotrack/backend:latest"
echo "docker tag ecotrack/frontend:latest your-registry/ecotrack/frontend:latest"
echo "docker push your-registry/ecotrack/backend:latest"
echo "docker push your-registry/ecotrack/frontend:latest"
