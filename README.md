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
- Production URL: `https://www.plasticsmachinevn.com`
- Apex redirect: `https://plasticsmachinevn.com` -> `https://www.plasticsmachinevn.com`
- Current deployed Worker version: `33e54518-ae6a-499f-88cd-1205008a0d62`
- Static output: `dist`
- Worker entry: `src/worker.js`
- Inquiry endpoint: `/submit-inquiry`
- Email fallback: `mailto:info@plasticsmachinevn.com`

Set these Cloudflare Worker variables if server-side email delivery is required:

```text
RESEND_API_KEY
INQUIRY_FROM
INQUIRY_TO
```
