# Lookupy

**DNS over HTTPS lookup** — query A, AAAA, CNAME, MX, TXT, and other record types in the browser. Queries go to your chosen resolver (e.g. Cloudflare, Google) over HTTPS.

Live site: [lookupy.top](https://lookupy.top/)

## Repo layout

| Path | Purpose |
|------|---------|
| Root (`index.html`, assets) | Static web app |
| `www/` | Generated copy of those assets for Capacitor (created by `npm run build:web`; gitignored) |
| `ios/` | Capacitor iOS project (`App.xcworkspace` under `ios/App/`) |
| `android/` | Capacitor Android project |
| `ios-legacy/` | Previous native Swift/WebView wrapper (not used by Capacitor) |
| `screenshots/` | Next.js page for App Store marketing screenshots |

## Local preview

Serve the root folder with any static file server, for example:

```bash
npx serve .
```

No build step is required for the main site.

## Capacitor (iOS & Android)

The static UI is copied into `www/` and synced into the native projects.

```bash
npm install
npm run cap:sync    # copies web assets + updates native projects (runs CocoaPods on macOS)
npx cap open ios    # open ios/App/App.xcworkspace in Xcode
npx cap open android
```

After editing `index.html` or root assets, run `npm run cap:sync` again before building in Xcode or Android Studio.
