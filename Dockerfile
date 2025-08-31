# ---------- Build frontend ----------
FROM node:20-bullseye AS fe-build
WORKDIR /app/frontend
# copy entire frontend (no missing path headaches)
COPY frontend/ ./
RUN npm install && npm run build

# ---------- Runtime: Python + Node ----------
FROM python:3.12-slim AS runtime
WORKDIR /app

# install Node for Next.js runtime
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

# backend
COPY backend /app/backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# in runtime stage
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:10001
ENV GROQ_MODEL=llama-3.1-8b-instant


# bring compiled frontend + runtime deps
COPY --from=fe-build /app/frontend /app/frontend

# start script
COPY start-all.sh /app/start-all.sh
RUN chmod +x /app/start-all.sh

ENV PORT=10000
EXPOSE 10000
CMD ["/app/start-all.sh"]
