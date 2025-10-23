#!/usr/bin/env python3
"""
Test the scheduler functionality
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import job
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_scheduler():
    """Test the sync job"""
    LOG.info("🚀 Running one-time sync job...")
    try:
        job()
        LOG.info("✅ Sync job completed successfully!")
    except Exception as e:
        LOG.exception("❌ Sync job failed: %s", e)

if __name__ == "__main__":
    test_scheduler()
