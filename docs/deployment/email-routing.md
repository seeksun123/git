# Inquiry Email Routing

The generated site uses a direct `mailto:Danny@hy-machinery.com` fallback on all inquiry forms, so it works without a database or server.

Optional server-side delivery is available through the Cloudflare Pages Function at `/submit-inquiry` if a transactional email provider is configured. The frontend tries `/submit-inquiry` first and automatically opens the visitor's email app if the endpoint is not configured or returns an error.

## Recipient

- Primary recipient: `Danny@hy-machinery.com`

## Optional Environment Variables

- `RESEND_API_KEY`: API key for Resend email delivery.
- `INQUIRY_FROM`: verified sender, for example `HY Machinery <inquiry@hy-machinery.com>`.
- `INQUIRY_TO`: recipient override; default is `Danny@hy-machinery.com`.

Copy `.env.example` when preparing production environment variables.

## Cloudflare Pages Variables

Set these in Cloudflare Pages project settings:

```text
RESEND_API_KEY
INQUIRY_FROM
INQUIRY_TO
```

`INQUIRY_FROM` must be a sender verified in Resend. If not configured, the form still falls back to direct email.

## Form Fields

- name
- email
- phone / WhatsApp
- country / region
- product interest
- material
- target width
- target speed
- voltage / frequency
- message

## Spam Controls

- Hidden honeypot field named `website`.
- Message length check.
- If spam appears after launch, add Cloudflare Turnstile before enabling the server-side endpoint for all users.
