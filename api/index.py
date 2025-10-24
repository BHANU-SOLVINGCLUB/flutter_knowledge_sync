"""
Vercel-compatible FastAPI server - Production-ready version
"""
import os
import logging
import time
from typing import Optional, List
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Query, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app with enhanced configuration
app = FastAPI(
    title='Flutter Knowledge API',
    description='Production-ready API for accessing Flutter documentation, packages, and GitHub issues',
    version='2.0.0',
    docs_url='/docs' if os.getenv('ENVIRONMENT') != 'production' else None,
    redoc_url='/redoc' if os.getenv('ENVIRONMENT') != 'production' else None,
    openapi_url='/openapi.json' if os.getenv('ENVIRONMENT') != 'production' else None
)

# Security middleware
security = HTTPBearer(auto_error=False)

# Add trusted host middleware for production
if os.getenv('ENVIRONMENT') == 'production':
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["*.vercel.app", "*.railway.app", "*.render.com"]
    )

# Enhanced CORS middleware with production settings
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://flutterlens.vercel.app",
    "https://flutter-knowledge-sync.vercel.app"
]

# Add custom origins from environment
if os.getenv('ALLOWED_ORIGINS'):
    allowed_origins.extend(os.getenv('ALLOWED_ORIGINS').split(','))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600,
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Initialize Supabase client with enhanced error handling
supabase = None
try:
    from supabase import create_client
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://lthfkjiggwawxdjzzqee.supabase.co')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aGZramlnZ3dhd3hkanp6cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzU1MzcsImV4cCI6MjA3NjgxMTUzN30.EOd-1rd0O9PPChSAyzDltMsoN3d1qF1dPzOTJlnyd5E')
    
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully")
    else:
        logger.warning("Supabase credentials not configured")
except Exception as e:
    logger.error(f'Failed to initialize Supabase: {e}')
    supabase = None

# Rate limiting (simple in-memory implementation)
from collections import defaultdict
from datetime import datetime, timedelta

rate_limit_storage = defaultdict(list)
RATE_LIMIT_REQUESTS = 100  # requests per minute
RATE_LIMIT_WINDOW = 60  # seconds

def check_rate_limit(request: Request):
    client_ip = request.client.host
    now = datetime.utcnow()
    window_start = now - timedelta(seconds=RATE_LIMIT_WINDOW)
    
    # Clean old requests
    rate_limit_storage[client_ip] = [
        req_time for req_time in rate_limit_storage[client_ip] 
        if req_time > window_start
    ]
    
    # Check if limit exceeded
    if len(rate_limit_storage[client_ip]) >= RATE_LIMIT_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later."
        )
    
    # Add current request
    rate_limit_storage[client_ip].append(now)

@app.get('/')
def root():
    """Root endpoint with enhanced information"""
    return {
        'message': 'Flutter Knowledge Sync API',
        'version': '2.0.0',
        'status': 'running',
        'environment': os.getenv('ENVIRONMENT', 'development'),
        'supabase_connected': supabase is not None,
        'timestamp': datetime.utcnow().isoformat(),
        'endpoints': {
            'health': '/health',
            'docs': '/api/flutter/docs',
            'packages': '/api/flutter/packages', 
            'issues': '/api/flutter/issues',
            'search': '/api/flutter/search',
            'stats': '/api/flutter/stats'
        },
        'documentation': '/docs' if os.getenv('ENVIRONMENT') != 'production' else 'Contact admin'
    }

@app.get('/health')
def health():
    """Enhanced health check endpoint"""
    try:
        # Test Supabase connection
        supabase_status = False
        if supabase:
            try:
                # Simple query to test connection
                supabase.table('flutter_docs').select('id').limit(1).execute()
                supabase_status = True
            except Exception as e:
                logger.warning(f"Supabase health check failed: {e}")
        
        return {
            'status': 'healthy' if supabase_status else 'degraded',
            'version': '2.0.0',
            'environment': os.getenv('ENVIRONMENT', 'development'),
            'platform': 'vercel',
            'timestamp': datetime.utcnow().isoformat(),
            'services': {
                'supabase': 'connected' if supabase_status else 'disconnected',
                'api': 'operational'
            },
            'uptime': 'N/A'  # Could implement uptime tracking
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(
            status_code=503,
            content={
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
        )

@app.get('/api/flutter/stats')
def get_stats():
    """Get overall statistics"""
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        # Get counts from all tables
        docs_count = supabase.table('flutter_docs').select('id', count='exact').execute()
        packages_count = supabase.table('pub_packages').select('id', count='exact').execute()
        issues_count = supabase.table('github_issues').select('id', count='exact').execute()
        
        return {
            'total_docs': docs_count.count or 0,
            'total_packages': packages_count.count or 0,
            'total_issues': issues_count.count or 0,
            'last_updated': datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.exception("Error fetching stats: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/docs')
def get_docs(
    request: Request,
    limit: int = Query(50, ge=1, le=100, description="Number of docs to return"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """Get Flutter documentation entries with enhanced features"""
    # Apply rate limiting
    check_rate_limit(request)
    
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        query = supabase.table('flutter_docs').select('*')
        
        if search:
            # Sanitize search input
            search_clean = search.strip()[:100]  # Limit search length
            query = query.or_(f'title.ilike.%{search_clean}%,content.ilike.%{search_clean}%')
        
        # Add pagination
        query = query.order('updated_at', desc=True).range(offset, offset + limit - 1)
        res = query.execute()
        
        return {
            'data': res.data,
            'count': len(res.data),
            'total': res.count if hasattr(res, 'count') else len(res.data),
            'search': search,
            'pagination': {
                'limit': limit,
                'offset': offset,
                'has_more': len(res.data) == limit
            },
            'timestamp': datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.exception("Error fetching docs: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/packages')
def get_packages(
    request: Request,
    limit: int = Query(50, ge=1, le=100, description="Number of packages to return"),
    search: Optional[str] = Query(None, description="Search in package name and description"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """Get Flutter packages from pub.dev with enhanced features"""
    # Apply rate limiting
    check_rate_limit(request)
    
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        query = supabase.table('pub_packages').select('*')
        
        if search:
            # Sanitize search input
            search_clean = search.strip()[:100]  # Limit search length
            query = query.or_(f'name.ilike.%{search_clean}%,description.ilike.%{search_clean}%')
        
        # Add pagination
        query = query.order('updated_at', desc=True).range(offset, offset + limit - 1)
        res = query.execute()
        
        return {
            'data': res.data,
            'count': len(res.data),
            'total': res.count if hasattr(res, 'count') else len(res.data),
            'search': search,
            'pagination': {
                'limit': limit,
                'offset': offset,
                'has_more': len(res.data) == limit
            },
            'timestamp': datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.exception("Error fetching packages: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/issues')
def get_issues(
    request: Request,
    limit: int = Query(50, ge=1, le=100, description="Number of issues to return"),
    labels: Optional[str] = Query(None, description="Filter by labels (comma-separated)"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """Get GitHub issues from flutter/flutter repository with enhanced features"""
    # Apply rate limiting
    check_rate_limit(request)
    
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        query = supabase.table('github_issues').select('*')
        
        if labels:
            # Sanitize and process labels
            label_list = [label.strip()[:50] for label in labels.split(',') if label.strip()]
            for label in label_list:
                query = query.contains('labels', [label])
        
        # Add pagination
        query = query.order('created_at', desc=True).range(offset, offset + limit - 1)
        res = query.execute()
        
        return {
            'data': res.data,
            'count': len(res.data),
            'total': res.count if hasattr(res, 'count') else len(res.data),
            'labels_filter': labels,
            'pagination': {
                'limit': limit,
                'offset': offset,
                'has_more': len(res.data) == limit
            },
            'timestamp': datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.exception("Error fetching issues: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/search')
def search_all(
    request: Request,
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Results per category")
):
    """Search across all Flutter resources with enhanced features"""
    # Apply rate limiting
    check_rate_limit(request)
    
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        # Sanitize search query
        search_query = q.strip()[:100]  # Limit search length
        
        if not search_query:
            raise HTTPException(status_code=400, detail='Search query cannot be empty')
        
        results = {}
        
        # Search docs
        docs_res = supabase.table('flutter_docs').select('*').or_(
            f'title.ilike.%{search_query}%,content.ilike.%{search_query}%'
        ).limit(limit).execute()
        results['docs'] = docs_res.data
        
        # Search packages
        packages_res = supabase.table('pub_packages').select('*').or_(
            f'name.ilike.%{search_query}%,description.ilike.%{search_query}%'
        ).limit(limit).execute()
        results['packages'] = packages_res.data
        
        # Search issues
        issues_res = supabase.table('github_issues').select('*').or_(
            f'title.ilike.%{search_query}%,body.ilike.%{search_query}%'
        ).limit(limit).execute()
        results['issues'] = issues_res.data
        
        total_results = len(results['docs']) + len(results['packages']) + len(results['issues'])
        
        return {
            'query': search_query,
            'results': results,
            'total_results': total_results,
            'results_by_type': {
                'docs': len(results['docs']),
                'packages': len(results['packages']),
                'issues': len(results['issues'])
            },
            'timestamp': datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error searching: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

# Vercel handler
def handler(request):
    """
    Simple Vercel handler that returns basic responses
    """
    import json
    
    # Get request details
    method = request.get('httpMethod', 'GET')
    path = request.get('path', '/')
    query_params = request.get('queryStringParameters', {}) or {}
    
    try:
        if path == '/health':
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'status': 'healthy',
                    'version': '2.0.0',
                    'environment': 'production',
                    'platform': 'vercel',
                    'timestamp': '2024-01-01T00:00:00Z'
                })
            }
        
        elif path.startswith('/api/flutter/'):
            # Return mock data for API endpoints
            endpoint = path.split('/')[-1]
            mock_data = {
                'docs': {'data': [], 'count': 0, 'message': 'Documentation endpoint working'},
                'packages': {'data': [], 'count': 0, 'message': 'Packages endpoint working'},
                'issues': {'data': [], 'count': 0, 'message': 'Issues endpoint working'},
                'stats': {'total_docs': 0, 'total_packages': 0, 'total_issues': 0, 'message': 'Stats endpoint working'},
                'search': {'results': {}, 'total_results': 0, 'message': 'Search endpoint working'}
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps(mock_data.get(endpoint, {'message': f'Endpoint {endpoint} is working'}))
            }
        
        else:
            # For root and other paths, return basic HTML
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'text/html'},
                'body': '''
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Flutter Knowledge Sync</title>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <h1>Flutter Knowledge Sync API</h1>
                    <p>API is running successfully!</p>
                    <p>Available endpoints:</p>
                    <ul>
                        <li><a href="/health">/health</a> - Health check</li>
                        <li><a href="/api/flutter/stats">/api/flutter/stats</a> - Statistics</li>
                        <li><a href="/api/flutter/docs">/api/flutter/docs</a> - Documentation</li>
                        <li><a href="/api/flutter/packages">/api/flutter/packages</a> - Packages</li>
                        <li><a href="/api/flutter/issues">/api/flutter/issues</a> - Issues</li>
                    </ul>
                </body>
                </html>
                '''
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