#!/usr/bin/env bash
set -euo pipefail

cd /app

echo "Detecting FastAPI app module..."
if [ -f backend/app/main.py ]; then
  MODULE="backend.app.main:app"
elif [ -f backend/main.py ]; then
  MODULE="backend.main:app"
elif [ -f backend/src/main.py ]; then
  MODULE="backend.src.main:app"
else
  echo "❌ Could not find FastAPI entrypoint."
  echo "Expected one of:"
  echo "  - backend/app/main.py  (MODULE=backend.app.main:app)"
  echo "  - backend/main.py      (MODULE=backend.main:app)"
  echo "  - backend/src/main.py  (MODULE=backend.src.main:app)"
  exit 1
fi
echo "✅ Using module: $MODULE"

# Start FastAPI
python -m uvicorn "$MODULE" --host 0.0.0.0 --port 10001 &
BACKEND_PID=$!

# Wait until backend responds (healthz first, then docs)
echo "Waiting for backend to be ready..."
for i in {1..60}; do
  if curl -fsS http://localhost:10001/healthz >/dev/null 2>&1 \
     || curl -fsS http://localhost:10001/docs   >/dev/null 2>&1; then
    echo "✅ Backend is up"
    break
  fi
  # if process died, fail immediately
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "❌ Backend process exited. Check import path and logs."
    exit 1
  fi
  echo "… still waiting ($i/60)"; sleep 1
done

# Start Next.js frontend
echo "Starting Next.js on :10000"
npm --prefix frontend run start -- --port 10000
