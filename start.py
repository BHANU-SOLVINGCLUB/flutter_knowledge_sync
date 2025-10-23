#!/usr/bin/env python3
"""
Startup script for Flutter Knowledge Sync
This script helps you get started quickly with the application.
"""
import os
import sys
import subprocess
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def check_env_file():
    """Check if .env file exists and guide user to create it"""
    env_file = Path('.env')
    if not env_file.exists():
        LOG.warning("No .env file found!")
        LOG.info("Please copy env.example to .env and configure your settings:")
        LOG.info("  cp env.example .env")
        LOG.info("Then edit .env with your Supabase credentials and other settings.")
        return False
    return True

def install_dependencies():
    """Install Python dependencies"""
    LOG.info("Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        LOG.info("Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        LOG.error(f"Failed to install dependencies: {e}")
        return False

def run_database_setup():
    """Guide user through database setup"""
    LOG.info("Database Setup Instructions:")
    LOG.info("1. Go to https://supabase.com and create a new project")
    LOG.info("2. In your Supabase project dashboard:")
    LOG.info("   - Go to Settings > API")
    LOG.info("   - Copy your Project URL and anon/public key")
    LOG.info("   - Add them to your .env file")
    LOG.info("3. Go to SQL Editor and run the contents of sql/init_tables.sql")
    LOG.info("4. This will create the required tables: flutter_docs, pub_packages, github_issues")

def start_server():
    """Start the FastAPI server"""
    LOG.info("Starting FastAPI server...")
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "api.server:app", 
            "--reload", 
            "--host", "0.0.0.0", 
            "--port", "8000"
        ])
    except KeyboardInterrupt:
        LOG.info("Server stopped by user")

def start_scheduler():
    """Start the background scheduler"""
    LOG.info("Starting background scheduler...")
    try:
        subprocess.run([sys.executable, "main.py"])
    except KeyboardInterrupt:
        LOG.info("Scheduler stopped by user")

def main():
    """Main startup function"""
    LOG.info("🚀 Flutter Knowledge Sync Startup")
    LOG.info("=" * 50)
    
    # Check if we're in the right directory
    if not Path("main.py").exists():
        LOG.error("Please run this script from the project root directory")
        sys.exit(1)
    
    # Check environment file
    if not check_env_file():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Show database setup instructions
    run_database_setup()
    
    # Ask user what they want to do
    print("\nWhat would you like to do?")
    print("1. Start the API server (for testing endpoints)")
    print("2. Start the background scheduler (for data sync)")
    print("3. Run a one-time sync job")
    print("4. Exit")
    
    choice = input("\nEnter your choice (1-4): ").strip()
    
    if choice == "1":
        start_server()
    elif choice == "2":
        start_scheduler()
    elif choice == "3":
        LOG.info("Running one-time sync job...")
        from main import job
        job()
    elif choice == "4":
        LOG.info("Goodbye!")
    else:
        LOG.error("Invalid choice")

if __name__ == "__main__":
    main()
