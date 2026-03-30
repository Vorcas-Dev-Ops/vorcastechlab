#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Install root dependencies
echo "1️⃣ Installing root dependencies..."
npm install

# Install server dependencies
echo "2️⃣ Installing server dependencies..."
cd server
npm install
cd ..

# Start the server
echo "3️⃣ Starting server..."
npm start
