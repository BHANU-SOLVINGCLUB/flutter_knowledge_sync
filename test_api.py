#!/usr/bin/env python3
"""
Test the API endpoints
"""
import requests
import json

def test_api():
    print('🚀 Testing Flutter Knowledge Sync API')
    print('=' * 50)

    # Test health endpoint
    print('\n1. Testing health endpoint...')
    try:
        response = requests.get('http://localhost:8000/health')
        print(f'   Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'   ✅ Health check passed: {data}')
        else:
            print(f'   ❌ Health check failed: {response.text}')
    except Exception as e:
        print(f'   ❌ Error: {e}')

    # Test docs endpoint
    print('\n2. Testing Flutter docs endpoint...')
    try:
        response = requests.get('http://localhost:8000/api/flutter/docs?limit=3')
        print(f'   Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'   ✅ Found {data["count"]} docs')
            if data['data']:
                print(f'   📄 First doc: {data["data"][0]["title"]}')
        else:
            print(f'   ❌ Docs endpoint failed: {response.text}')
    except Exception as e:
        print(f'   ❌ Error: {e}')

    # Test packages endpoint
    print('\n3. Testing packages endpoint...')
    try:
        response = requests.get('http://localhost:8000/api/flutter/packages?limit=3')
        print(f'   Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'   ✅ Found {data["count"]} packages')
            if data['data']:
                print(f'   📦 First package: {data["data"][0]["name"]}')
        else:
            print(f'   ❌ Packages endpoint failed: {response.text}')
    except Exception as e:
        print(f'   ❌ Error: {e}')

    # Test search endpoint
    print('\n4. Testing search endpoint...')
    try:
        response = requests.get('http://localhost:8000/api/flutter/search?q=widget&limit=2')
        print(f'   Status: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            print(f'   ✅ Search for "widget" found {data["total_results"]} total results')
            if data['results']['docs']:
                print(f'   📄 Docs: {len(data["results"]["docs"])} results')
            if data['results']['packages']:
                print(f'   📦 Packages: {len(data["results"]["packages"])} results')
        else:
            print(f'   ❌ Search endpoint failed: {response.text}')
    except Exception as e:
        print(f'   ❌ Error: {e}')

    print('\n🎉 API testing completed!')

if __name__ == "__main__":
    test_api()
