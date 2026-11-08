# Environment Variable Matrix

## Matrix of Configuration Variables

| Variable Name | Scope | Required | Purpose | Example Format |
|---|---|---|---|---|
| `PUBLIC_SITE_URL` | Client & Server | Yes | Base site URL for canonicals & sitemaps | `https://salowtech.com` |
| `SUPABASE_URL` | Server | Yes | Supabase project URL | `https://xyzcompany.supabase.co` |
| `SUPABASE_ANON_KEY` | Server / Client | Optional | Supabase public anonymous key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Yes | Admin key for server-side DB operations | `eyJhbGciOi...` |
| `RESEND_API_KEY` | Server only | Optional | Transactional email delivery service | `re_...` |
| `OWNER_NOTIFICATION_EMAIL` | Server only | Optional | Inbox receiving new lead alerts | `founders@salowtech.com` |
| `NODE_ENV` | Runtime | Yes | Execution environment | `production` / `development` |

