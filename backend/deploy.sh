#!/bin/bash

# ASCA Backend Deployment Script for Google Cloud Run
# Make sure you have gcloud CLI installed and authenticated

# Set your Google Cloud project ID
PROJECT_ID="your-project-id"
REGION="us-central1"
SERVICE_NAME="asca-backend"
GEMINI_API_KEY="your-api-key-here"

echo "🚀 Deploying ASCA Multi-Agent System to Cloud Run..."

# Set the project
gcloud config set project $PROJECT_ID

# Build and deploy
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🌐 Your service is available at:"
gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)'
