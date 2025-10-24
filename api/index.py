"""
Flutter Knowledge Sync API - Production Ready
A clean, modern FastAPI application for Flutter documentation and resources
"""

import os
import json
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Flutter Knowledge Sync API",
    description="A comprehensive API for Flutter documentation, packages, and community resources",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") != "production" else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "https://flutterlens.vercel.app",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mock data for demonstration
MOCK_DATA = {
    "docs": [
        {
            "id": 1,
            "title": "Getting Started with Flutter",
            "content": "Learn how to build your first Flutter app...",
            "url": "https://docs.flutter.dev/get-started/",
            "category": "tutorial",
            "updated_at": "2024-01-15T10:00:00Z"
        },
        {
            "id": 2,
            "title": "Widget Catalog",
            "content": "Comprehensive guide to Flutter widgets...",
            "url": "https://docs.flutter.dev/development/ui/widgets/",
            "category": "reference",
            "updated_at": "2024-01-14T15:30:00Z"
        }
    ],
    "packages": [
        {
            "id": 1,
            "name": "provider",
            "description": "A wrapper around InheritedWidget to make them easier to use and more reusable.",
            "version": "6.1.1",
            "likes": 1234,
            "pub_url": "https://pub.dev/packages/provider",
            "updated_at": "2024-01-15T08:00:00Z"
        },
        {
            "id": 2,
            "name": "http",
            "description": "A composable, multi-platform, Future-based API for HTTP requests.",
            "version": "1.1.0",
            "likes": 5678,
            "pub_url": "https://pub.dev/packages/http",
            "updated_at": "2024-01-14T12:00:00Z"
        }
    ],
    "issues": [
        {
            "id": 1,
            "title": "Performance improvement for large lists",
            "body": "We need to optimize rendering for lists with thousands of items...",
            "labels": ["performance", "enhancement"],
            "state": "open",
            "created_at": "2024-01-15T09:00:00Z",
            "url": "https://github.com/flutter/flutter/issues/12345"
        }
    ]
}

@app.get("/", response_class=HTMLResponse)
async def root():
    """Root endpoint with API information"""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flutter Knowledge Sync API</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #f8fafc; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #1e293b; margin-bottom: 8px; }
            .subtitle { color: #64748b; margin-bottom: 32px; }
            .endpoint { background: #f1f5f9; padding: 16px; margin: 12px 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
            .method { background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .path { font-family: 'Monaco', 'Menlo', monospace; color: #1e293b; }
            .description { color: #64748b; margin-top: 8px; }
            .status { display: inline-block; background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px; margin-bottom: 24px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="status">🟢 API Online</div>
            <h1>Flutter Knowledge Sync API</h1>
            <p class="subtitle">Comprehensive API for Flutter documentation, packages, and community resources</p>
            
            <h2>Available Endpoints</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="path">/health</span>
                <div class="description">Health check endpoint</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="path">/api/flutter/docs</span>
                <div class="description">Get Flutter documentation entries</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="path">/api/flutter/packages</span>
                <div class="description">Get Flutter packages from pub.dev</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="path">/api/flutter/issues</span>
                <div class="description">Get GitHub issues from flutter/flutter</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="path">/api/flutter/stats</span>
                <div class="description">Get overall statistics</div>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <span class="path">/api/flutter/search</span>
                <div class="description">Search across all Flutter resources</div>
            </div>
        </div>
    </body>
    </html>
    """

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "platform": "vercel"
    }

@app.get("/api/flutter/docs")
async def get_docs(
    limit: int = Query(50, ge=1, le=100, description="Number of docs to return"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """Get Flutter documentation entries"""
    docs = MOCK_DATA["docs"]
    
    # Apply search filter
    if search:
        search_lower = search.lower()
        docs = [doc for doc in docs if search_lower in doc["title"].lower() or search_lower in doc["content"].lower()]
    
    # Apply pagination
    total = len(docs)
    docs = docs[offset:offset + limit]
    
    return {
        "data": docs,
        "count": len(docs),
        "total": total,
        "search": search,
        "pagination": {
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/flutter/packages")
async def get_packages(
    limit: int = Query(50, ge=1, le=100, description="Number of packages to return"),
    search: Optional[str] = Query(None, description="Search in package name and description"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """Get Flutter packages from pub.dev"""
    packages = MOCK_DATA["packages"]
    
    # Apply search filter
    if search:
        search_lower = search.lower()
        packages = [pkg for pkg in packages if search_lower in pkg["name"].lower() or search_lower in pkg["description"].lower()]
    
    # Apply pagination
    total = len(packages)
    packages = packages[offset:offset + limit]
    
    return {
        "data": packages,
        "count": len(packages),
        "total": total,
        "search": search,
        "pagination": {
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/flutter/issues")
async def get_issues(
    limit: int = Query(50, ge=1, le=100, description="Number of issues to return"),
    labels: Optional[str] = Query(None, description="Filter by labels (comma-separated)"),
    offset: int = Query(0, ge=0, description="Number of records to skip")
):
    """Get GitHub issues from flutter/flutter repository"""
    issues = MOCK_DATA["issues"]
    
    # Apply label filter
    if labels:
        label_list = [label.strip().lower() for label in labels.split(",")]
        issues = [issue for issue in issues if any(label in [l.lower() for l in issue["labels"]] for label in label_list)]
    
    # Apply pagination
    total = len(issues)
    issues = issues[offset:offset + limit]
    
    return {
        "data": issues,
        "count": len(issues),
        "total": total,
        "labels_filter": labels,
        "pagination": {
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/flutter/stats")
async def get_stats():
    """Get overall statistics"""
    return {
        "total_docs": len(MOCK_DATA["docs"]),
        "total_packages": len(MOCK_DATA["packages"]),
        "total_issues": len(MOCK_DATA["issues"]),
        "last_updated": datetime.utcnow().isoformat()
    }

@app.get("/api/flutter/search")
async def search_all(
    q: str = Query(..., description="Search query"),
    limit: int = Query(20, ge=1, le=50, description="Results per category")
):
    """Search across all Flutter resources"""
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    search_lower = q.lower()
    results = {}
    
    # Search docs
    docs = [doc for doc in MOCK_DATA["docs"] if search_lower in doc["title"].lower() or search_lower in doc["content"].lower()]
    results["docs"] = docs[:limit]
    
    # Search packages
    packages = [pkg for pkg in MOCK_DATA["packages"] if search_lower in pkg["name"].lower() or search_lower in pkg["description"].lower()]
    results["packages"] = packages[:limit]
    
    # Search issues
    issues = [issue for issue in MOCK_DATA["issues"] if search_lower in issue["title"].lower() or search_lower in issue["body"].lower()]
    results["issues"] = issues[:limit]
    
    total_results = len(results["docs"]) + len(results["packages"]) + len(results["issues"])
    
    return {
        "query": q,
        "results": results,
        "total_results": total_results,
        "results_by_type": {
            "docs": len(results["docs"]),
            "packages": len(results["packages"]),
            "issues": len(results["issues"])
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Vercel handler
def handler(request):
    """Vercel serverless function handler"""
    return app
