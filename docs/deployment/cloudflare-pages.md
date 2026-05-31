# Cloudflare Workers Deployment

## Build Settings

- Framework preset: None
- Build command: `npm run build`
- Static assets directory: `dist`
- Node.js: current LTS or newer

## Local Package

Run:

```bash
npm run package
```

Upload this file to Cloudflare Pages if using the dashboard:

```text
artifacts/hy-machinery-cloudflare-pages-dist.zip
```

## CLI Deploy

After logging in with Wrangler or setting `CLOUDFLARE_API_TOKEN`, run:

```bash
npm run deploy:cloudflare
```

The script verifies the site, rebuilds `dist`, refreshes the zip package, and deploys the Worker service named `withered-base-b92f` with `dist` served through Cloudflare Workers Assets.

## Domain And SSL

1. Add the production domain to the Worker route or custom domain.
2. Use SSL/TLS mode: Full (strict).
3. Enable Always Use HTTPS.
4. Confirm `https://www.hy-machinery.com/` loads from Cloudflare and no longer depends on the expired certificate seen on the old origin.

## Static Files

The build generates:

- `index.html` as the English homepage.
- Localized folders for `es`, `ar`, `fr`, `ru`, `pt`, `de`, `vi`, `ja`, `ko`, `it`, `tr`, `pl`, `th`, `id`, `hi`, `ms`, `nl`, `bn`, and `sv`.
- `sitemap.xml`
- `robots.txt`
- `_headers`
- `_redirects`

There is no database and no WordPress runtime in production.

## After Deploy

1. Open the English homepage.
2. Open `/ar/` and confirm right-to-left layout.
3. Open one product page and one blog article.
4. Submit a test inquiry by email fallback or configured form endpoint.
5. Submit `https://www.hy-machinery.com/sitemap.xml` in Google Search Console.

## DNS Cutover

1. Add `www.hy-machinery.com` as a custom domain or route on the Worker.
2. Point DNS to Cloudflare and keep the record proxied.
3. Add a redirect from apex `hy-machinery.com` to `www.hy-machinery.com` if the apex domain is also active.
4. Keep the old WordPress origin available only until the new Worker deployment is verified.
