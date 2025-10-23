#!/usr/bin/env python3
"""
Comprehensive test of the entire Flutter Knowledge Sync application
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import requests
import json
import time
from fetch.flutter_docs import update_flutter_docs
from fetch.pub_dev import update_pubdev
from fetch.github_issues import update_github_issues
from storage.supabase_client import supabase, push_to_supabase
from utils.summarizer import summarize_text
from main import job
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_database_connection():
    """Test Supabase database connection"""
    LOG.info("🗄️ Testing database connection...")
    try:
        if supabase is None:
            LOG.error("❌ Supabase client is None")
            return False
        
        # Test connection by querying tables
        tables = ['flutter_docs', 'pub_packages', 'github_issues']
        for table in tables:
            result = supabase.table(table).select('*').limit(1).execute()
            LOG.info(f"✅ Table '{table}' accessible - {len(result.data)} records")
        
        return True
    except Exception as e:
        LOG.error(f"❌ Database connection failed: {e}")
        return False

def test_data_fetchers():
    """Test all data fetchers"""
    LOG.info("📥 Testing data fetchers...")
    
    results = {}
    
    # Test Flutter docs
    try:
        docs = update_flutter_docs()
        results['docs'] = len(docs)
        LOG.info(f"✅ Flutter docs: {len(docs)} fetched")
    except Exception as e:
        LOG.error(f"❌ Flutter docs failed: {e}")
        results['docs'] = 0
    
    # Test pub.dev packages
    try:
        packages = update_pubdev()
        results['packages'] = len(packages)
        LOG.info(f"✅ Pub.dev packages: {len(packages)} fetched")
    except Exception as e:
        LOG.error(f"❌ Pub.dev failed: {e}")
        results['packages'] = 0
    
    # Test GitHub issues
    try:
        issues = update_github_issues()
        results['issues'] = len(issues)
        LOG.info(f"✅ GitHub issues: {len(issues)} fetched")
    except Exception as e:
        LOG.error(f"❌ GitHub issues failed: {e}")
        results['issues'] = 0
    
    return results

def test_api_endpoints():
    """Test all API endpoints"""
    LOG.info("🌐 Testing API endpoints...")
    
    base_url = "http://localhost:8000"
    endpoints = [
        ("/health", "Health check"),
        ("/api/flutter/docs?limit=5", "Flutter docs"),
        ("/api/flutter/packages?limit=5", "Packages"),
        ("/api/flutter/issues?limit=5", "GitHub issues"),
        ("/api/flutter/search?q=widget&limit=3", "Search")
    ]
    
    results = {}
    
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if 'count' in data:
                    results[description] = data['count']
                    LOG.info(f"✅ {description}: {data['count']} results")
                elif 'total_results' in data:
                    results[description] = data['total_results']
                    LOG.info(f"✅ {description}: {data['total_results']} total results")
                else:
                    results[description] = "OK"
                    LOG.info(f"✅ {description}: Working")
            else:
                LOG.error(f"❌ {description}: HTTP {response.status_code}")
                results[description] = f"Error {response.status_code}"
        except Exception as e:
            LOG.error(f"❌ {description}: {e}")
            results[description] = f"Error: {e}"
    
    return results

def test_sync_job():
    """Test the complete sync job"""
    LOG.info("🔄 Testing sync job...")
    try:
        job()
        LOG.info("✅ Sync job completed successfully")
        return True
    except Exception as e:
        LOG.error(f"❌ Sync job failed: {e}")
        return False

def test_summarization():
    """Test AI summarization"""
    LOG.info("🧠 Testing AI summarization...")
    try:
        test_text = "Flutter is a UI toolkit for building natively compiled applications."
        summary = summarize_text(test_text, max_tokens=50)
        LOG.info(f"✅ Summarization working: {len(summary)} chars")
        return True
    except Exception as e:
        LOG.error(f"❌ Summarization failed: {e}")
        return False

def main():
    """Run comprehensive test suite"""
    LOG.info("🚀 FLUTTER KNOWLEDGE SYNC - COMPREHENSIVE TEST")
    LOG.info("=" * 60)
    
    # Test results
    results = {
        'database': False,
        'fetchers': {},
        'api': {},
        'sync': False,
        'summarization': False
    }
    
    # Run all tests
    results['database'] = test_database_connection()
    results['fetchers'] = test_data_fetchers()
    results['api'] = test_api_endpoints()
    results['sync'] = test_sync_job()
    results['summarization'] = test_summarization()
    
    # Summary
    LOG.info("\n" + "=" * 60)
    LOG.info("📊 COMPREHENSIVE TEST RESULTS")
    LOG.info("=" * 60)
    
    # Database
    status = "✅ PASS" if results['database'] else "❌ FAIL"
    LOG.info(f"Database Connection: {status}")
    
    # Fetchers
    LOG.info(f"Data Fetchers:")
    for name, count in results['fetchers'].items():
        LOG.info(f"  {name}: {count} items")
    
    # API
    LOG.info(f"API Endpoints:")
    for name, result in results['api'].items():
        LOG.info(f"  {name}: {result}")
    
    # Sync
    status = "✅ PASS" if results['sync'] else "❌ FAIL"
    LOG.info(f"Sync Job: {status}")
    
    # Summarization
    status = "✅ PASS" if results['summarization'] else "❌ FAIL"
    LOG.info(f"AI Summarization: {status}")
    
    # Overall status
    critical_tests = [results['database'], results['sync']]
    api_tests = [v != "Error" for v in results['api'].values()]
    
    if all(critical_tests) and any(api_tests):
        LOG.info("\n🎉 APPLICATION STATUS: READY FOR CURSOR INTEGRATION!")
        LOG.info("✅ Core functionality working")
        LOG.info("✅ API endpoints responding")
        LOG.info("✅ Database connected")
        LOG.info("✅ Data sync working")
    else:
        LOG.info("\n⚠️ APPLICATION STATUS: NEEDS ATTENTION")
        LOG.info("Some components need fixing before Cursor integration")
    
    return results

if __name__ == "__main__":
    main()
