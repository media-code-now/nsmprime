#!/bin/bash

# NSM Prime Blog Automation Startup Script
# Starts the automated blog generation system

echo "🚀 Starting NSM Prime Blog Automation System..."
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if required packages are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing required packages..."
    npm install
fi

echo "📊 Current blog status:"
node blog-automation-scheduler.js status

echo ""
echo "🎛️  Available commands:"
echo "  1. Start continuous automation (recommended)"
echo "  2. Generate one post now"
echo "  3. View current configuration"
echo "  4. Open dashboard in browser"
echo "  5. Exit"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo "🤖 Starting continuous blog automation..."
        echo "💡 Tip: Press Ctrl+C to stop the automation"
        echo "📅 System will generate new posts every 3 days at 9:00 AM"
        echo ""
        node blog-automation-scheduler.js start
        ;;
    2)
        echo "📝 Generating a new blog post..."
        node blog-automation-scheduler.js generate
        echo "✅ Done! Check your blog to see the new post."
        ;;
    3)
        echo "⚙️  Current configuration:"
        node blog-automation-scheduler.js config
        ;;
    4)
        echo "🌐 Opening dashboard..."
        if command -v open &> /dev/null; then
            open blog-automation-dashboard.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open blog-automation-dashboard.html
        else
            echo "Please open blog-automation-dashboard.html in your browser"
        fi
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please try again."
        exit 1
        ;;
esac