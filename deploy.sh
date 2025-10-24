#!/bin/bash

echo "🚀 Deploying Flutter Knowledge Sync to Vercel..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Check your deployment at: https://flutterlens.vercel.app"
