#!/usr/bin/env bash
set -e

# start FastAPI backend on port 10001
python -m uvicorn backend.main:app --host 0.0.0.0 --port 10001 &

# wait until backend responds
until curl -fsS http://localhost:10001/docs >/dev/null; do
  echo "waiting for backend..."
  sleep 1
done

# now start Next.js frontend on 10000
npm --prefix frontend run start -- --port 10000
