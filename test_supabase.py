#!/usr/bin/env python3
"""
Simple test script to verify Supabase connection
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from storage.supabase_client import supabase
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def test_supabase():
    """Test Supabase connection"""
    LOG.info("Testing Supabase connection...")
    
    if supabase is None:
        LOG.error("❌ Supabase client is None")
        return False
    
    try:
        # Test connection by querying a table (this will fail if table doesn't exist, but connection will work)
        result = supabase.table('flutter_docs').select('*').limit(1).execute()
        LOG.info("✅ Supabase connection successful!")
        LOG.info(f"Query result: {result}")
        return True
    except Exception as e:
        if "relation" in str(e).lower() and "does not exist" in str(e).lower():
            LOG.info("✅ Supabase connection successful! (Tables don't exist yet, which is expected)")
            return True
        else:
            LOG.error(f"❌ Supabase connection failed: {e}")
            return False

if __name__ == "__main__":
    test_supabase()
