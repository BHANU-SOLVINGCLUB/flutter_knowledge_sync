"""Fetch or mirror portions of flutter docs.

This module fetches key Flutter documentation pages and API references.
"""
from typing import List, Dict
import requests
from bs4 import BeautifulSoup
import logging
import re

LOG = logging.getLogger(__name__)

def update_flutter_docs() -> List[Dict]:
    """Fetch key Flutter documentation pages and return structured data."""
    urls = [
        {
            "url": "https://docs.flutter.dev/",
            "title": "Flutter Documentation Home",
            "id": "flutter-docs-home"
        },
        {
            "url": "https://docs.flutter.dev/get-started/install",
            "title": "Flutter Installation Guide",
            "id": "flutter-install"
        },
        {
            "url": "https://docs.flutter.dev/development/ui/widgets",
            "title": "Flutter Widgets",
            "id": "flutter-widgets"
        },
        {
            "url": "https://docs.flutter.dev/development/ui/widgets-intro",
            "title": "Introduction to Widgets",
            "id": "widgets-intro"
        }
    ]
    
    out = []
    for doc in urls:
        try:
            r = requests.get(doc["url"], timeout=15)
            r.raise_for_status()
            
            # Parse HTML content
            soup = BeautifulSoup(r.text, 'html.parser')
            
            # Extract main content
            main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')
            if main_content:
                content = main_content.get_text(strip=True)
            else:
                content = soup.get_text(strip=True)
            
            # Create summary (first 500 chars)
            summary = content[:500] + "..." if len(content) > 500 else content
            
            out.append({
                "id": doc["id"],
                "title": doc["title"],
                "url": doc["url"],
                "summary": summary,
                "content": content,
            })
            
            LOG.info(f"Fetched Flutter doc: {doc['title']}")
            
        except Exception as e:
            LOG.warning("Failed to fetch %s: %s", doc["url"], e)
    
    return out
