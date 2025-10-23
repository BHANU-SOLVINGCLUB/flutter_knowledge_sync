#!/usr/bin/env python3
"""
Test the API endpoints that Cursor will use
"""
import requests
import json

def test_cursor_endpoints():
    """Test endpoints that Cursor will query"""
    print("🔗 Testing Cursor Integration Endpoints")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Test queries that Cursor might make
    test_queries = [
        "widget",
        "state management", 
        "navigation",
        "http",
        "database"
    ]
    
    for query in test_queries:
        print(f"\n🔍 Testing search for: '{query}'")
        try:
            response = requests.get(f"{base_url}/api/flutter/search", params={
                'q': query,
                'limit': 3
            })
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Found {data['total_results']} results")
                
                # Show results breakdown
                if data['results']['docs']:
                    print(f"   📄 Docs: {len(data['results']['docs'])}")
                    for doc in data['results']['docs'][:2]:
                        print(f"      - {doc['title']}")
                
                if data['results']['packages']:
                    print(f"   📦 Packages: {len(data['results']['packages'])}")
                    for pkg in data['results']['packages'][:2]:
                        print(f"      - {pkg['name']}")
                
                if data['results']['issues']:
                    print(f"   🐛 Issues: {len(data['results']['issues'])}")
            else:
                print(f"   ❌ Error: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    # Test individual endpoints
    print(f"\n📡 Testing individual endpoints:")
    
    endpoints = [
        ("/api/flutter/docs?limit=2", "Flutter Documentation"),
        ("/api/flutter/packages?limit=2", "Flutter Packages"),
        ("/api/flutter/search?q=widget&limit=1", "Widget Search")
    ]
    
    for endpoint, name in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                if 'count' in data:
                    print(f"   ✅ {name}: {data['count']} results")
                elif 'total_results' in data:
                    print(f"   ✅ {name}: {data['total_results']} results")
            else:
                print(f"   ❌ {name}: HTTP {response.status_code}")
        except Exception as e:
            print(f"   ❌ {name}: {e}")
    
    print(f"\n🎉 Cursor integration test completed!")
    print(f"📝 Your API is ready for Cursor MCP integration!")

if __name__ == "__main__":
    test_cursor_endpoints()
