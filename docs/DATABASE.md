# Salowtech Database Architecture

## 1. Overview
Database layer configuration, schemas, migrations, and access patterns.

## 2. Engine & Connection
- **Engine:** PostgreSQL / Supabase
- **Access Method:** Supabase Client / Pg Pooler
- **Environment Keys:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

## 3. Schema Definitions
### Table: `leads`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` / `serial` | Primary Key | Lead unique identifier |
| `name` | `text` | Required | Customer full name |
| `email` | `text` | Required | Customer contact email |
| `phone` | `text` | Optional | Customer contact phone |
| `service` | `text` | Optional | Requested service domain |
| `source_page` | `text` | Optional | Referring landing page/URL |
| `created_at` | `timestamptz` | Default `now()` | Timestamp of submission |

