# HY Machinery Static Multilingual Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Cloudflare-ready static HTML acquisition website for Hongyi/HY Machinery with English as the root homepage and 19 additional localized language sections, no Chinese site, no database, and email-ready inquiry flows.

**Architecture:** The deploy output is static HTML, CSS, JS, images, `sitemap.xml`, `robots.txt`, `_headers`, and `_redirects`. A small local build script may be used to generate repeated pages from content files, but the production site must not require a server or database. The site recreates the current HY Machinery structure while rewriting copy for local search intent, local conventions, and lead generation.

**Tech Stack:** Plain HTML5, CSS3, vanilla JavaScript, local JSON content data, optional Node.js build script, Cloudflare Pages, Cloudflare Workers Email Routing or Formspree/Getform fallback for email forms.

---

## Source Site Snapshot

Current source domain inspected: `https://www.hy-machinery.com/`.

Important findings:
- The live site is WordPress/Avada and its HTTPS certificate is expired when fetched locally.
- Current public structure is small: Home, Products, About Us, Contact Us, Quotation modal, plus 4 product pages.
- Current products are:
  - Printing Machine
  - Flex and Tarpaulin Laminating Machine
  - Furniture Film Laminating Machine
  - Calendar/Calender Winder
- Current contact details are:
  - Company: Foshan Gaoming Hongyi Machinery Co., Ltd.
  - Address: No. 1 Sanhe Road, Cangjiang Industrial Park, Gaoming District, Foshan, Guangdong, China
  - Tel: +86-757-88820000
  - Mobile/WhatsApp candidate: +86-13928528302
  - Email: Danny@hy-machinery.com

Assumption to verify before publishing: the user owns or controls the source site assets and may legally reuse product images, logo, product specs, company claims, and case names.

---

## Language And Locale Plan

Root homepage:
- `/index.html`: English homepage, `lang="en"`, default international B2B English.

Localized sections:
- `/es/`: Spanish, `lang="es"`, target Spain + Latin America, metric units, quote in USD/EUR on request.
- `/ar/`: Arabic, `lang="ar" dir="rtl"`, target GCC and MENA, metric units, local right-to-left layout.
- `/fr/`: French, `lang="fr"`, target France + Francophone Africa, metric units, EUR/XOF/XAF context when needed.
- `/ru/`: Russian, `lang="ru"`, target CIS buyers, metric units, Russian industrial terminology.
- `/pt/`: Portuguese, `lang="pt"`, target Brazil + Portugal, metric units, BRL/EUR context when needed.
- `/de/`: German, `lang="de"`, target Germany/Austria/Switzerland, metric units, EUR/CHF context.
- `/vi/`: Vietnamese, `lang="vi"`, target Vietnam, metric units, VND context.
- `/ja/`: Japanese, `lang="ja"`, target Japan, metric units, JPY context and Japanese B2B tone.
- `/ko/`: Korean, `lang="ko"`, target South Korea, metric units, KRW context.
- `/it/`: Italian, `lang="it"`, target Italy, metric units, EUR context.
- `/tr/`: Turkish, `lang="tr"`, target Turkey, metric units, TRY/USD context.
- `/pl/`: Polish, `lang="pl"`, target Poland, metric units, PLN/EUR context.
- `/th/`: Thai, `lang="th"`, target Thailand, metric units, THB context.
- `/id/`: Indonesian, `lang="id"`, target Indonesia, metric units, IDR context.
- `/hi/`: Hindi, `lang="hi"`, target India, metric units, INR context and 415 V/50 Hz notes where relevant.
- `/ms/`: Malay, `lang="ms"`, target Malaysia, metric units, MYR context.
- `/nl/`: Dutch, `lang="nl"`, target Netherlands/Belgium, metric units, EUR context.
- `/bn/`: Bengali, `lang="bn"`, target Bangladesh, metric units, BDT context.
- `/sv/`: Swedish, `lang="sv"`, target Sweden/Nordics, metric units, SEK/EUR context.

Localization rules:
- Keep machine engineering specs truthful: widths in mm/m, speed in m/min, power in kW, voltage as original `380 V, 50 Hz` plus optional configuration notes such as `220/440 V, 50/60 Hz available after engineering review`.
- Localize formatting, not facts: decimal separators, date order, currency examples, phone display, punctuation, directionality, form labels, and CTA tone.
- Do not direct-translate from English. Each language needs native industrial buyer wording, local search phrasing, and market-specific examples.
- Do not create `/zh/`, `cn`, Chinese language switcher entries, or Chinese meta tags.

---

## SEO Strategy

Core commercial keyword clusters:
- gravure printing machine for PVC film
- PVC tarpaulin laminating machine
- flex banner laminating machine
- PVC artificial leather production line
- furniture film laminating machine
- PVC film calender winder
- automatic film rewinding machine
- synthetic leather coating and laminating line
- tarpaulin coating line
- plastic film printing and laminating machine

Low-competition long-tail page angles:
- machine type + material: `PVC tarpaulin laminating machine for tent fabric`
- machine type + width: `1600 mm PVC film laminating machine`
- machine type + buyer need: `gravure printing machine for flexible packaging film`
- machine type + power/voltage: `380 V 50 Hz PVC laminating line`
- machine type + region phrase: localized equivalent of `manufacturer`, `supplier`, `factory`, `price`, `quotation`, `technical specifications`

Per-language SEO requirements:
- One unique title and meta description per page.
- One `h1` per page, localized around search intent.
- Localized slugs where readable and stable; ASCII fallback slugs are allowed for maintainability.
- `hreflang` links across all language equivalents.
- `Product`, `Organization`, `BreadcrumbList`, and `FAQPage` JSON-LD where appropriate.
- Blog posts must answer buyer-intent questions and link to relevant product pages.

---

## Target File Structure

Create:
- `package.json`: local scripts for validation and optional static build.
- `src/data/locales.json`: locale codes, names, direction, date/currency/measurement preferences.
- `src/data/site.json`: company, contact, products, specs, cases, common navigation data.
- `src/data/seo-keywords.json`: keyword clusters and blog topic map per product.
- `src/content/<locale>.json`: localized page copy for each language.
- `src/templates/page.js`: HTML shell renderer for pages.
- `src/templates/components.js`: header, footer, product cards, forms, language switcher, breadcrumbs.
- `src/build.js`: generates static HTML into `dist/`.
- `src/validate.js`: checks generated pages for required SEO/localization rules.
- `assets/css/styles.css`: responsive industrial B2B design.
- `assets/js/site.js`: language menu, form enhancement, no database logic.
- `assets/img/`: local downloaded logo and product images from source site after rights confirmation.
- `functions/submit-inquiry.js`: optional Cloudflare Pages Function for email delivery.
- `dist/`: generated deploy output.
- `wrangler.toml`: Cloudflare Pages/Functions configuration if using Workers email.
- `docs/seo/blog-calendar.md`: keyword-led blog publishing calendar.
- `docs/deployment/cloudflare-pages.md`: deploy instructions.

Generated HTML paths:
- `/index.html`
- `/<locale>/index.html`
- `/<locale>/products/index.html`
- `/<locale>/products/gravure-printing-machine/index.html`
- `/<locale>/products/tarpaulin-laminating-machine/index.html`
- `/<locale>/products/furniture-film-laminating-machine/index.html`
- `/<locale>/products/calender-winder/index.html`
- `/<locale>/about/index.html`
- `/<locale>/contact/index.html`
- `/<locale>/blog/index.html`
- `/<locale>/blog/<article-slug>/index.html`
- Root English product/blog/about/contact paths should also exist without `/en/`, for example `/products/index.html` and `/blog/index.html`.

---

### Task 1: Project Baseline And Static Build Skeleton

**Files:**
- Create: `package.json`
- Create: `src/build.js`
- Create: `src/validate.js`
- Create: `dist/.gitkeep`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "hy-machinery-static-site",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node src/build.js",
    "validate": "node src/validate.js",
    "verify": "npm run build && npm run validate"
  }
}
```

- [ ] **Step 2: Create minimal build script**

```js
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");

await mkdir(dist, { recursive: true });
await writeFile(
  path.join(dist, "index.html"),
  "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Hongyi Machinery</title></head><body><h1>Hongyi Machinery</h1></body></html>\n"
);

console.log("Generated static site in dist/");
```

- [ ] **Step 3: Create minimal validator**

```js
import { readFile } from "node:fs/promises";

const html = await readFile("dist/index.html", "utf8");

if (!html.includes("<!doctype html>")) {
  throw new Error("dist/index.html is missing HTML doctype");
}

if (!html.includes("lang=\"en\"")) {
  throw new Error("English root page must declare lang=\"en\"");
}

console.log("Validation passed");
```

- [ ] **Step 4: Run verification**

Run: `npm run verify`

Expected: the command prints `Generated static site in dist/` and `Validation passed`.

- [ ] **Step 5: Commit**

```bash
git add package.json src/build.js src/validate.js dist/.gitkeep
git commit -m "chore: add static site build skeleton"
```

---

### Task 2: Source Content And Asset Inventory

**Files:**
- Create: `docs/source-site-inventory.md`
- Create: `scripts/download-source-assets.js`
- Create: `assets/img/.gitkeep`

- [ ] **Step 1: Document source pages**

Add this table to `docs/source-site-inventory.md`:

```markdown
# Source Site Inventory

Source: https://www.hy-machinery.com/

| Source page | New page |
| --- | --- |
| `/` | `/index.html` |
| `/?page_id=16` | `/products/index.html` |
| `/?page_id=40` | `/products/gravure-printing-machine/index.html` |
| `/?page_id=52` | `/products/tarpaulin-laminating-machine/index.html` |
| `/?page_id=53` | `/products/furniture-film-laminating-machine/index.html` |
| `/?page_id=69` | `/products/calender-winder/index.html` |
| `/?page_id=14` | `/about/index.html` |
| `/?page_id=20` | `/contact/index.html` |

Reuse rule: copy structure, products, images, specs, and contact facts only after confirming rights. Rewrite all public copy for clarity, native local language, and buyer search intent.
```

- [ ] **Step 2: Add asset download script**

```js
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assets = [
  ["logo.png", "https://www.hy-machinery.com/wp-content/uploads/2022/04/%E8%8B%B1%E6%96%87-logo-2.png"],
  ["printing-machine.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E9%AB%98%E9%80%9F%E6%9C%89%E8%BD%B4-%E6%97%A0%E8%BD%B4%E5%87%B9%E7%89%88%E5%8D%B0%E5%88%B7%E6%9C%BA-01-1.jpg"],
  ["tarpaulin-laminating-machine.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E5%AE%BD%E5%B9%85%E7%83%AD%E7%86%94%E8%B4%B4%E5%90%88%E6%9C%BA-02-1.jpg"],
  ["furniture-film-laminating-machine.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E5%A4%9A%E5%B1%82%E8%B4%B4%E5%90%88%E6%9C%BA-03.jpg"],
  ["calender-winder.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E5%85%A8%E8%87%AA%E5%8A%A8%E4%B8%AD%E5%BF%83%E5%8D%B7%E5%8F%96%E6%9C%BA-04-%E9%B8%BF%E6%BA%A2%E6%9C%BA%E6%A2%B0.jpg"]
];

await mkdir("assets/img", { recursive: true });

for (const [filename, url] of assets) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join("assets/img", filename), buffer);
}

console.log(`Downloaded ${assets.length} assets`);
```

- [ ] **Step 3: Run asset download after rights confirmation**

Run: `node scripts/download-source-assets.js`

Expected: `assets/img/` contains logo and 4 product images.

- [ ] **Step 4: Commit**

```bash
git add docs/source-site-inventory.md scripts/download-source-assets.js assets/img
git commit -m "chore: inventory source site and assets"
```

---

### Task 3: Shared Data Model

**Files:**
- Create: `src/data/locales.json`
- Create: `src/data/site.json`
- Create: `src/data/seo-keywords.json`

- [ ] **Step 1: Add locale data**

Create `src/data/locales.json` with all 20 target locales:

```json
[
  {"code":"en","path":"","name":"English","dir":"ltr","currency":"USD","date":"May 31, 2026","decimal":"."},
  {"code":"es","path":"es","name":"Español","dir":"ltr","currency":"EUR/USD","date":"31 de mayo de 2026","decimal":","},
  {"code":"ar","path":"ar","name":"العربية","dir":"rtl","currency":"USD/AED/SAR","date":"31 مايو 2026","decimal":"."},
  {"code":"fr","path":"fr","name":"Français","dir":"ltr","currency":"EUR","date":"31 mai 2026","decimal":","},
  {"code":"ru","path":"ru","name":"Русский","dir":"ltr","currency":"USD/EUR","date":"31 мая 2026 г.","decimal":","},
  {"code":"pt","path":"pt","name":"Português","dir":"ltr","currency":"USD/EUR/BRL","date":"31 de maio de 2026","decimal":","},
  {"code":"de","path":"de","name":"Deutsch","dir":"ltr","currency":"EUR","date":"31. Mai 2026","decimal":","},
  {"code":"vi","path":"vi","name":"Tiếng Việt","dir":"ltr","currency":"USD/VND","date":"31/05/2026","decimal":","},
  {"code":"ja","path":"ja","name":"日本語","dir":"ltr","currency":"JPY/USD","date":"2026年5月31日","decimal":"."},
  {"code":"ko","path":"ko","name":"한국어","dir":"ltr","currency":"KRW/USD","date":"2026년 5월 31일","decimal":"."},
  {"code":"it","path":"it","name":"Italiano","dir":"ltr","currency":"EUR","date":"31 maggio 2026","decimal":","},
  {"code":"tr","path":"tr","name":"Türkçe","dir":"ltr","currency":"USD/TRY","date":"31 Mayıs 2026","decimal":","},
  {"code":"pl","path":"pl","name":"Polski","dir":"ltr","currency":"EUR/PLN","date":"31 maja 2026","decimal":","},
  {"code":"th","path":"th","name":"ไทย","dir":"ltr","currency":"THB/USD","date":"31 พฤษภาคม 2026","decimal":"."},
  {"code":"id","path":"id","name":"Bahasa Indonesia","dir":"ltr","currency":"IDR/USD","date":"31 Mei 2026","decimal":","},
  {"code":"hi","path":"hi","name":"हिन्दी","dir":"ltr","currency":"INR/USD","date":"31 मई 2026","decimal":"."},
  {"code":"ms","path":"ms","name":"Bahasa Melayu","dir":"ltr","currency":"MYR/USD","date":"31 Mei 2026","decimal":"."},
  {"code":"nl","path":"nl","name":"Nederlands","dir":"ltr","currency":"EUR","date":"31 mei 2026","decimal":","},
  {"code":"bn","path":"bn","name":"বাংলা","dir":"ltr","currency":"BDT/USD","date":"৩১ মে ২০২৬","decimal":"."},
  {"code":"sv","path":"sv","name":"Svenska","dir":"ltr","currency":"SEK/EUR","date":"31 maj 2026","decimal":","}
]
```

- [ ] **Step 2: Add product and company facts**

Create `src/data/site.json` with the factual base:

```json
{
  "brand": "Hongyi Machinery",
  "company": "Foshan Gaoming Hongyi Machinery Co., Ltd.",
  "founded": 1998,
  "factoryAreaM2": 60000,
  "address": "No. 1 Sanhe Road, Cangjiang Industrial Park, Gaoming District, Foshan, Guangdong, China",
  "phone": "+86-757-88820000",
  "mobile": "+86-13928528302",
  "email": "Danny@hy-machinery.com",
  "products": [
    {
      "id": "gravure-printing-machine",
      "sourceName": "Printing Machine",
      "image": "/assets/img/printing-machine.jpg",
      "materials": ["PVC", "PE", "BOPP", "CPP", "flexible film", "cloth"],
      "specs": {
        "application": "Flexible packaging film and PVC/PE printing",
        "voltage": "380 V, 50 Hz",
        "customVoltage": "220/440 V, 50/60 Hz available after engineering review"
      }
    },
    {
      "id": "tarpaulin-laminating-machine",
      "sourceName": "Flex and Tarpaulin Laminating Machine",
      "image": "/assets/img/tarpaulin-laminating-machine.jpg",
      "materials": ["PVC film", "tarpaulin", "tent fabric", "flex banner"],
      "specs": {
        "width": "1600-2000 mm",
        "speed": "3-60 m/min",
        "heating": "hot oil or electric heating",
        "voltage": "380 V, 50 Hz",
        "power": "45 kW"
      }
    },
    {
      "id": "furniture-film-laminating-machine",
      "sourceName": "Furniture Film Laminating Machine",
      "image": "/assets/img/furniture-film-laminating-machine.jpg",
      "materials": ["PVC decorative film", "wood grain film", "edge banding film"],
      "specs": {
        "application": "Furniture decoration film and packaging material laminating",
        "voltage": "380 V, 50 Hz"
      }
    },
    {
      "id": "calender-winder",
      "sourceName": "Calender Winder",
      "image": "/assets/img/calender-winder.jpg",
      "materials": ["PVC", "PE", "semi-rigid film", "rigid film"],
      "specs": {
        "width": "1600-2100 mm",
        "speed": "10-380 m/min",
        "heating": "warm water preheating",
        "voltage": "380 V, 50 Hz",
        "power": "40 kW"
      }
    }
  ]
}
```

- [ ] **Step 3: Add SEO keyword clusters**

Create `src/data/seo-keywords.json`:

```json
{
  "gravure-printing-machine": ["gravure printing machine", "PVC film printing machine", "flexible packaging printing machine", "BOPP film gravure printer"],
  "tarpaulin-laminating-machine": ["PVC tarpaulin laminating machine", "flex banner laminating machine", "tent fabric laminating machine", "PVC film coating line"],
  "furniture-film-laminating-machine": ["furniture film laminating machine", "PVC decorative film laminating machine", "wood grain film laminating line"],
  "calender-winder": ["calender winder", "PVC film rewinding machine", "automatic center winder", "plastic sheet winder"]
}
```

- [ ] **Step 4: Commit**

```bash
git add src/data/locales.json src/data/site.json src/data/seo-keywords.json
git commit -m "feat: add multilingual site data model"
```

---

### Task 4: HTML Templates, Navigation, And Layout

**Files:**
- Create: `src/templates/page.js`
- Create: `src/templates/components.js`
- Create: `assets/css/styles.css`
- Create: `assets/js/site.js`

- [ ] **Step 1: Implement HTML shell with SEO and hreflang**

`src/templates/page.js` must export a `renderPage` function accepting `locale`, `title`, `description`, `canonicalPath`, `content`, `alternates`, and `jsonLd`. It must output doctype, `html lang`, `dir`, viewport, canonical, `hreflang`, stylesheet, and body content.

- [ ] **Step 2: Implement shared components**

`src/templates/components.js` must export header, footer, product card, inquiry form, breadcrumb, FAQ, and language switcher functions. The header must not contain any Chinese link. The Arabic header and footer must render correctly with `dir="rtl"`.

- [ ] **Step 3: Implement CSS**

`assets/css/styles.css` must create a sober industrial B2B layout:
- responsive header
- product grid
- technical spec tables
- blog listing
- sticky quote CTA
- RTL support through `[dir="rtl"]`
- accessible focus states

- [ ] **Step 4: Implement minimal JavaScript**

`assets/js/site.js` must handle:
- mobile navigation toggle
- language menu toggle
- form submission state
- `mailto:` fallback if no form endpoint is configured

- [ ] **Step 5: Validate generated root page visually**

Run: `npm run verify`

Expected: generated root HTML references `/assets/css/styles.css` and `/assets/js/site.js`.

- [ ] **Step 6: Commit**

```bash
git add src/templates assets/css/styles.css assets/js/site.js src/build.js src/validate.js
git commit -m "feat: add static HTML templates and layout"
```

---

### Task 5: English Root Website

**Files:**
- Create: `src/content/en.json`
- Modify: `src/build.js`
- Modify: `src/validate.js`

- [ ] **Step 1: Write English content**

Create native English B2B copy for:
- Home
- Products hub
- 4 product pages
- About
- Contact
- Blog index
- 4 initial blog articles

Required English CTAs:
- `Request a quote`
- `Send machine requirements`
- `Ask for a layout proposal`
- `Talk to an engineer`

- [ ] **Step 2: Generate root English pages**

Update `src/build.js` so English pages are generated at root paths:
- `/index.html`
- `/products/index.html`
- `/products/gravure-printing-machine/index.html`
- `/products/tarpaulin-laminating-machine/index.html`
- `/products/furniture-film-laminating-machine/index.html`
- `/products/calender-winder/index.html`
- `/about/index.html`
- `/contact/index.html`
- `/blog/index.html`
- `/blog/pvc-tarpaulin-laminating-machine-buying-guide/index.html`
- `/blog/gravure-printing-machine-for-flexible-packaging/index.html`
- `/blog/how-to-choose-a-calender-winder/index.html`
- `/blog/furniture-film-laminating-line-specifications/index.html`

- [ ] **Step 3: Validate English SEO basics**

Update `src/validate.js` to assert every generated English page has:
- one `<h1>`
- non-empty `<title>`
- non-empty meta description
- canonical link
- no Chinese navigation link
- inquiry CTA link or form

- [ ] **Step 4: Run verification**

Run: `npm run verify`

Expected: all English pages pass validation.

- [ ] **Step 5: Commit**

```bash
git add src/content/en.json src/build.js src/validate.js dist
git commit -m "feat: generate English acquisition pages"
```

---

### Task 6: Multilingual Localized Content

**Files:**
- Create: `src/content/es.json`
- Create: `src/content/ar.json`
- Create: `src/content/fr.json`
- Create: `src/content/ru.json`
- Create: `src/content/pt.json`
- Create: `src/content/de.json`
- Create: `src/content/vi.json`
- Create: `src/content/ja.json`
- Create: `src/content/ko.json`
- Create: `src/content/it.json`
- Create: `src/content/tr.json`
- Create: `src/content/pl.json`
- Create: `src/content/th.json`
- Create: `src/content/id.json`
- Create: `src/content/hi.json`
- Create: `src/content/ms.json`
- Create: `src/content/nl.json`
- Create: `src/content/bn.json`
- Create: `src/content/sv.json`
- Modify: `src/build.js`
- Modify: `src/validate.js`

- [ ] **Step 1: Produce one locale at a time**

For each locale file, write native-market copy for the same page set as English. Use the same product facts, but localize:
- page title and meta description
- navigation labels
- product names using native industrial terms
- CTA wording
- FAQ questions
- date/currency examples
- voltage notes
- form labels and confirmation message

- [ ] **Step 2: Add localized URL generation**

Generate each locale into `/<locale>/...` paths. Keep root English pages at root and do not generate `/en/` unless a redirect is later needed.

- [ ] **Step 3: Add multilingual validation**

Validation must fail if:
- a non-English page has English-only navigation labels
- Arabic page misses `dir="rtl"`
- any page contains `/zh`, `cn.hy-machinery.com`, or a visible Chinese language link
- any locale has fewer than 4 blog articles
- any localized product page misses `hreflang`

- [ ] **Step 4: Run verification**

Run: `npm run verify`

Expected: 20 locale sets generate successfully and validation passes.

- [ ] **Step 5: Commit in batches**

Commit after every 3-5 languages:

```bash
git add src/content src/build.js src/validate.js dist
git commit -m "feat: add Spanish Arabic French localized pages"
```

Use similarly clear commit messages for later language batches.

---

### Task 7: Blog Channel And SEO Calendar

**Files:**
- Create: `docs/seo/blog-calendar.md`
- Modify: all `src/content/<locale>.json`
- Modify: `src/build.js`

- [ ] **Step 1: Create 12-month blog calendar**

`docs/seo/blog-calendar.md` must include 48 topics, grouped by product and buyer intent:
- buying guides
- specification explainers
- maintenance and troubleshooting
- material/application matching
- regional compliance and voltage considerations
- quotation checklist topics

- [ ] **Step 2: Add first 4 posts per language**

Each language starts with these article intents, localized and rewritten natively:
- PVC tarpaulin laminating machine buying guide
- Gravure printing machine for flexible packaging film
- How to choose a calender winder for PVC/PE sheet lines
- Furniture film laminating machine specifications buyers compare

- [ ] **Step 3: Add internal linking**

Each article must link to:
- its matching product page
- products hub
- contact/quote page
- at least one related article

- [ ] **Step 4: Validate blog pages**

Run: `npm run verify`

Expected: blog index and article pages exist for all languages, have canonical links, and include product CTAs.

- [ ] **Step 5: Commit**

```bash
git add docs/seo/blog-calendar.md src/content src/build.js dist
git commit -m "feat: add multilingual blog channel"
```

---

### Task 8: Inquiry Form And Email Delivery

**Files:**
- Create: `functions/submit-inquiry.js`
- Create: `docs/deployment/email-routing.md`
- Modify: `src/templates/components.js`
- Modify: `assets/js/site.js`

- [ ] **Step 1: Decide form route**

Preferred: Cloudflare Pages Function receives form POST and sends email through Cloudflare Email Routing-compatible worker logic or a transactional email provider.

Fallback: form uses `mailto:Danny@hy-machinery.com` with subject and body prefilled.

- [ ] **Step 2: Create form fields**

Every contact and quote form must include:
- name
- email
- phone/WhatsApp
- country/region
- product interest
- material
- target width
- target speed
- voltage/frequency
- message

- [ ] **Step 3: Add spam controls**

Use:
- hidden honeypot field named `website`
- minimum message length check
- basic rate-limit note for Cloudflare Turnstile if spam appears after launch

- [ ] **Step 4: Document email setup**

`docs/deployment/email-routing.md` must specify:
- recipient: `Danny@hy-machinery.com`
- tested sender path
- Cloudflare environment variables
- fallback `mailto:` behavior

- [ ] **Step 5: Verify no database dependency**

Run: `npm run verify`

Expected: validation confirms no generated HTML references a database, WordPress endpoint, or Chinese source URL.

- [ ] **Step 6: Commit**

```bash
git add functions/submit-inquiry.js docs/deployment/email-routing.md src/templates/components.js assets/js/site.js dist
git commit -m "feat: add static inquiry form email flow"
```

---

### Task 9: Cloudflare Pages Deployment Files

**Files:**
- Create: `wrangler.toml`
- Create: `dist/_headers`
- Create: `dist/_redirects`
- Create: `dist/robots.txt`
- Create: `dist/sitemap.xml`
- Create: `docs/deployment/cloudflare-pages.md`
- Modify: `src/build.js`

- [ ] **Step 1: Add security and cache headers**

Generate `dist/_headers`:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

- [ ] **Step 2: Add redirects**

Generate `dist/_redirects`:

```text
/en/* /:splat 301
/zh/* / 302
/cn/* / 302
```

- [ ] **Step 3: Generate sitemap and robots**

`sitemap.xml` must include every generated page and alternate language references where possible. `robots.txt` must allow crawling and point to the sitemap.

- [ ] **Step 4: Document Cloudflare setup**

`docs/deployment/cloudflare-pages.md` must include:
- Pages project build command: `npm run build`
- Output directory: `dist`
- Production branch
- Custom domain setup
- SSL mode: Full (strict)
- Redirect HTTP to HTTPS
- Verify expired source certificate is no longer relevant after Cloudflare cutover

- [ ] **Step 5: Run verification**

Run: `npm run verify`

Expected: generated deploy files exist and no Chinese site is linked.

- [ ] **Step 6: Commit**

```bash
git add wrangler.toml docs/deployment/cloudflare-pages.md src/build.js dist
git commit -m "chore: add Cloudflare Pages deployment files"
```

---

### Task 10: QA, SEO Audit, And Launch Checklist

**Files:**
- Create: `docs/qa-launch-checklist.md`
- Modify: `src/validate.js`

- [ ] **Step 1: Add final validation checks**

`src/validate.js` must check:
- all 20 languages exist
- English root is `/index.html`
- no Chinese site pages or nav links exist
- all product pages have quote CTA
- all pages have `hreflang`
- all images have alt text
- Arabic pages have RTL direction
- all pages have canonical URLs
- forms have email or endpoint fallback

- [ ] **Step 2: Write launch checklist**

`docs/qa-launch-checklist.md` must include:
- desktop and mobile visual checks
- form delivery test
- Cloudflare SSL test
- PageSpeed check
- Search Console sitemap submission
- analytics/pixel decision
- 404 and redirect checks
- language switcher checks
- native copy review checklist for each language

- [ ] **Step 3: Run local verification**

Run: `npm run verify`

Expected: build and validation pass.

- [ ] **Step 4: Preview locally**

Run a local static server:

```bash
npx serve dist
```

Open the local preview and check:
- English homepage
- Arabic homepage
- one product page
- one blog article
- contact form
- mobile navigation

- [ ] **Step 5: Commit**

```bash
git add docs/qa-launch-checklist.md src/validate.js dist
git commit -m "test: add static site launch validation"
```

---

## Execution Order

Recommended order:
1. Build skeleton.
2. Inventory and asset capture.
3. Shared data model.
4. Templates and layout.
5. English root site.
6. Localized language batches.
7. Blog channel.
8. Inquiry form/email.
9. Cloudflare deployment.
10. QA and launch.

Do not start mass translation before the English product facts and page templates pass validation. Rework the English acquisition copy first, then localize from the approved meaning, not sentence-by-sentence translation.

---

## Self-Review

Spec coverage:
- Complete copy of source structure: covered by Tasks 2, 4, and 5.
- English homepage: covered by Task 5.
- 19 additional languages: covered by Task 6.
- No Chinese site: covered by Tasks 3, 4, 6, 9, and 10 validation.
- Native localization for units, numbers, currency, voltage, dates, address: covered by Task 3 and Task 6.
- Blog channel for product keyword updates: covered by Task 7.
- Google acquisition SEO with long-tail keywords: covered by SEO Strategy and Task 7.
- Static HTML only, Cloudflare deploy, no database: covered by Architecture, Tasks 1, 8, and 9.
- Email or direct email forms: covered by Task 8.

Known risks:
- Exact keyword volume and competition require live SEO tooling such as Google Keyword Planner, Ahrefs, Semrush, LowFruits, or Search Console after launch. The plan uses buyer-intent keyword logic until those tools are connected.
- Native-quality localization should be reviewed by a human native speaker or a trusted local reviewer for each market before paid traffic or heavy outreach.
- Product technical specs from the source site contain typos and may be incomplete; confirm final specs with engineering before publishing.
