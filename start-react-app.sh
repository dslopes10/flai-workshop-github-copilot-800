#!/bin/bash

echo "Starting React development server..."
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/frontend

# Start npm in the background
nohup npm start > /tmp/react-app.log 2>&1 &

echo "React app starting..."
echo "PID: $!"
echo "Logs: /tmp/react-app.log"
echo ""
echo "Access the app at:"
echo "  Local: http://localhost:3000"
echo "  Codespace: https://obscure-space-telegram-pwxq4p7vxp63rx4j-3000.app.github.dev"
