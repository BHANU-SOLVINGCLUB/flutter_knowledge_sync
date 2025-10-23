#!/usr/bin/env python3
"""
Test the full sync process and create tables by inserting data
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fetch.flutter_docs import update_flutter_docs
from fetch.pub_dev import update_pubdev
from fetch.github_issues import update_github_issues
from storage.supabase_client import push_to_supabase
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_full_sync():
    """Test the complete sync process"""
    LOG.info("🚀 Testing full sync process...")
    
    try:
        # Fetch data
        LOG.info("Fetching Flutter docs...")
        docs = update_flutter_docs()
        LOG.info(f"Fetched {len(docs)} Flutter docs")
        
        LOG.info("Fetching pub.dev packages...")
        packages = update_pubdev()
        LOG.info(f"Fetched {len(packages)} packages")
        
        LOG.info("Fetching GitHub issues...")
        issues = update_github_issues()
        LOG.info(f"Fetched {len(issues)} issues")
        
        # Push to Supabase (this will create tables if they don't exist)
        if docs:
            LOG.info("Pushing Flutter docs to Supabase...")
            push_to_supabase("flutter_docs", docs)
            LOG.info("✅ Flutter docs pushed successfully")
        
        if packages:
            LOG.info("Pushing packages to Supabase...")
            push_to_supabase("pub_packages", packages)
            LOG.info("✅ Packages pushed successfully")
        
        if issues:
            LOG.info("Pushing issues to Supabase...")
            push_to_supabase("github_issues", issues)
            LOG.info("✅ Issues pushed successfully")
        
        LOG.info("🎉 Full sync completed successfully!")
        
    except Exception as e:
        LOG.exception("❌ Sync failed: %s", e)

if __name__ == "__main__":
    test_full_sync()
