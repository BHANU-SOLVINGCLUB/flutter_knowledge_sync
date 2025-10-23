"""Fetch recent issues from the flutter/flutter GitHub repository."""
from typing import List, Dict
from github import Github
import os, logging

LOG = logging.getLogger(__name__)
GH_TOKEN = os.getenv('GITHUB_TOKEN')

def update_github_issues() -> List[Dict]:
    out = []
    if not GH_TOKEN:
        LOG.warning('GITHUB_TOKEN not set; skipping GitHub fetch.')
        return out
    try:
        gh = Github(GH_TOKEN)
        repo = gh.get_repo('flutter/flutter')
        issues = repo.get_issues(state='open')[:100]
        for issue in issues:
            out.append({
                'id': f'gh-{issue.id}',
                'title': issue.title,
                'issue_number': issue.number,
                'labels': [l.name for l in issue.labels],
                'body': issue.body or '',
                'url': issue.html_url,
                'created_at': issue.created_at.isoformat(),
            })
    except Exception as e:
        LOG.exception('Error fetching GitHub issues: %s', e)
    return out
