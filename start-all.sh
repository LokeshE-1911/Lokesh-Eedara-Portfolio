#!/usr/bin/env bash
set -e
# Start FastAPI on 10001
(cd /app/backend && PORT=10001 bash start.sh) &
# Start Next.js on 10000
(cd /app/frontend && PORT=10000 node server.js 2>/dev/null || NEXT_PUBLIC_BACKEND_URL="http://localhost:10001" npm start) &
wait -n
