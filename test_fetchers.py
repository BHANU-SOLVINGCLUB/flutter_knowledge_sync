#!/usr/bin/env python3
"""
Test the data fetchers
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fetch.flutter_docs import update_flutter_docs
from fetch.pub_dev import update_pubdev
from fetch.github_issues import update_github_issues
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_fetchers():
    """Test all data fetchers"""
    LOG.info("Testing data fetchers...")
    
    # Test Flutter docs fetcher
    LOG.info("Testing Flutter docs fetcher...")
    try:
        docs = update_flutter_docs()
        LOG.info(f"✅ Flutter docs: {len(docs)} docs fetched")
        if docs:
            LOG.info(f"   First doc: {docs[0]['title']}")
    except Exception as e:
        LOG.error(f"❌ Flutter docs failed: {e}")
    
    # Test pub.dev fetcher
    LOG.info("Testing pub.dev fetcher...")
    try:
        packages = update_pubdev()
        LOG.info(f"✅ Pub.dev packages: {len(packages)} packages fetched")
        if packages:
            LOG.info(f"   First package: {packages[0]['name']}")
    except Exception as e:
        LOG.error(f"❌ Pub.dev failed: {e}")
    
    # Test GitHub issues fetcher
    LOG.info("Testing GitHub issues fetcher...")
    try:
        issues = update_github_issues()
        LOG.info(f"✅ GitHub issues: {len(issues)} issues fetched")
        if issues:
            LOG.info(f"   First issue: {issues[0]['title']}")
    except Exception as e:
        LOG.error(f"❌ GitHub issues failed: {e}")

if __name__ == "__main__":
    test_fetchers()
