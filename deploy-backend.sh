#!/bin/bash

# LOTO Backend Build, Push, and Deploy Script
# Optimized Docker image with production dependencies only

# Set environment variables
export PROJECT_ID=loto-404
export REGION=europe-west1
export REPO_NAME=loto-repo
export SERVICE_NAME=loto-backend
export MONGO_URI="mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority"
export JWT_SECRET="MY_NAME_IS_PEPSICO"
export JWT_EXPIRE="7d"

echo "🚀 Starting LOTO Backend Deployment Process..."

# Step 1: Build the optimized Docker image
echo "📦 Building optimized Docker image..."
docker build \
  -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-backend:latest \
  ./backend

if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
else
    echo "❌ Docker build failed!"
    exit 1
fi

# Step 2: Push to Google Cloud Container Registry
echo "📤 Pushing image to Google Cloud Container Registry..."
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-backend:latest

if [ $? -eq 0 ]; then
    echo "✅ Image pushed successfully!"
else
    echo "❌ Image push failed!"
    exit 1
fi

# Step 3: Deploy to Cloud Run
echo "🚀 Deploying to Google Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/loto-backend:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 5000 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars NODE_ENV=production,MONGO_URI="${MONGO_URI}",JWT_SECRET="${JWT_SECRET}",JWT_EXPIRE="${JWT_EXPIRE}"

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Your backend is now live!"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')
    echo "🔗 Service URL: ${SERVICE_URL}"
    echo "📡 API Base URL: ${SERVICE_URL}/api"
else
    echo "❌ Deployment failed!"
    exit 1
fi

echo "🎉 LOTO Backend deployment process completed!"
echo "🔒 Running with production dependencies only"
echo "🛡️  Security: Non-root user, health checks enabled"
echo "⚡ Optimized for production performance"











