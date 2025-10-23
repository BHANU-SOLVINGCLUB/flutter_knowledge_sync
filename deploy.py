#!/usr/bin/env python3
"""
Deployment helper script for Vercel
"""
import os
import subprocess
import sys

def check_vercel_cli():
    """Check if Vercel CLI is installed"""
    try:
        result = subprocess.run(['vercel', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Vercel CLI found: {result.stdout.strip()}")
            return True
        else:
            print("❌ Vercel CLI not found")
            return False
    except FileNotFoundError:
        print("❌ Vercel CLI not installed")
        return False

def install_vercel_cli():
    """Install Vercel CLI"""
    print("📦 Installing Vercel CLI...")
    try:
        subprocess.run(['npm', 'install', '-g', 'vercel'], check=True)
        print("✅ Vercel CLI installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install Vercel CLI")
        return False

def setup_environment():
    """Set up environment variables"""
    print("🔧 Setting up environment variables...")
    
    env_vars = {
        'SUPABASE_URL': 'https://lthfkjiggwawxdjzzqee.supabase.co',
        'SUPABASE_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aGZramlnZ3dhd3hkanp6cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzU1MzcsImV4cCI6MjA3NjgxMTUzN30.EOd-1rd0O9PPChSAyzDltMsoN3d1qF1dPzOTJlnyd5E',
        'GEMINI_API_KEY': 'AIzaSyBrIL4wjKOD11AZFlP_Rz3QwwjvVqTzvio',
        'GITHUB_TOKEN': '',
        'SYNC_INTERVAL_MINUTES': '360'
    }
    
    print("Environment variables to set in Vercel:")
    for key, value in env_vars.items():
        if value:
            print(f"  {key}: {value}")
        else:
            print(f"  {key}: (optional - leave empty)")

def main():
    """Main deployment function"""
    print("🚀 Flutter Knowledge Sync - Vercel Deployment Helper")
    print("=" * 60)
    
    # Check Vercel CLI
    if not check_vercel_cli():
        print("\n📦 Installing Vercel CLI...")
        if not install_vercel_cli():
            print("\n❌ Please install Vercel CLI manually:")
            print("   npm install -g vercel")
            return
    
    # Setup environment
    setup_environment()
    
    print("\n🎯 Next Steps:")
    print("1. Run: vercel login")
    print("2. Run: vercel init")
    print("3. Set environment variables in Vercel dashboard")
    print("4. Run: vercel --prod")
    
    print("\n📝 Files created for deployment:")
    print("  ✅ vercel.json - Vercel configuration")
    print("  ✅ requirements-vercel.txt - Python dependencies")
    print("  ✅ api/index.py - Vercel-compatible server")
    
    print("\n🔗 After deployment, your app will be available at:")
    print("   https://your-project-name.vercel.app")

if __name__ == "__main__":
    main()
