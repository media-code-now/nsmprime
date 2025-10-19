#!/bin/bash

# NSM Prime Next.js Blog Setup and Demo Script
# This script sets up the development environment and runs the blog

echo "🚀 NSM Prime Next.js Blog Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if the blog data files exist
if [ ! -f "data/posts.json" ]; then
    echo "❌ Blog posts data file not found: data/posts.json"
    exit 1
fi

if [ ! -f "data/trending.json" ]; then
    echo "❌ Trending posts data file not found: data/trending.json"
    exit 1
fi

echo "✅ Blog data files found"

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript type checking found issues (this is expected in development)"
fi

# Start development server
echo "🌟 Starting development server..."
echo ""
echo "📱 Your blog will be available at:"
echo "   - Blog Page: http://localhost:3000/blog"
echo "   - API Routes: http://localhost:3000/api/*"
echo ""
echo "🔧 Available commands:"
echo "   - npm run dev     : Start development server"
echo "   - npm run build   : Build for production"
echo "   - npm run start   : Start production server"
echo "   - npm run lint    : Run ESLint"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"

# Start the development server
npm run dev