#!/usr/bin/env python3
"""
Test script for Flutter Knowledge Sync
Tests all components of the application
"""
import os
import sys
import requests
import time
import logging
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_imports():
    """Test that all modules can be imported"""
    LOG.info("Testing imports...")
    try:
        from fetch.flutter_docs import update_flutter_docs
        from fetch.pub_dev import update_pubdev
        from fetch.github_issues import update_github_issues
        from storage.supabase_client import supabase, push_to_supabase
        from utils.summarizer import summarize_text
        LOG.info("✅ All imports successful")
        return True
    except Exception as e:
        LOG.error(f"❌ Import failed: {e}")
        return False

def test_fetchers():
    """Test the data fetchers"""
    LOG.info("Testing data fetchers...")
    
    # Test Flutter docs fetcher
    try:
        from fetch.flutter_docs import update_flutter_docs
        docs = update_flutter_docs()
        LOG.info(f"✅ Flutter docs fetcher: {len(docs)} docs fetched")
    except Exception as e:
        LOG.error(f"❌ Flutter docs fetcher failed: {e}")
    
    # Test pub.dev fetcher
    try:
        from fetch.pub_dev import update_pubdev
        packages = update_pubdev()
        LOG.info(f"✅ Pub.dev fetcher: {len(packages)} packages fetched")
    except Exception as e:
        LOG.error(f"❌ Pub.dev fetcher failed: {e}")
    
    # Test GitHub issues fetcher
    try:
        from fetch.github_issues import update_github_issues
        issues = update_github_issues()
        LOG.info(f"✅ GitHub issues fetcher: {len(issues)} issues fetched")
    except Exception as e:
        LOG.error(f"❌ GitHub issues fetcher failed: {e}")

def test_supabase_connection():
    """Test Supabase connection"""
    LOG.info("Testing Supabase connection...")
    try:
        from storage.supabase_client import supabase
        if supabase is None:
            LOG.warning("⚠️ Supabase not configured (check .env file)")
            return False
        
        # Test connection by querying a table
        result = supabase.table('flutter_docs').select('*').limit(1).execute()
        LOG.info("✅ Supabase connection successful")
        return True
    except Exception as e:
        LOG.error(f"❌ Supabase connection failed: {e}")
        return False

def test_api_server():
    """Test the API server endpoints"""
    LOG.info("Testing API server...")
    
    base_url = "http://localhost:8000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            LOG.info("✅ Health endpoint working")
            LOG.info(f"   Response: {response.json()}")
        else:
            LOG.error(f"❌ Health endpoint failed: {response.status_code}")
    except requests.exceptions.ConnectionError:
        LOG.warning("⚠️ API server not running. Start it with: uvicorn api.server:app --reload")
        return False
    except Exception as e:
        LOG.error(f"❌ Health endpoint error: {e}")
        return False
    
    # Test other endpoints
    endpoints = [
        "/api/flutter/docs",
        "/api/flutter/packages", 
        "/api/flutter/issues",
        "/api/flutter/search?q=widget"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict) and 'data' in data:
                    count = data.get('count', len(data.get('data', [])))
                    LOG.info(f"✅ {endpoint}: {count} results")
                else:
                    LOG.info(f"✅ {endpoint}: working")
            else:
                LOG.error(f"❌ {endpoint}: {response.status_code}")
        except Exception as e:
            LOG.error(f"❌ {endpoint}: {e}")
    
    return True

def test_sync_job():
    """Test the complete sync job"""
    LOG.info("Testing sync job...")
    try:
        from main import job
        job()
        LOG.info("✅ Sync job completed successfully")
        return True
    except Exception as e:
        LOG.error(f"❌ Sync job failed: {e}")
        return False

def test_summarizer():
    """Test the OpenAI summarizer"""
    LOG.info("Testing summarizer...")
    try:
        from utils.summarizer import summarize_text
        test_text = "This is a long piece of text that should be summarized by the OpenAI API if configured properly."
        summary = summarize_text(test_text)
        LOG.info(f"✅ Summarizer working: {summary[:100]}...")
        return True
    except Exception as e:
        LOG.error(f"❌ Summarizer failed: {e}")
        return False

def main():
    """Run all tests"""
    LOG.info("🧪 Flutter Knowledge Sync - Test Suite")
    LOG.info("=" * 50)
    
    tests = [
        ("Import Test", test_imports),
        ("Fetchers Test", test_fetchers),
        ("Supabase Connection", test_supabase_connection),
        ("API Server Test", test_api_server),
        ("Sync Job Test", test_sync_job),
        ("Summarizer Test", test_summarizer),
    ]
    
    results = []
    for test_name, test_func in tests:
        LOG.info(f"\n--- {test_name} ---")
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            LOG.error(f"❌ {test_name} crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    LOG.info("\n" + "=" * 50)
    LOG.info("📊 Test Results Summary:")
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        LOG.info(f"  {test_name}: {status}")
        if result:
            passed += 1
    
    LOG.info(f"\nPassed: {passed}/{len(results)} tests")
    
    if passed == len(results):
        LOG.info("🎉 All tests passed! Your app is ready to go!")
    else:
        LOG.info("⚠️ Some tests failed. Check the logs above for details.")

if __name__ == "__main__":
    main()
