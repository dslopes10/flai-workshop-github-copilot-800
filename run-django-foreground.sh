#!/bin/bash
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend
source /workspaces/flai-workshop-github-copilot-800/.venv/bin/activate
python manage.py runserver 0.0.0.0:8000
