#!/usr/bin/env sh
# Entrypoint: migrate (if any) then run uvicorn
echo "Starting Flutter Knowledge Sync API..."
uvicorn api.server:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}
