#!/usr/bin/env python3
"""
Health Check Script for Flutter Knowledge Sync
Monitors the health of the application and its dependencies
"""

import os
import sys
import requests
import time
import json
from datetime import datetime
from typing import Dict, Any

def check_api_health(base_url: str) -> Dict[str, Any]:
    """Check API health endpoint"""
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            return {
                'status': 'healthy',
                'response_time': response.elapsed.total_seconds(),
                'data': data
            }
        else:
            return {
                'status': 'unhealthy',
                'response_time': response.elapsed.total_seconds(),
                'error': f"HTTP {response.status_code}"
            }
    except requests.exceptions.RequestException as e:
        return {
            'status': 'unhealthy',
            'response_time': None,
            'error': str(e)
        }

def check_database_connection(base_url: str) -> Dict[str, Any]:
    """Check database connection through stats endpoint"""
    try:
        response = requests.get(f"{base_url}/api/flutter/stats", timeout=10)
        if response.status_code == 200:
            return {
                'status': 'healthy',
                'response_time': response.elapsed.total_seconds(),
                'data': response.json()
            }
        else:
            return {
                'status': 'unhealthy',
                'response_time': response.elapsed.total_seconds(),
                'error': f"HTTP {response.status_code}"
            }
    except requests.exceptions.RequestException as e:
        return {
            'status': 'unhealthy',
            'response_time': None,
            'error': str(e)
        }

def check_data_endpoints(base_url: str) -> Dict[str, Any]:
    """Check if data endpoints are working"""
    endpoints = [
        '/api/flutter/docs',
        '/api/flutter/packages',
        '/api/flutter/issues'
    ]
    
    results = {}
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", params={'limit': 1}, timeout=10)
            results[endpoint] = {
                'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                'response_time': response.elapsed.total_seconds(),
                'status_code': response.status_code
            }
        except requests.exceptions.RequestException as e:
            results[endpoint] = {
                'status': 'unhealthy',
                'response_time': None,
                'error': str(e)
            }
    
    return results

def main():
    """Main health check function"""
    base_url = os.getenv('API_BASE_URL', 'http://localhost:8000')
    
    print(f"Health Check for Flutter Knowledge Sync")
    print(f"API URL: {base_url}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 50)
    
    # Check API health
    print("Checking API Health...")
    api_health = check_api_health(base_url)
    print(f"API Status: {api_health['status']}")
    if api_health['response_time']:
        print(f"Response Time: {api_health['response_time']:.2f}s")
    if api_health.get('error'):
        print(f"Error: {api_health['error']}")
    print()
    
    # Check database connection
    print("Checking Database Connection...")
    db_health = check_database_connection(base_url)
    print(f"Database Status: {db_health['status']}")
    if db_health['response_time']:
        print(f"Response Time: {db_health['response_time']:.2f}s")
    if db_health.get('error'):
        print(f"Error: {db_health['error']}")
    print()
    
    # Check data endpoints
    print("Checking Data Endpoints...")
    endpoint_health = check_data_endpoints(base_url)
    for endpoint, health in endpoint_health.items():
        print(f"{endpoint}: {health['status']}")
        if health['response_time']:
            print(f"  Response Time: {health['response_time']:.2f}s")
        if health.get('error'):
            print(f"  Error: {health['error']}")
    print()
    
    # Overall status
    all_healthy = (
        api_health['status'] == 'healthy' and
        db_health['status'] == 'healthy' and
        all(h['status'] == 'healthy' for h in endpoint_health.values())
    )
    
    if all_healthy:
        print("✅ All systems healthy!")
        sys.exit(0)
    else:
        print("❌ Some systems are unhealthy!")
        sys.exit(1)

if __name__ == "__main__":
    main()
