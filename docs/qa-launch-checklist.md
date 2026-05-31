# QA And Launch Checklist

## Static Build

- Run `npm run verify`.
- Confirm 260 HTML pages are generated.
- Confirm there is no `/en/` homepage and no Chinese site link.
- Confirm `sitemap.xml`, `robots.txt`, `_headers`, and `_redirects` exist.

## Visual Checks

- Desktop: `/`, `/products/tarpaulin-laminating-machine/`, `/blog/`, `/contact/`.
- Mobile: same paths at a narrow viewport.
- RTL: `/ar/` and one Arabic product page.
- Language menu: each language opens a localized homepage.

## Inquiry Checks

- Direct email fallback opens a message to `info@plasticsmachinevn.com`.
- Product name is included in product-page inquiry forms.
- Required email and message fields are present.
- Honeypot field is hidden.

## SEO Checks

- Each page has one `h1`.
- Each page has a unique title and meta description.
- Each page has canonical and hreflang links.
- Product pages include Product JSON-LD.
- Blog articles include BlogPosting JSON-LD.
- Do not submit the site, URLs, or sitemap to Google Search Console until the owner has fully reviewed and approved the website.

## Cloudflare Checks

- Cloudflare Pages output directory is `dist`.
- SSL mode is Full (strict).
- Always Use HTTPS is enabled.
- Old WordPress origin certificate is no longer part of the public delivery path.
