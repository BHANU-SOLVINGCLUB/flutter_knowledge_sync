"""
Ultra-simple Vercel handler for testing
"""

def handler(request):
    """
    Minimal Vercel handler
    """
    import json
    from datetime import datetime
    
    # Get request details
    method = request.get('httpMethod', 'GET')
    path = request.get('path', '/')
    query_params = request.get('queryStringParameters', {}) or {}
    
    # Simple routing
    if path == '/health':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'status': 'healthy',
                'version': '1.0.0',
                'timestamp': datetime.utcnow().isoformat(),
                'path': path,
                'method': method
            })
        }
    
    elif path.startswith('/api/'):
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'API endpoint working',
                'path': path,
                'method': method,
                'query_params': query_params,
                'timestamp': datetime.utcnow().isoformat()
            })
        }
    
    else:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'text/html'},
            'body': f'''
            <!DOCTYPE html>
            <html>
            <head>
                <title>Flutter Knowledge Sync</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {{ font-family: Arial, sans-serif; margin: 40px; }}
                    .container {{ max-width: 800px; margin: 0 auto; }}
                    .endpoint {{ background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 Flutter Knowledge Sync</h1>
                    <p>Welcome to the Flutter Knowledge Sync API!</p>
                    
                    <h2>Available Endpoints:</h2>
                    <div class="endpoint">
                        <strong>GET /health</strong> - Health check endpoint
                    </div>
                    <div class="endpoint">
                        <strong>GET /api/flutter/stats</strong> - Get statistics
                    </div>
                    <div class="endpoint">
                        <strong>GET /api/flutter/docs</strong> - Get documentation
                    </div>
                    <div class="endpoint">
                        <strong>GET /api/flutter/packages</strong> - Get packages
                    </div>
                    <div class="endpoint">
                        <strong>GET /api/flutter/issues</strong> - Get GitHub issues
                    </div>
                    
                    <h2>Request Info:</h2>
                    <p><strong>Path:</strong> {path}</p>
                    <p><strong>Method:</strong> {method}</p>
                    <p><strong>Timestamp:</strong> {datetime.utcnow().isoformat()}</p>
                </div>
            </body>
            </html>
            '''
        }
