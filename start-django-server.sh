#!/bin/bash

echo "Starting Django backend server..."
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend

# Activate virtual environment
source /workspaces/flai-workshop-github-copilot-800/.venv/bin/activate

# Start Django server in the background
nohup python manage.py runserver 0.0.0.0:8000 > /tmp/django-server.log 2>&1 &

echo "Django backend starting..."
echo "PID: $!"
echo "Logs: /tmp/django-server.log"
echo ""
echo "API will be available at:"
echo "  Local: http://localhost:8000/api/"
echo "  Codespace: https://obscure-space-telegram-pwxq4p7vxp63rx4j-8000.app.github.dev/api/"
