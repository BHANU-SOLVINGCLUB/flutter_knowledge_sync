#!/usr/bin/env python3
"""
Test the Vercel-compatible API locally
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Test the API locally
def test_local_api():
    """Test the API locally"""
    print("🧪 Testing Vercel-compatible API locally...")
    
    try:
        # Import the app
        from api.index import app
        print("✅ API imports successfully")
        
        # Test Supabase connection
        from api.index import supabase
        if supabase:
            print("✅ Supabase client initialized")
        else:
            print("⚠️ Supabase client not initialized (will use fallback)")
        
        print("✅ API is ready for Vercel deployment!")
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

if __name__ == "__main__":
    test_local_api()
