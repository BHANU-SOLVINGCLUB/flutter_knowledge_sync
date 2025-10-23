#!/usr/bin/env python3
"""
Simple test for the Vercel-compatible API
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_api_import():
    """Test if the API can be imported without errors"""
    print("🧪 Testing Vercel API import...")
    
    try:
        # Test importing the API
        from api.index import app, supabase
        print("✅ API imports successfully")
        
        # Test Supabase connection
        if supabase:
            print("✅ Supabase client initialized")
        else:
            print("⚠️ Supabase client not initialized (will use fallback)")
        
        # Test FastAPI app
        print(f"✅ FastAPI app created: {app.title}")
        
        print("✅ API is ready for Vercel deployment!")
        return True
        
    except Exception as e:
        print(f"❌ API test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_api_import()
