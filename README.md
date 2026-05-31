# HY Machinery Multilingual Static Site

Static multilingual lead-generation website for HY Machinery, built for Cloudflare Workers with Workers Assets.

## Local Commands

```bash
npm run build
npm run verify
npm run package
npm run deploy:cloudflare
```

## Deployment

- Cloudflare Worker service: `withered-base-b92f`
- Static output: `dist`
- Worker entry: `src/worker.js`
- Inquiry endpoint: `/submit-inquiry`
- Email fallback: `mailto:Danny@hy-machinery.com`

Set these Cloudflare Worker variables if server-side email delivery is required:

```text
RESEND_API_KEY
INQUIRY_FROM
INQUIRY_TO
```
