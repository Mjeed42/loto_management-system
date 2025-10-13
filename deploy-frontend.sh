#!/bin/bash

# LOTO Frontend Build, Push, and Deploy Script
# Optimized Docker image (59MB vs 1.59GB)

# Set environment variables
export PROJECT_ID=loto-404
export REGION=europe-west1
export REPO_NAME=loto-repo
export SERVICE_NAME=loto-frontend
export BACKEND_SERVICE_URL_PLACEHOLDER=https://loto-backend-643788243736.europe-west1.run.app

echo "🚀 Starting LOTO Frontend Deployment Process..."

# Step 1: Build the optimized Docker image
echo "📦 Building optimized Docker image..."
docker build \
  --build-arg REACT_APP_API_URL=https://loto-backend-643788243736.europe-west1.run.app/api \
  -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-frontend:latest \
  ./frontend

if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
else
    echo "❌ Docker build failed!"
    exit 1
fi

# Step 2: Push to Google Cloud Container Registry
echo "📤 Pushing image to Google Cloud Container Registry..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-frontend:latest

if [ $? -eq 0 ]; then
    echo "✅ Image pushed successfully!"
else
    echo "❌ Image push failed!"
    exit 1
fi

# Step 3: Deploy to Cloud Run
echo "🚀 Deploying to Google Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-frontend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 80 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your frontend is now live!"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')
    echo "🔗 Service URL: ${SERVICE_URL}"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 LOTO Frontend deployment process completed!"
echo "📊 Image size: ~59MB (96% smaller than before!)"
echo "⚡ Optimized with nginx for production serving"






