#!/usr/bin/env node
/**
 * Build script for frontend with environment variables
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Flutter Knowledge Sync Frontend...');

// Set environment variables
process.env.REACT_APP_API_URL = 'https://flutter-knowledge-syncs.vercel.app';

// Change to frontend directory
const frontendDir = path.join(__dirname, 'frontend');
process.chdir(frontendDir);

try {
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync(path.join(frontendDir, 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Build the React app
  console.log('🔨 Building React app...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Frontend build completed successfully!');
  console.log('📁 Build files are in: frontend/build/');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
