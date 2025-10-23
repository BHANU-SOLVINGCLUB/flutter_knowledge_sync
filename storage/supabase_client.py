"""Simple Supabase helper with upsert semantics."""
import os, logging
from supabase import create_client
from typing import List, Dict

LOG = logging.getLogger(__name__)

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://lthfkjiggwawxdjzzqee.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0aGZramlnZ3dhd3hkanp6cWVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzU1MzcsImV4cCI6MjA3NjgxMTUzN30.EOd-1rd0O9PPChSAyzDltMsoN3d1qF1dPzOTJlnyd5E')

if not SUPABASE_URL or not SUPABASE_KEY:
    LOG.warning('Supabase credentials not set. DB operations will fail until configured.')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

def push_to_supabase(table: str, rows: List[Dict]):
    if supabase is None:
        LOG.warning('Supabase client not configured, skipping push for table %s', table)
        return
    for row in rows:
        try:
            # Upsert by primary key 'id' where appropriate
            supabase.table(table).upsert(row).execute()
        except Exception as e:
            LOG.exception('Error upserting row to %s: %s', table, e)
