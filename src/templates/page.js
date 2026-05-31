import site from "../data/site.json" with { type: "json" };

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderPage({ locale, labels, title, description, path, alternates, content, jsonLd = [] }) {
  const canonical = `${site.domain}${path}`;
  const hreflang = alternates
    .map((item) => `<link rel="alternate" hreflang="${item.code}" href="${site.domain}${item.path}">`)
    .join("\n");
  const defaultAlternate = alternates.find((item) => item.code === "en") || alternates[0];
  const ld = jsonLd.length
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd.length === 1 ? jsonLd[0] : jsonLd)}</script>`
    : "";

  return `<!doctype html>
<html lang="${locale.code}" dir="${locale.dir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  ${hreflang}
  <link rel="alternate" hreflang="x-default" href="${site.domain}${defaultAlternate.path}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${escapeHtml(site.brand)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/styles.css">
  ${ld}
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${content}
  <a class="sticky-quote" href="${prefix(locale)}/contact/">${escapeHtml(labels.quote)}</a>
  <script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

export function prefix(locale) {
  return locale.path ? `/${locale.path}` : "";
}

export function pagePath(locale, slug = "") {
  const base = prefix(locale);
  if (!slug) return `${base}/`;
  return `${base}/${slug}/`.replaceAll("//", "/");
}
