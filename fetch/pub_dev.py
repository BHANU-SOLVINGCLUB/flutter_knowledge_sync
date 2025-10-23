"""Fetch top packages from pub.dev via its API."""
from typing import List, Dict
import requests
import logging

LOG = logging.getLogger(__name__)

PUB_API_SEARCH = "https://pub.dev/api/search?q=flutter&page=1"

def update_pubdev() -> List[Dict]:
    out = []
    try:
        r = requests.get(PUB_API_SEARCH, timeout=15)
        r.raise_for_status()
        data = r.json()
        
        # pub.dev search API returns package metadata in 'packages'
        packages = data.get('packages', [])
        LOG.info(f"Found {len(packages)} packages from pub.dev")
        
        for p in packages[:50]:  # Limit to top 50
            if isinstance(p, dict):
                package_name = p.get('package', '')
                if package_name:
                    out.append({
                        'id': package_name,
                        'name': package_name,
                        'description': p.get('description', ''),
                        'raw': p,
                    })
    except Exception as e:
        LOG.exception('Error fetching pub.dev: %s', e)
    return out
