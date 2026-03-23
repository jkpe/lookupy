# Lookupy

**DNS over HTTPS lookup** — query A, AAAA, CNAME, MX, TXT, and other record types in the browser. Queries go to your chosen resolver (e.g. Cloudflare, Google) over HTTPS.

Live site: [lookupy.top](https://lookupy.top/)

## Repo layout

| Path | Purpose |
|------|---------|
| Root (`index.html`, assets) | Static web app |
| `ios/src/` | Native iOS wrapper around the same experience |
| `screenshots/` | Next.js page for App Store marketing screenshots |

## Local preview

Serve the root folder with any static file server, for example:

```bash
npx serve .
```

No build step is required for the main site.
