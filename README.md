# tosox.cc

My personal site. `web/` is the Angular frontend, `api/` a Spring Boot service that caches GitHub data every 30 min.

## Deploy

CI builds arm64 images to GHCR on push to `master`.

```bash
cp .env.example .env   # optional GITHUB_TOKEN
docker compose pull && docker compose up -d
```

Build from source: `docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build`

## Local

```bash
cd api && ./gradlew bootRun   # :8080
cd web && npm start           # :4200, proxies /api
```
