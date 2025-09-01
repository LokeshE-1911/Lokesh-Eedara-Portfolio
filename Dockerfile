# ---------- Build frontend ----------
FROM node:20-bullseye AS fe-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV SKIP_SSR_FETCH=1
RUN npm run build

# ---------- Runtime ----------
FROM python:3.12-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

COPY backend /app/backend
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# runtime envs
ENV NEXT_PUBLIC_BACKEND_URL=http://localhost:10001
ENV GROQ_MODEL=llama-3.1-8b-instant

# bring built frontend (includes .next, node_modules)
COPY --from=fe-build /app/frontend /app/frontend

COPY start-all.sh /app/start-all.sh
RUN chmod +x /app/start-all.sh

ENV PORT=10000
EXPOSE 10000
CMD ["/app/start-all.sh"]
