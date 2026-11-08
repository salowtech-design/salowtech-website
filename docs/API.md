# Salowtech API Specification

## 1. Overview
Documenting all endpoints ported from legacy `company new` backend into `salowtech-merged/src/pages/api/*`.

## 2. API Endpoints
| Method | Path | Auth | Purpose | Handler |
|--------|------|------|---------|---------|
| POST | `/api/leads` | None | Lead form submission | `api/leads.ts` |
| GET | `/api/health` | None | System liveness probe | `api/health.ts` |
| GET | `/api/ready` | None | DB readiness probe | `api/ready.ts` |

