import site from "../data/site.json" with { type: "json" };
import { escapeHtml, pagePath, prefix } from "./page.js";

export function header(locale, labels, locales) {
  const nav = [
    [labels.nav[0], pagePath(locale)],
    [labels.nav[1], pagePath(locale, "products")],
    [labels.nav[2], pagePath(locale, "about")],
    [labels.nav[3], pagePath(locale, "blog")],
    [labels.nav[4], pagePath(locale, "contact")]
  ];

  return `<header class="site-header">
    <div class="topbar">
      <span>${escapeHtml(site.mobile)}</span>
      <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>
    </div>
    <div class="nav-shell">
      <a class="brand" href="${pagePath(locale)}">
        <img src="/assets/img/logo.png" alt="${escapeHtml(site.brand)} logo" onerror="this.style.display='none'">
        <span>${escapeHtml(site.brand)}</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="site-nav" aria-label="Primary">
        ${nav.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}
        <a class="button button-small" href="${pagePath(locale, "contact")}">${escapeHtml(labels.quote)}</a>
      </nav>
      <div class="language-select">
        <button type="button" aria-expanded="false">${escapeHtml(locale.native)}</button>
        <div class="language-menu">
          ${locales.map((item) => `<a href="${pagePath(item)}" hreflang="${item.code}">${escapeHtml(item.native)}</a>`).join("")}
        </div>
      </div>
    </div>
  </header>`;
}

export function footer(locale, labels) {
  return `<footer class="site-footer">
    <div class="footer-grid">
      <div>
        <h2>${escapeHtml(site.company)}</h2>
        <p>${escapeHtml(site.address)}</p>
      </div>
      <div>
        <p><strong>Tel</strong> <a href="tel:${escapeHtml(site.phone)}">${escapeHtml(site.phone)}</a></p>
        <p><strong>Mobile</strong> <a href="https://wa.me/${site.mobile.replace(/\D/g, "")}">${escapeHtml(site.mobile)}</a></p>
        <p><strong>Email</strong> <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></p>
      </div>
      <div>
        <a class="button" href="${pagePath(locale, "contact")}">${escapeHtml(labels.ctaTalk)}</a>
      </div>
    </div>
  </footer>`;
}

export function productCard(locale, labels, product, materialText = "") {
  const name = labels.productNames[product.id];
  return `<article class="product-card">
    <a href="${pagePath(locale, `products/${product.id}`)}">
      <img src="${product.image}" alt="${escapeHtml(name)}">
      <div class="product-card-body">
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(materialText || product.materials.join(", "))}</p>
        <span>${escapeHtml(labels.readMore)}</span>
      </div>
    </a>
  </article>`;
}

export function inquiryForm(locale, labels, ui, productName = "") {
  const subject = encodeURIComponent(`${site.brand} inquiry - ${productName || labels.quote}`);
  return `<form class="inquiry-form" action="mailto:${site.email}?subject=${subject}" method="post" enctype="text/plain" data-endpoint="/submit-inquiry">
    <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="honeypot">
    <label>${escapeHtml(ui.name)}<input required name="name" autocomplete="name"></label>
    <label>${escapeHtml(ui.email)}<input required name="email" type="email" autocomplete="email"></label>
    <label>${escapeHtml(ui.phone)}<input name="phone" autocomplete="tel"></label>
    <label>${escapeHtml(ui.country)}<input name="country" autocomplete="country-name"></label>
    <label>${escapeHtml(ui.product)}<input name="product" value="${escapeHtml(productName)}"></label>
    <label>${escapeHtml(ui.material)}<input name="material" placeholder="PVC, PE, BOPP, tarpaulin"></label>
    <label>${escapeHtml(ui.width)}<input name="width" placeholder="1600-2100 mm"></label>
    <label>${escapeHtml(ui.speed)}<input name="speed" placeholder="m/min"></label>
    <label>${escapeHtml(ui.voltage)}<input name="voltage" placeholder="380 V 50 Hz, 415 V 50 Hz, 440 V 60 Hz"></label>
    <label>${escapeHtml(ui.message)}<textarea required name="message" minlength="20"></textarea></label>
    <button class="button" type="submit">${escapeHtml(labels.quote)}</button>
    <p class="form-status" aria-live="polite"></p>
  </form>`;
}

export function breadcrumbs(locale, items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items
    .map((item, index) => item.href && index < items.length - 1
      ? `<a href="${item.href}">${escapeHtml(item.label)}</a>`
      : `<span>${escapeHtml(item.label)}</span>`)
    .join(" / ")}</nav>`;
}

export function layout(locale, labels, locales, main) {
  return `${header(locale, labels, locales)}<main id="main">${main}</main>${footer(locale, labels)}`;
}

export function specTable(rows) {
  return `<table class="spec-table"><tbody>${rows
    .map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("")}</tbody></table>`;
}

export function productJsonLd(locale, labels, product, materialText = "") {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": labels.productNames[product.id],
    "brand": site.brand,
    "image": `${site.domain}${product.image}`,
    "description": `${labels.productNames[product.id]}: ${materialText || product.materials.join(", ")}`,
    "url": `${site.domain}${prefix(locale)}/products/${product.id}/`
  };
}
