import os
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from fetch.flutter_docs import update_flutter_docs
from fetch.pub_dev import update_pubdev
from fetch.github_issues import update_github_issues
from storage.supabase_client import push_to_supabase
from dotenv import load_dotenv

load_dotenv()
LOG = logging.getLogger("sync")
logging.basicConfig(level=logging.INFO)

def job():
    LOG.info("Starting sync job...")
    try:
        docs = update_flutter_docs()
        pkgs = update_pubdev()
        issues = update_github_issues()
        if docs:
            push_to_supabase("flutter_docs", docs)
        if pkgs:
            push_to_supabase("pub_packages", pkgs)
        if issues:
            push_to_supabase("github_issues", issues)
        LOG.info("Sync job completed.")
    except Exception as e:
        LOG.exception("Error during sync: %s", e)

if __name__ == '__main__':
    scheduler = BackgroundScheduler()
    interval_min = int(os.getenv('SYNC_INTERVAL_MINUTES', '360'))
    scheduler.add_job(job, 'interval', minutes=interval_min, next_run_time=None)
    scheduler.start()
    LOG.info("Scheduler started (interval %s minutes). Running first job synchronously...", interval_min)
    job()
    try:
        import time
        while True:
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
