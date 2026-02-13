#!/usr/bin/env python3
"""
Script to create React app in octofit-tracker/frontend directory using npx create-react-app
"""
import subprocess
import sys
import os

def main():
    # Change to workspace root
    os.chdir('/workspaces/flai-workshop-github-copilot-800')
    
    # Create React app in frontend directory
    print("Creating React app in octofit-tracker/frontend...")
    
    try:
        result = subprocess.run(
            ['npx', 'create-react-app', 'octofit-tracker/frontend'],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        print(result.stdout)
        
        if result.stderr:
            print("STDERR:", result.stderr, file=sys.stderr)
        
        if result.returncode != 0:
            print(f"Error: Command exited with code {result.returncode}", file=sys.stderr)
            sys.exit(result.returncode)
        
        print("\n✅ React app created successfully!")
        
    except subprocess.TimeoutExpired:
        print("Error: Command timed out after 5 minutes", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
