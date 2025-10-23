#!/usr/bin/env python3
"""
Script to set up the database tables in Supabase
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from storage.supabase_client import supabase
import logging

logging.basicConfig(level=logging.INFO)
LOG = logging.getLogger(__name__)

def create_tables():
    """Create the required tables in Supabase"""
    LOG.info("Setting up database tables...")
    
    if supabase is None:
        LOG.error("❌ Supabase client is None")
        return False
    
    # SQL commands to create tables
    sql_commands = [
        """
        CREATE TABLE IF NOT EXISTS flutter_docs (
            id text PRIMARY KEY,
            title text,
            url text,
            summary text,
            content text,
            updated_at timestamptz DEFAULT now()
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS pub_packages (
            id text PRIMARY KEY,
            name text,
            description text,
            raw jsonb,
            updated_at timestamptz DEFAULT now()
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS github_issues (
            id text PRIMARY KEY,
            title text,
            issue_number int,
            labels text[],
            body text,
            url text,
            created_at timestamptz
        );
        """
    ]
    
    try:
        # Execute each SQL command
        for i, sql in enumerate(sql_commands, 1):
            LOG.info(f"Executing SQL command {i}...")
            result = supabase.rpc('exec_sql', {'sql': sql}).execute()
            LOG.info(f"✅ Command {i} executed successfully")
        
        LOG.info("🎉 All tables created successfully!")
        return True
        
    except Exception as e:
        LOG.error(f"❌ Error creating tables: {e}")
        LOG.info("You may need to run the SQL commands manually in the Supabase SQL Editor:")
        LOG.info("Go to: https://supabase.com/dashboard/project/lthfkjiggwawxdjzzqee/sql")
        for i, sql in enumerate(sql_commands, 1):
            LOG.info(f"\n--- SQL Command {i} ---")
            LOG.info(sql.strip())
        return False

def test_tables():
    """Test that tables exist and are accessible"""
    LOG.info("Testing table access...")
    
    tables = ['flutter_docs', 'pub_packages', 'github_issues']
    
    for table in tables:
        try:
            result = supabase.table(table).select('*').limit(1).execute()
            LOG.info(f"✅ Table '{table}' is accessible")
        except Exception as e:
            LOG.error(f"❌ Table '{table}' error: {e}")

if __name__ == "__main__":
    if create_tables():
        test_tables()
