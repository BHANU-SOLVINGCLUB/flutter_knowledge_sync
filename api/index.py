"""
Vercel-compatible FastAPI server
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os, logging
from typing import Optional

# Import Supabase client with environment variables
try:
    from supabase import create_client
    SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://lthfkjiggwawxdjzzqee.supabase.co')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aGZramlnZ3dhd3hkanp6cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzU1MzcsImV4cCI6MjA3NjgxMTUzN30.EOd-1rd0O9PPChSAyzDltMsoN3d1qF1dPzOTJlnyd5E')
    
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    else:
        supabase = None
        logging.warning('Supabase credentials not configured')
except Exception as e:
    supabase = None
    logging.error(f'Failed to initialize Supabase: {e}')

LOG = logging.getLogger(__name__)
app = FastAPI(
    title='Flutter Knowledge API',
    description='API for accessing Flutter documentation, packages, and GitHub issues',
    version='1.0.0'
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
def health():
    """Health check endpoint"""
    return {
        'status': 'ok',
        'supabase_configured': supabase is not None,
        'version': '1.0.0',
        'platform': 'vercel'
    }

@app.get('/api/flutter/docs')
def get_docs(
    limit: int = Query(50, ge=1, le=100, description="Number of docs to return"),
    search: Optional[str] = Query(None, description="Search in title and content")
):
    """Get Flutter documentation entries"""
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        query = supabase.table('flutter_docs').select('*')
        
        if search:
            query = query.or_(f'title.ilike.%{search}%,content.ilike.%{search}%')
        
        res = query.order('updated_at', desc=True).limit(limit).execute()
        return {
            'data': res.data,
            'count': len(res.data),
            'search': search
        }
    except Exception as e:
        LOG.exception("Error fetching docs: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/issues')
def get_issues(
    limit: int = Query(50, ge=1, le=100, description="Number of issues to return"),
    labels: Optional[str] = Query(None, description="Filter by labels (comma-separated)")
):
    """Get GitHub issues from flutter/flutter repository"""
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        query = supabase.table('github_issues').select('*')
        
        if labels:
            label_list = [label.strip() for label in labels.split(',')]
            for label in label_list:
                query = query.contains('labels', [label])
        
        res = query.order('created_at', desc=True).limit(limit).execute()
        return {
            'data': res.data,
            'count': len(res.data),
            'labels_filter': labels
        }
    except Exception as e:
        LOG.exception("Error fetching issues: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/packages')
def get_packages(
    limit: int = Query(50, ge=1, le=100, description="Number of packages to return"),
    search: Optional[str] = Query(None, description="Search in package name and description")
):
    """Get Flutter packages from pub.dev"""
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        query = supabase.table('pub_packages').select('*')
        
        if search:
            query = query.or_(f'name.ilike.%{search}%,description.ilike.%{search}%')
        
        res = query.order('updated_at', desc=True).limit(limit).execute()
        return {
            'data': res.data,
            'count': len(res.data),
            'search': search
        }
    except Exception as e:
        LOG.exception("Error fetching packages: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

@app.get('/api/flutter/search')
def search_all(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Results per category")
):
    """Search across all Flutter resources"""
    if supabase is None:
        raise HTTPException(status_code=503, detail='Supabase not configured')
    
    try:
        results = {}
        
        # Search docs
        docs_res = supabase.table('flutter_docs').select('*').or_(
            f'title.ilike.%{q}%,content.ilike.%{q}%'
        ).limit(limit).execute()
        results['docs'] = docs_res.data
        
        # Search packages
        packages_res = supabase.table('pub_packages').select('*').or_(
            f'name.ilike.%{q}%,description.ilike.%{q}%'
        ).limit(limit).execute()
        results['packages'] = packages_res.data
        
        # Search issues
        issues_res = supabase.table('github_issues').select('*').or_(
            f'title.ilike.%{q}%,body.ilike.%{q}%'
        ).limit(limit).execute()
        results['issues'] = issues_res.data
        
        return {
            'query': q,
            'results': results,
            'total_results': len(results['docs']) + len(results['packages']) + len(results['issues'])
        }
    except Exception as e:
        LOG.exception("Error searching: %s", e)
        raise HTTPException(status_code=500, detail='Internal server error')

# Vercel handler
def handler(request):
    return app
