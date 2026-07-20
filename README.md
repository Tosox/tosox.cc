# tosox.cc

Personal website for **Tosox** — a showcase of game mods (S.T.A.L.K.E.R. Anomaly, Single Player
Tarkov), userscripts, dev tools and open-source contributions.

Monorepo with two apps:

| Folder | Stack | Role |
|--------|-------|------|
| [`web/`](web) | Angular 20 (standalone + signals), SCSS, nginx | Frontend SPA |
| [`api/`](api) | Kotlin + Spring Boot 4, JDK 21 | Caches GitHub data and serves it at `/api/github` |

The API fetches the GitHub profile, repositories and external pull requests on a schedule
(every 30 min) and caches them in memory, so visitors never hit GitHub directly and the site is immune
to GitHub's per-IP rate limit. The frontend reads everything from a single endpoint.

```
Browser ──▶ nginx (web) ──/api──▶ Spring Boot (api) ──(every 30 min)──▶ api.github.com
             └── serves the Angular SPA
```

## Requirements

- **Docker** + Docker Compose (production / Raspberry Pi)
- For local development: **Node 22+**, and the **Gradle wrapper** (auto-provisions JDK 21)

## Run with Docker (Raspberry Pi)

Images are multi-arch, so they build natively on the Pi's arm64.

```bash
# optional: raise the GitHub rate limit from 60 to 5000 req/hr
cp .env.example .env      # then paste a token into GITHUB_TOKEN (a token with no scopes is enough)

docker compose up -d --build
```

The site is then served on **port 80**:

- `http://<pi-host>/` — the website
- `http://<pi-host>/api/github` — the cached GitHub snapshot (proxied to the api container)

## Local development

Run the two apps in separate terminals.

**Backend** (http://localhost:8080):

```bash
cd api
./gradlew bootRun
# GET http://localhost:8080/api/github
# GET http://localhost:8080/actuator/health
```

**Frontend** (http://localhost:4200):

```bash
cd web
npm install
npm start          # ng serve; proxies /api -> http://localhost:8080 (see proxy.conf.json)
```

## Configuration

Backend settings live in [`api/src/main/resources/application.yml`](api/src/main/resources/application.yml):

| Key | Default | Purpose |
|-----|---------|---------|
| `github.username` | `Tosox` | Whose profile/repos/PRs to show |
| `github.token` | `${GITHUB_TOKEN:}` | Optional PAT; blank = 60 req/hr, set = 5000 req/hr |
| `github.excluded-users` | `Tosox, CoHModSDK` | Excluded from the external-contributions search |
| `github.refresh-interval-ms` | `1800000` | Cache refresh interval (30 min) |
