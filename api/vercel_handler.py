"""
Simplified Vercel handler for the Flutter Knowledge API
"""
import os
import sys
import json
from typing import Dict, Any

# Add the parent directory to the path so we can import from api
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def handler(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Vercel serverless function handler
    """
    try:
        # Import the FastAPI app
        from api.index import app
        
        # Get the request details
        method = request.get('httpMethod', 'GET')
        path = request.get('path', '/')
        headers = request.get('headers', {})
        body = request.get('body', '')
        query_params = request.get('queryStringParameters', {}) or {}
        
        # Create a mock request object
        class MockRequest:
            def __init__(self, method, path, headers, body, query_params):
                self.method = method
                self.url = f"https://example.com{path}"
                self.path = path
                self.headers = headers
                self.body = body
                self.query_params = query_params
                self.client = type('Client', (), {'host': '127.0.0.1'})()
        
        mock_request = MockRequest(method, path, headers, body, query_params)
        
        # Handle the request based on the path
        if path == '/health':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'status': 'healthy',
                    'version': '2.0.0',
                    'environment': 'production',
                    'platform': 'vercel'
                })
            }
        
        elif path.startswith('/api/flutter/'):
            # For API endpoints, return a simple response
            endpoint = path.split('/')[-1]
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': f'API endpoint {endpoint} is working',
                    'path': path,
                    'method': method,
                    'query_params': query_params
                })
            }
        
        else:
            # For frontend routes, return the index.html
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'text/html'},
                'body': '<html><body><h1>Flutter Knowledge Sync</h1><p>Frontend is loading...</p></body></html>'
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            })
        }
