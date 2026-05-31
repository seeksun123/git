import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import locales from "./data/locales.json" with { type: "json" };
import site from "./data/site.json" with { type: "json" };

const dist = path.resolve("dist");
const htmlFiles = await collectHtml(dist);
const expectedPagesPerLocale = 13;
const expectedHtmlCount = locales.length * expectedPagesPerLocale;
const expectedDomain = site.domain.replaceAll(".", "\\.");
const forbiddenConversationTerms = [
  "ChatGPT",
  "Codex",
  "assistant",
  "用户",
  "对话",
  "我们的对话",
  "帮我",
  "推进下一步"
];

if (htmlFiles.length !== expectedHtmlCount) {
  throw new Error(`Expected ${expectedHtmlCount} HTML pages, found ${htmlFiles.length}`);
}

const requiredSupportFiles = ["_headers", "_redirects", "robots.txt", "sitemap.xml", "favicon.svg", "blog-calendar.json"];
for (const filename of requiredSupportFiles) {
  await readFile(path.join(dist, filename), "utf8");
}

for (const locale of locales) {
  const home = locale.path ? path.join(dist, locale.path, "index.html") : path.join(dist, "index.html");
  const html = await readFile(home, "utf8");
  assert(html.includes(`lang="${locale.code}"`), `${home} missing lang="${locale.code}"`);
  assert(html.includes(`dir="${locale.dir}"`), `${home} missing dir="${locale.dir}"`);
}

assert(!(await exists(path.join(dist, "en", "index.html"))), "English must be the root homepage, not /en/");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const rel = path.relative(dist, file);

  assert(html.startsWith("<!doctype html>"), `${rel} missing doctype`);
  assert(count(html, /<h1[\s>]/g) === 1, `${rel} must contain exactly one h1`);
  assert(/<title>[^<]{12,}<\/title>/.test(html), `${rel} missing useful title`);
  assert(/<meta name="description" content="[^"]{40,220}"/.test(html), `${rel} missing useful meta description`);
  assert(new RegExp(`<link rel="canonical" href="${expectedDomain}/`).test(html), `${rel} missing canonical`);
  assert(count(html, /rel="alternate" hreflang="/g) >= locales.length + 1, `${rel} missing hreflang alternates`);
  assert(html.includes('hreflang="x-default"'), `${rel} missing x-default hreflang`);
  assert(!html.includes("中文"), `${rel} includes Chinese language label`);
  assert(!html.includes("cn.hy-machinery.com"), `${rel} links to old Chinese site`);
  assert(!html.includes("/zh/"), `${rel} includes /zh/ path`);
  assert(!html.includes("wp-content"), `${rel} links to WordPress assets`);
  assert(!html.includes("rest_route"), `${rel} links to WordPress API`);
  assert(!html.includes("mysql"), `${rel} includes database wording`);
  assert(!html.includes("postgres"), `${rel} includes database wording`);
  assert(!html.includes("mongodb"), `${rel} includes database wording`);
  for (const term of forbiddenConversationTerms) {
    assert(!html.includes(term), `${rel} includes internal conversation term: ${term}`);
  }
  assert(!html.includes("operates from Foshan with approximately"), `${rel} has English template company copy`);
  assert(!html.includes("The article links"), `${rel} has English template blog copy`);
  if (!rel.startsWith("products/") && rel.includes(`${path.sep}products${path.sep}`)) {
    assert(!html.includes(" supports "), `${rel} has English product intro copy`);
    assert(!html.includes("gravure printing machine"), `${rel} has English keyword copy`);
    assert(!html.includes("furniture film laminating machine"), `${rel} has English keyword copy`);
    assert(!html.includes("automatic center winder"), `${rel} has English keyword copy`);
  }

  for (const imgTag of html.matchAll(/<img\b[^>]*>/g)) {
    assert(/\salt="[^"]+"/.test(imgTag[0]), `${rel} has image without alt text`);
  }

  if (rel.includes(`${path.sep}products${path.sep}`) && !rel.endsWith(`${path.sep}products${path.sep}index.html`)) {
    assert(html.includes("inquiry-form"), `${rel} product page missing inquiry form`);
  }

  if (rel.endsWith(`${path.sep}contact${path.sep}index.html`) || rel === path.join("contact", "index.html")) {
    assert(html.includes(`mailto:${site.email}`), `${rel} contact page missing mailto fallback`);
  }

  if (html.includes("inquiry-form")) {
    assert(html.includes('data-endpoint="/submit-inquiry"'), `${rel} inquiry form missing endpoint`);
    assert(html.includes(`mailto:${site.email}`), `${rel} inquiry form missing mailto fallback`);
    assert(html.includes("form-status"), `${rel} inquiry form missing status region`);
  }
}

const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
assert(count(sitemap, /<url>/g) === expectedHtmlCount, "sitemap URL count does not match generated pages");
assert(sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"'), "sitemap missing xhtml namespace");
assert(count(sitemap, /hreflang="x-default"/g) === expectedHtmlCount, "sitemap missing x-default alternates");
assert(count(sitemap, /<xhtml:link/g) >= expectedHtmlCount * (locales.length + 1), "sitemap missing localized alternates");

const redirects = await readFile(path.join(dist, "_redirects"), "utf8");
assert(redirects.includes("/products/pvc-tarpaulin-laminating-machine/"), "missing PVC tarpaulin alias redirect");

const calendar = JSON.parse(await readFile(path.join(dist, "blog-calendar.json"), "utf8"));
assert(calendar.length === locales.length, "blog-calendar.json missing locales");
for (const entry of calendar) {
  assert(entry.topics.length >= 16, `blog calendar for ${entry.locale} needs at least 16 topics`);
}

console.log(`Validation passed for ${htmlFiles.length} HTML pages`);

async function collectHtml(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) {
      files.push(...await collectHtml(full));
    } else if (entry.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

function count(value, pattern) {
  return Array.from(value.matchAll(pattern)).length;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
