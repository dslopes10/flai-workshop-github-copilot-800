#!/bin/bash
set -e

echo "===== Starting Django Backend Server ====="

# Navigate to backend directory
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend

# Activate virtual environment
source /workspaces/flai-workshop-github-copilot-800/.venv/bin/activate

# Check if server is already running
if lsof -i:8000 > /dev/null 2>&1; then
    echo "Port 8000 is already in use. Killing existing process..."
    fuser -k 8000/tcp || true
    sleep 2
fi

echo "Starting Django server on 0.0.0.0:8000..."
echo "Logs will be written to: /tmp/django-server.log"

# Start server
nohup python manage.py runserver 0.0.0.0:8000 > /tmp/django-server.log 2>&1 &
SERVER_PID=$!

echo "Django server started with PID: $SERVER_PID"
sleep 3

# Check if it's running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Django server is running!"
    echo "   API: https://obscure-space-telegram-pwxq4p7vxp63rx4j-8000.app.github.dev/api/"
    echo "   Logs: tail -f /tmp/django-server.log"
else
    echo "❌ Django server failed to start. Check logs:"
    tail -20 /tmp/django-server.log
    exit 1
fi
