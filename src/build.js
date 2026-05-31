import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import locales from "./data/locales.json" with { type: "json" };
import site from "./data/site.json" with { type: "json" };
import keywords from "./data/seo-keywords.json" with { type: "json" };
import { blogTopics, localized, uiText } from "./content/localized.js";
import { pagePath, renderPage } from "./templates/page.js";
import { breadcrumbs, inquiryForm, layout, productCard, productJsonLd, specTable } from "./templates/components.js";

const dist = path.resolve("dist");
const generatedPaths = [];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp("assets", path.join(dist, "assets"), { recursive: true });

function outputPath(publicPath) {
  const clean = publicPath === "/" ? "/index.html" : `${publicPath.replace(/\/$/, "")}/index.html`;
  return path.join(dist, clean);
}

async function writePage(publicPath, html) {
  const file = outputPath(publicPath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  generatedPaths.push(publicPath);
}

function alternatesFor(slug = "") {
  return locales.map((locale) => ({ code: locale.code, path: pagePath(locale, slug) }));
}

function titleFor(locale, labels, pageTitle) {
  return `${pageTitle} | ${site.brand}`;
}

function descriptionFor(labels, extra = "") {
  return `${labels.heroText} ${extra}`.trim().slice(0, 155);
}

function articleExcerpt(labels, topic, product) {
  return `${topic.title[currentCode] || topic.title.en} covers material choice, working width, speed, power supply and quotation questions for ${labels.productNames[product.id]}.`;
}

let currentCode = "en";

for (const locale of locales) {
  currentCode = locale.code;
  const labels = localized[locale.code];
  const ui = uiText[locale.code];
  const langPrefix = locale.path ? `/${locale.path}` : "";

  const orgJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": site.company,
    "brand": site.brand,
    "url": `${site.domain}${pagePath(locale)}`,
    "email": site.email,
    "telephone": site.phone,
    "address": site.address
  };

  const homeMain = `<section class="hero hero-conversion">
    <div class="hero-inner">
      <div class="hero-copy">
        <h1>${labels.heroTitle}</h1>
        <p>${labels.heroText}</p>
        ${proofStrip(locale, labels, ui)}
        <div class="hero-actions">
          <a class="button button-secondary" href="${pagePath(locale, "contact")}">${labels.quote}</a>
          <a class="button" href="${pagePath(locale, "products")}">${labels.nav[1]}</a>
        </div>
      </div>
      <div class="hero-form">
        <div class="hero-form-head">
          <h2>${labels.contactTitle}</h2>
          <p>${labels.formIntro}</p>
        </div>
        ${inquiryForm(locale, labels, ui)}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="section-heading">
      <h2>${labels.productsTitle}</h2>
      <p class="lead">${labels.marketNote}</p>
    </div>
    ${applicationCards(locale, labels)}
  </section>
  <section class="band"><div class="section">
    <div class="section-heading">
      <h2>${ui.confirm}</h2>
      <p class="lead">${labels.formIntro}</p>
    </div>
    ${quoteChecklist(locale, ui)}
  </div></section>
  <section class="section">
    <div class="section-heading">
      <h2>${labels.aboutTitle}</h2>
      <p class="lead">${companyIntro(locale, labels, ui)}</p>
    </div>
    ${proofGrid(locale, labels, ui)}
    ${processSteps(locale, labels, ui)}
  </section>
  <section class="section">
    <h2>${labels.nav[1]}</h2>
    <p class="lead">${labels.marketNote}</p>
    <div class="product-grid">${site.products.map((product) => productCard(locale, labels, product, materialText(locale, product))).join("")}</div>
  </section>
  <section class="section">
    <h2>${labels.blogTitle}</h2>
    <div class="blog-grid">${blogTopics.map((topic) => blogCard(locale, labels, topic)).join("")}</div>
  </section>`;
  await writePage(pagePath(locale), renderPage({
    locale,
    labels,
    title: titleFor(locale, labels, labels.heroTitle),
    description: descriptionFor(labels),
    path: pagePath(locale),
    alternates: alternatesFor(),
    content: layout(locale, labels, locales, homeMain),
    jsonLd: [orgJson]
  }));

  const productsMain = `<section class="section">
    ${breadcrumbs(locale, [{ label: labels.nav[0], href: pagePath(locale) }, { label: labels.nav[1] }])}
    <h1>${labels.productsTitle}</h1>
    <p class="lead">${labels.marketNote}</p>
    <div class="product-grid">${site.products.map((product) => productCard(locale, labels, product, materialText(locale, product))).join("")}</div>
  </section>`;
  await writePage(pagePath(locale, "products"), renderPage({
    locale,
    labels,
    title: titleFor(locale, labels, labels.productsTitle),
    description: descriptionFor(labels, Object.values(labels.productNames).join(", ")),
    path: pagePath(locale, "products"),
    alternates: alternatesFor("products"),
    content: layout(locale, labels, locales, productsMain),
    jsonLd: [orgJson]
  }));

  for (const product of site.products) {
    const productName = labels.productNames[product.id];
    const productMain = `<section class="section">
      ${breadcrumbs(locale, [
        { label: labels.nav[0], href: pagePath(locale) },
        { label: labels.nav[1], href: pagePath(locale, "products") },
        { label: productName }
      ])}
      <div class="split">
        <div>
          <h1>${productName}</h1>
          <p class="lead">${productIntro(locale, labels, product)}</p>
          <img src="${product.image}" alt="${productName}">
          ${productLeadBlock(locale, labels, ui, product)}
          <h2>${ui.specs}</h2>
          ${specTable(specRows(locale, ui, product))}
          ${productDecisionBlock(locale, labels, ui, product)}
          <h2>${ui.keywords}</h2>
          <p>${localizedKeywords(locale, labels, product).join(", ")}</p>
          <div class="cta-band">
            <div>
              <h2>${labels.contactTitle}</h2>
              <p>${labels.formIntro}</p>
            </div>
            <a class="button button-secondary" href="${pagePath(locale, "contact")}">${labels.quote}</a>
          </div>
        </div>
        <aside>
          <h2>${labels.contactTitle}</h2>
          <p>${labels.formIntro}</p>
          ${quoteChecklist(locale, ui, "compact")}
          ${inquiryForm(locale, labels, ui, productName)}
        </aside>
      </div>
    </section>`;
    await writePage(pagePath(locale, `products/${product.id}`), renderPage({
      locale,
      labels,
      title: titleFor(locale, labels, productName),
      description: `${productName}: ${materialText(locale, product)}. ${labels.marketNote}`.slice(0, 155),
      path: pagePath(locale, `products/${product.id}`),
      alternates: alternatesFor(`products/${product.id}`),
      content: layout(locale, labels, locales, productMain),
      jsonLd: [productJsonLd(locale, labels, product, materialText(locale, product))]
    }));
  }

  const aboutMain = `<section class="section section-narrow">
    ${breadcrumbs(locale, [{ label: labels.nav[0], href: pagePath(locale) }, { label: labels.nav[2] }])}
    <h1>${labels.aboutTitle}</h1>
    <p class="lead">${companyIntro(locale, labels, ui)}</p>
    <p>${labels.formIntro}</p>
    <p>${site.address}</p>
    <p>${labels.marketNote}</p>
  </section>`;
  await writePage(pagePath(locale, "about"), renderPage({
    locale,
    labels,
    title: titleFor(locale, labels, labels.aboutTitle),
    description: aboutDescription(locale, labels, ui),
    path: pagePath(locale, "about"),
    alternates: alternatesFor("about"),
    content: layout(locale, labels, locales, aboutMain),
    jsonLd: [orgJson]
  }));

  const contactMain = `<section class="section">
    ${breadcrumbs(locale, [{ label: labels.nav[0], href: pagePath(locale) }, { label: labels.nav[4] }])}
    <div class="split">
      <div>
        <h1>${labels.contactTitle}</h1>
        <p class="lead">${labels.formIntro}</p>
        <p><strong>${site.company}</strong><br>${site.address}</p>
        <p><strong>Tel:</strong> <a href="tel:${site.phone}">${site.phone}</a><br>
        <strong>Mobile:</strong> <a href="https://wa.me/${site.mobile.replace(/\D/g, "")}">${site.mobile}</a><br>
        <strong>Email:</strong> <a href="mailto:${site.email}">${site.email}</a></p>
      </div>
      <aside>${inquiryForm(locale, labels, ui)}</aside>
    </div>
  </section>`;
  await writePage(pagePath(locale, "contact"), renderPage({
    locale,
    labels,
    title: titleFor(locale, labels, labels.contactTitle),
    description: `${labels.formIntro} ${site.email}`.slice(0, 155),
    path: pagePath(locale, "contact"),
    alternates: alternatesFor("contact"),
    content: layout(locale, labels, locales, contactMain),
    jsonLd: [orgJson]
  }));

  const blogMain = `<section class="section">
    ${breadcrumbs(locale, [{ label: labels.nav[0], href: pagePath(locale) }, { label: labels.nav[3] }])}
    <h1>${labels.blogTitle}</h1>
    <p class="lead">${labels.marketNote}</p>
    <div class="blog-grid">${blogTopics.map((topic) => blogCard(locale, labels, topic)).join("")}</div>
  </section>`;
  await writePage(pagePath(locale, "blog"), renderPage({
    locale,
    labels,
    title: titleFor(locale, labels, labels.blogTitle),
    description: descriptionFor(labels, "Blog articles about PVC film machinery, laminating lines and quotation preparation."),
    path: pagePath(locale, "blog"),
    alternates: alternatesFor("blog"),
    content: layout(locale, labels, locales, blogMain),
    jsonLd: [orgJson]
  }));

  for (const topic of blogTopics) {
    const product = site.products.find((item) => item.id === topic.product);
    const title = topic.title[locale.code] || topic.title.en;
    const productName = labels.productNames[product.id];
    const articleMain = `<article class="section section-narrow">
      ${breadcrumbs(locale, [
        { label: labels.nav[0], href: pagePath(locale) },
        { label: labels.nav[3], href: pagePath(locale, "blog") },
        { label: title }
      ])}
      <h1>${title}</h1>
      <p class="lead">${articleExcerptFor(labels, title, productName)}</p>
      <h2>1. ${ui.match}</h2>
      <p>${labels.formIntro} ${productName}: ${materialText(locale, product)}.</p>
      <h2>2. ${ui.confirm}</h2>
      <p>${ui.width}, ${ui.speed}, m/min, ${ui.voltage}. ${labels.marketNote}</p>
      <h2>3. ${ui.power}</h2>
      <p>${labels.marketNote} 380 V, 50 Hz, 415 V, 50 Hz, 440 V, 60 Hz.</p>
      <h2>4. ${ui.layout}</h2>
      <p>${labels.contactTitle}. ${labels.formIntro}</p>
      <p><a class="button" href="${pagePath(locale, `products/${product.id}`)}">${productName}</a> <a class="button button-secondary" href="${pagePath(locale, "contact")}">${labels.quote}</a></p>
    </article>`;
    await writePage(pagePath(locale, `blog/${topic.slug}`), renderPage({
      locale,
      labels,
      title: titleFor(locale, labels, title),
      description: articleExcerptFor(labels, title, productName).slice(0, 155),
      path: pagePath(locale, `blog/${topic.slug}`),
      alternates: alternatesFor(`blog/${topic.slug}`),
      content: layout(locale, labels, locales, articleMain),
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "datePublished": "2026-05-31",
        "dateModified": "2026-05-31",
        "author": { "@type": "Organization", "name": site.brand },
        "mainEntityOfPage": `${site.domain}${pagePath(locale, `blog/${topic.slug}`)}`
      }]
    }));
  }

  if (!locale.path && langPrefix !== "") {
    throw new Error("English root must not be generated under /en/");
  }
}

await writeSupportFiles();
await writeContentCalendarData();

console.log(`Generated ${generatedPaths.length} pages in dist/`);

function blogCard(locale, labels, topic) {
  const title = topic.title[locale.code] || topic.title.en;
  const product = site.products.find((item) => item.id === topic.product);
  return `<article class="blog-card">
    <h3><a href="${pagePath(locale, `blog/${topic.slug}`)}">${title}</a></h3>
    <p>${articleExcerptFor(labels, title, labels.productNames[product.id])}</p>
    <a href="${pagePath(locale, `blog/${topic.slug}`)}">${labels.readMore}</a>
  </article>`;
}

function articleExcerptFor(labels, title, productName) {
  return `${title}: ${labels.formIntro} ${labels.marketNote} ${productName}.`;
}

function proofStrip(locale, labels, ui) {
  const items = [
    [String(site.founded), ui.experience || labels.aboutTitle],
    [formatArea(locale), ui.factory || labels.aboutTitle],
    [String(site.products.length), labels.productsTitle]
  ];
  return `<div class="proof-strip">${items.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}</div>`;
}

function proofGrid(locale, labels, ui) {
  const items = [
    [String(site.founded), ui.experience || labels.aboutTitle],
    [formatArea(locale), ui.factory || labels.aboutTitle],
    [String(site.products.length), labels.productsTitle],
    ["380/415/440 V", ui.voltage]
  ];
  return `<div class="metric-grid">${items.map(([value, label]) => `<div class="metric-card"><strong>${value}</strong><span>${label}</span></div>`).join("")}</div>`;
}

function applicationCards(locale, labels) {
  return `<div class="application-grid">${site.products.map((product) => {
    const name = labels.productNames[product.id];
    return `<article class="application-card">
      <img src="${product.image}" alt="${name}">
      <div>
        <h3>${name}</h3>
        <p>${materialText(locale, product)}</p>
        <a href="${pagePath(locale, `products/${product.id}`)}">${labels.readMore}</a>
      </div>
    </article>`;
  }).join("")}</div>`;
}

function quoteChecklist(locale, ui, mode = "") {
  const items = [ui.material, ui.width, ui.speed, ui.voltage, ui.country, ui.message];
  return `<div class="checklist-grid ${mode === "compact" ? "checklist-compact" : ""}">${items.map((item) => `<div class="check-item"><span></span>${item}</div>`).join("")}</div>`;
}

function processSteps(locale, labels, ui) {
  const steps = [ui.match, ui.confirm, ui.power, ui.layout];
  return `<div class="process-grid">${steps.map((step, index) => `<div class="process-step"><span>${new Intl.NumberFormat(locale.code).format(index + 1)}</span><h3>${step}</h3><p>${labels.formIntro}</p></div>`).join("")}</div>`;
}

function productLeadBlock(locale, labels, ui, product) {
  const name = labels.productNames[product.id];
  const points = [materialText(locale, product), product.specs.width || product.specs.application || product.specs.line || ui.width, product.specs.speed || product.specs.voltage || ui.speed];
  return `<div class="buyer-panel">
    <h2>${labels.contactTitle}</h2>
    <p>${productIntro(locale, labels, product)}</p>
    <div class="decision-grid">${points.map((point) => `<div class="decision-card"><strong>${name}</strong><span>${point}</span></div>`).join("")}</div>
  </div>`;
}

function productDecisionBlock(locale, labels, ui, product) {
  const rows = [
    [ui.match, materialText(locale, product)],
    [ui.confirm, `${ui.width}, ${ui.speed}, ${ui.voltage}`],
    [ui.power, product.specs.voltage || "380 V, 50 Hz"],
    [ui.layout, labels.formIntro]
  ];
  return `<div class="buyer-panel buyer-panel-soft">
    <h2>${ui.match}</h2>
    <div class="decision-grid">${rows.map(([title, body]) => `<div class="decision-card"><strong>${title}</strong><span>${body}</span></div>`).join("")}</div>
  </div>`;
}

function specRows(locale, ui, product) {
  const rows = [[ui.material, materialText(locale, product)]];
  if (product.specs.width) rows.push([ui.width, product.specs.width]);
  if (product.specs.speed) rows.push([ui.speed, product.specs.speed]);
  if (product.specs.voltage) rows.push([ui.voltage, product.specs.voltage]);
  if (product.specs.power) rows.push([powerLabel(locale), product.specs.power]);
  rows.push([ui.country, localized[locale.code].marketNote]);
  return rows;
}

function formatArea(locale) {
  const formatted = new Intl.NumberFormat(locale.code, { maximumFractionDigits: 0 }).format(site.factoryAreaM2);
  return `${formatted} m2`;
}

function materialText(locale, product) {
  const table = {
    en: ["PVC, PE, BOPP, CPP, flexible film and cloth", "PVC film, tarpaulin, tent fabric and flex banner", "PVC decorative film, wood grain film and edge banding film", "PVC, PE, semi-rigid film and rigid film"],
    es: ["PVC, PE, BOPP, CPP, película flexible y tejido", "película PVC, lona, tejido para carpas y flex banner", "film decorativo PVC, film imitación madera y canto", "PVC, PE, film semirrígido y film rígido"],
    ar: ["PVC وPE وBOPP وCPP وأفلام مرنة وقماش", "فيلم PVC ومشمع وقماش خيام وفلكس إعلاني", "أفلام ديكور PVC وأفلام نقش الخشب وأشرطة الحواف", "PVC وPE وأفلام شبه صلبة وصلبة"],
    fr: ["PVC, PE, BOPP, CPP, film souple et tissu", "film PVC, bâche, toile de tente et flex banner", "film décoratif PVC, film imitation bois et chant", "PVC, PE, film semi-rigide et film rigide"],
    ru: ["PVC, PE, BOPP, CPP, гибкая пленка и ткань", "ПВХ-пленка, тент, палаточная ткань и баннерный материал", "ПВХ-декор пленка, пленка под дерево и кромочная лента", "PVC, PE, полужесткая и жесткая пленка"],
    pt: ["PVC, PE, BOPP, CPP, filme flexível e tecido", "filme PVC, lona, tecido para tendas e flex banner", "filme decorativo PVC, filme amadeirado e fita de borda", "PVC, PE, filme semirrígido e filme rígido"],
    de: ["PVC, PE, BOPP, CPP, flexible Folie und Gewebe", "PVC-Folie, Plane, Zeltgewebe und Flexbanner", "PVC-Dekorfolie, Holzdekorfolie und Kantenbandfolie", "PVC, PE, halbstarre Folie und starre Folie"],
    vi: ["PVC, PE, BOPP, CPP, màng mềm và vải", "màng PVC, bạt, vải lều và flex banner", "màng trang trí PVC, màng vân gỗ và màng nẹp cạnh", "PVC, PE, màng bán cứng và màng cứng"],
    ja: ["PVC、PE、BOPP、CPP、軟包装フィルム、布材", "PVCフィルム、ターポリン、テント生地、フレックスバナー", "PVC化粧フィルム、木目フィルム、エッジ材フィルム", "PVC、PE、半硬質フィルム、硬質フィルム"],
    ko: ["PVC, PE, BOPP, CPP, 연포장 필름 및 원단", "PVC 필름, 타포린, 텐트 원단, 플렉스 배너", "PVC 데코 필름, 우드그레인 필름, 엣지밴딩 필름", "PVC, PE, 반경질 필름, 경질 필름"],
    it: ["PVC, PE, BOPP, CPP, film flessibile e tessuto", "film PVC, telone, tessuto per tende e flex banner", "film decorativo PVC, film effetto legno e film bordo", "PVC, PE, film semirigido e film rigido"],
    tr: ["PVC, PE, BOPP, CPP, esnek film ve kumaş", "PVC film, branda, çadır kumaşı ve flex banner", "PVC dekoratif film, ahşap desen film ve kenar bandı filmi", "PVC, PE, yarı sert film ve sert film"],
    pl: ["PVC, PE, BOPP, CPP, folia elastyczna i tkanina", "folia PVC, plandeka, tkanina namiotowa i baner flex", "folia dekoracyjna PVC, folia drewnopodobna i folia obrzeżowa", "PVC, PE, folia półsztywna i sztywna"],
    th: ["PVC, PE, BOPP, CPP, ฟิล์มอ่อนและผ้า", "ฟิล์ม PVC, ผ้าใบ, ผ้าเต็นท์ และ flex banner", "ฟิล์มตกแต่ง PVC, ฟิล์มลายไม้ และฟิล์มขอบ", "PVC, PE, ฟิล์มกึ่งแข็ง และฟิล์มแข็ง"],
    id: ["PVC, PE, BOPP, CPP, film fleksibel dan kain", "film PVC, terpal, kain tenda dan flex banner", "film dekoratif PVC, film motif kayu dan film edge banding", "PVC, PE, film semi-kaku dan film kaku"],
    hi: ["PVC, PE, BOPP, CPP, फ्लेक्सिबल फिल्म और कपड़ा", "PVC फिल्म, तिरपाल, टेंट कपड़ा और फ्लेक्स बैनर", "PVC डेकोरेटिव फिल्म, वुड ग्रेन फिल्म और एज बैंडिंग फिल्म", "PVC, PE, सेमी-रिजिड फिल्म और रिजिड फिल्म"],
    ms: ["PVC, PE, BOPP, CPP, filem fleksibel dan kain", "filem PVC, tarpaulin, kain khemah dan flex banner", "filem dekoratif PVC, filem corak kayu dan filem edge banding", "PVC, PE, filem separa tegar dan filem tegar"],
    nl: ["PVC, PE, BOPP, CPP, flexibele folie en doek", "PVC-folie, dekzeil, tentdoek en flexbanner", "PVC-decorfolie, houtnerffolie en kantenbandfolie", "PVC, PE, halfstijve folie en stijve folie"],
    bn: ["PVC, PE, BOPP, CPP, ফ্লেক্সিবল ফিল্ম ও কাপড়", "PVC ফিল্ম, ত্রিপল, তাঁবুর কাপড় ও ফ্লেক্স ব্যানার", "PVC ডেকোরেটিভ ফিল্ম, উড গ্রেইন ফিল্ম ও এজ ব্যান্ডিং ফিল্ম", "PVC, PE, সেমি-রিজিড ফিল্ম ও রিজিড ফিল্ম"],
    sv: ["PVC, PE, BOPP, CPP, flexibel film och väv", "PVC-film, presenning, tältduk och flexbanner", "PVC-dekorfilm, träfilmsfolie och kantbandsfilm", "PVC, PE, halvstyv film och styv film"]
  };
  const index = site.products.findIndex((item) => item.id === product.id);
  return (table[locale.code] || table.en)[index];
}

function productIntro(locale, labels, product) {
  const name = labels.productNames[product.id];
  const materials = materialText(locale, product);
  const templates = {
    en: `${name} is configured for ${materials}. ${labels.marketNote}`,
    es: `${name} se configura para ${materials}. ${labels.marketNote}`,
    ar: `يتم تجهيز ${name} لمواد مثل ${materials}. ${labels.marketNote}`,
    fr: `${name} est configurée pour ${materials}. ${labels.marketNote}`,
    ru: `${name} подбирается для материалов: ${materials}. ${labels.marketNote}`,
    pt: `${name} é configurada para ${materials}. ${labels.marketNote}`,
    de: `${name} wird für ${materials} ausgelegt. ${labels.marketNote}`,
    vi: `${name} được cấu hình cho ${materials}. ${labels.marketNote}`,
    ja: `${name}は${materials}向けに構成できます。${labels.marketNote}`,
    ko: `${name}는 ${materials}에 맞춰 구성됩니다. ${labels.marketNote}`,
    it: `${name} viene configurata per ${materials}. ${labels.marketNote}`,
    tr: `${name}, ${materials} için yapılandırılır. ${labels.marketNote}`,
    pl: `${name} dobiera się do materiałów: ${materials}. ${labels.marketNote}`,
    th: `${name} ปรับสเปกสำหรับ ${materials}. ${labels.marketNote}`,
    id: `${name} dikonfigurasi untuk ${materials}. ${labels.marketNote}`,
    hi: `${name} को ${materials} के लिए कॉन्फ़िगर किया जाता है। ${labels.marketNote}`,
    ms: `${name} dikonfigurasi untuk ${materials}. ${labels.marketNote}`,
    nl: `${name} wordt geconfigureerd voor ${materials}. ${labels.marketNote}`,
    bn: `${name} ${materials}-এর জন্য কনফিগার করা হয়। ${labels.marketNote}`,
    sv: `${name} konfigureras för ${materials}. ${labels.marketNote}`
  };
  return templates[locale.code] || templates.en;
}

function localizedKeywords(locale, labels, product) {
  if (locale.code === "en") return keywords[product.id];
  const name = labels.productNames[product.id];
  const suffixes = {
    es: ["fabricante", "proveedor", "precio", "cotización"], ar: ["مصنع", "مورد", "سعر", "عرض سعر"],
    fr: ["fabricant", "fournisseur", "prix", "devis"], ru: ["производитель", "поставщик", "цена", "предложение"],
    pt: ["fabricante", "fornecedor", "preço", "cotação"], de: ["Hersteller", "Lieferant", "Preis", "Angebot"],
    vi: ["nhà sản xuất", "nhà cung cấp", "giá", "báo giá"], ja: ["メーカー", "サプライヤー", "価格", "見積"],
    ko: ["제조사", "공급업체", "가격", "견적"], it: ["produttore", "fornitore", "prezzo", "preventivo"],
    tr: ["üretici", "tedarikçi", "fiyat", "teklif"], pl: ["producent", "dostawca", "cena", "oferta"],
    th: ["ผู้ผลิต", "ซัพพลายเออร์", "ราคา", "ใบเสนอราคา"], id: ["produsen", "pemasok", "harga", "penawaran"],
    hi: ["निर्माता", "सप्लायर", "कीमत", "कोटेशन"], ms: ["pengeluar", "pembekal", "harga", "sebut harga"],
    nl: ["fabrikant", "leverancier", "prijs", "offerte"], bn: ["প্রস্তুতকারক", "সরবরাহকারী", "দাম", "কোটেশন"],
    sv: ["tillverkare", "leverantör", "pris", "offert"]
  }[locale.code] || ["manufacturer", "supplier", "price", "quotation"];
  return [`${name} ${suffixes[0]}`, `${name} ${suffixes[1]}`, `${name} ${suffixes[2]}`, `${name} ${suffixes[3]}`, `${name} ${materialText(locale, product)}`];
}

function powerLabel(locale) {
  return ({
    en: "Power", es: "Potencia", ar: "القدرة", fr: "Puissance", ru: "Мощность", pt: "Potência",
    de: "Leistung", vi: "Công suất", ja: "出力", ko: "전력", it: "Potenza", tr: "Güç",
    pl: "Moc", th: "กำลังไฟ", id: "Daya", hi: "पावर", ms: "Kuasa", nl: "Vermogen",
    bn: "পাওয়ার", sv: "Effekt"
  })[locale.code] || "Power";
}

async function writeSupportFiles() {
  await writeFile(path.join(dist, "_headers"), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);

  await writeFile(path.join(dist, "_redirects"), `/en/* /:splat 301
/zh/* / 302
/cn/* / 302
/products/pvc-tarpaulin-laminating-machine/ /products/tarpaulin-laminating-machine/ 301
/:locale/products/pvc-tarpaulin-laminating-machine/ /:locale/products/tarpaulin-laminating-machine/ 301
`);

  await writeFile(path.join(dist, "robots.txt"), `User-agent: *
Allow: /
Sitemap: ${site.domain}/sitemap.xml
`);

  await writeFile(path.join(dist, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#0d47a1"/>
  <path d="M12 18h16v10H12zM36 18h16v10H36zM12 36h16v10H12zM36 36h16v10H36z" fill="#fff"/>
  <path d="M28 23h8M28 41h8" stroke="#ffb000" stroke-width="5"/>
</svg>
`);

  const sitemapUrls = generatedPaths
    .map((urlPath) => {
      const slug = slugFromPath(urlPath);
      const alternates = alternatesFor(slug)
        .map((item) => `    <xhtml:link rel="alternate" hreflang="${item.code}" href="${site.domain}${item.path}"/>`)
        .join("\n");
      const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${site.domain}${pagePath(locales[0], slug)}"/>`;
      return `  <url>
    <loc>${site.domain}${urlPath}</loc>
    <lastmod>2026-05-31</lastmod>
${alternates}
${xDefault}
  </url>`;
    })
    .join("\n");
  await writeFile(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls}
</urlset>
`);
}

async function writeContentCalendarData() {
  const calendar = [
    ["tarpaulin-laminating-machine", "PVC tarpaulin laminating machine buying guide", "commercial"],
    ["tarpaulin-laminating-machine", "1600 mm vs 2000 mm PVC tarpaulin laminating line", "specification"],
    ["tarpaulin-laminating-machine", "Hot oil heating or electric heating for PVC laminating", "comparison"],
    ["tarpaulin-laminating-machine", "Flex banner laminating machine quotation checklist", "quotation"],
    ["gravure-printing-machine", "PVC film gravure printing machine for flexible packaging", "commercial"],
    ["gravure-printing-machine", "BOPP CPP PE film gravure printer material guide", "material"],
    ["gravure-printing-machine", "Shaftless gravure printing machine buyer questions", "comparison"],
    ["gravure-printing-machine", "Ink drying and tension control in film printing lines", "technical"],
    ["calender-winder", "Automatic calender winder for PVC sheet lines", "commercial"],
    ["calender-winder", "How to choose winding width and roll diameter", "specification"],
    ["calender-winder", "Automatic cutter options for center winding machines", "technical"],
    ["calender-winder", "PVC PE film rewinding machine maintenance checklist", "maintenance"],
    ["furniture-film-laminating-machine", "Furniture film laminating machine for wood grain film", "commercial"],
    ["furniture-film-laminating-machine", "PVC decorative film line layout checklist", "layout"],
    ["furniture-film-laminating-machine", "Edge banding film laminating and rewinding options", "application"],
    ["furniture-film-laminating-machine", "Furniture film laminating line quotation factors", "quotation"]
  ];
  const localizedCalendar = locales.map((locale) => ({
    locale: locale.code,
    path: pagePath(locale, "blog"),
    currency: locale.currency,
    dateExample: locale.date,
    topics: calendar.map(([productId, title, intent], index) => ({
      month: `2026-${String(Math.floor(index / 4) + 6).padStart(2, "0")}`,
      productId,
      intent,
      seedTitle: title,
      primaryKeywords: localizedKeywords(locale, localized[locale.code], site.products.find((product) => product.id === productId)),
      targetProductPage: pagePath(locale, `products/${productId}`)
    }))
  }));
  await writeFile(path.join(dist, "blog-calendar.json"), `${JSON.stringify(localizedCalendar, null, 2)}\n`);
}

function slugFromPath(urlPath) {
  const parts = urlPath.split("/").filter(Boolean);
  if (!parts.length) return "";
  const localeCodes = new Set(locales.map((locale) => locale.path).filter(Boolean));
  if (localeCodes.has(parts[0])) {
    return parts.slice(1).join("/");
  }
  return parts.join("/");
}

function aboutDescription(locale, labels, ui) {
  const descriptions = {
    en: `${site.company}, founded in ${site.founded}, builds film printing, laminating, coating and winding machinery.`,
    es: `${site.company}: maquinaria para film PVC, lona y empaque flexible desde ${site.founded}.`,
    ar: `${site.company}: معدات أفلام PVC والمشمع والتغليف المرن منذ ${site.founded}.`,
    fr: `${site.company}: machines pour film PVC, bâche et emballage souple depuis ${site.founded}.`,
    ru: `${site.company}: оборудование для ПВХ-пленки, тента и гибкой упаковки с ${site.founded} года.`,
    pt: `${site.company}: máquinas para filme PVC, lona e embalagem flexível desde ${site.founded}.`,
    de: `${site.company}: Maschinen für PVC-Folie, Planen und flexible Verpackung seit ${site.founded}.`,
    vi: `${site.company}: máy cho màng PVC, bạt và bao bì mềm từ năm ${site.founded}.`,
    ja: `${site.company}: ${site.founded}年からPVCフィルム、ターポリン、軟包装向け設備を設計。`,
    ko: `${site.company}: ${site.founded}년부터 PVC 필름, 타포린, 연포장 설비를 제작.`,
    it: `${site.company}: macchine per film PVC, teloni e imballaggio flessibile dal ${site.founded}.`,
    tr: `${site.company}: ${site.founded}'den beri PVC film, branda ve esnek ambalaj makineleri.`,
    pl: `${site.company}: maszyny do folii PVC, plandek i opakowań elastycznych od ${site.founded} roku.`,
    th: `${site.company}: เครื่องจักรฟิล์ม PVC ผ้าใบ และบรรจุภัณฑ์อ่อน ตั้งแต่ปี ${site.founded}`,
    id: `${site.company}: mesin film PVC, terpal, dan kemasan fleksibel sejak ${site.founded}.`,
    hi: `${site.company}: ${site.founded} से PVC फिल्म, तिरपाल और पैकेजिंग मशीनें।`,
    ms: `${site.company}: mesin filem PVC, tarpaulin dan pembungkusan fleksibel sejak ${site.founded}.`,
    nl: `${site.company}: machines voor PVC-folie, dekzeil en flexibele verpakking sinds ${site.founded}.`,
    bn: `${site.company}: ${site.founded} সাল থেকে PVC ফিল্ম, ত্রিপল ও প্যাকেজিং মেশিন।`,
    sv: `${site.company}: maskiner för PVC-film, presenning och flexibel förpackning sedan ${site.founded}.`
  };
  return (descriptions[locale.code] || `${site.company}. ${labels.aboutTitle}. ${ui.experience || labels.marketNote}`).slice(0, 180);
}

function companyIntro(locale, labels, ui) {
  const intros = {
    en: `${site.company} has a ${formatArea(locale)} Foshan production base and export experience in film, PVC, tarpaulin and synthetic leather machinery.`,
    es: `${site.company} cuenta con una base de producción de ${formatArea(locale)} en Foshan y experiencia exportadora en maquinaria para film, PVC, lona y cuero sintético.`,
    ar: `تمتلك ${site.company} قاعدة إنتاج في فوشان بمساحة ${formatArea(locale)} وخبرة تصدير في معدات الأفلام وPVC والمشمع والجلد الصناعي.`,
    fr: `${site.company} dispose d'une base de production de ${formatArea(locale)} à Foshan et d'une expérience export dans les machines pour film, PVC, bâche et cuir synthétique.`,
    ru: `${site.company} имеет производственную базу ${formatArea(locale)} в Фошане и экспортный опыт по оборудованию для пленки, PVC, тента и искусственной кожи.`,
    pt: `${site.company} tem uma base produtiva de ${formatArea(locale)} em Foshan e experiência de exportação em máquinas para filme, PVC, lona e couro sintético.`,
    de: `${site.company} verfügt über eine Produktionsbasis mit ${formatArea(locale)} in Foshan und Exporterfahrung bei Maschinen für Folie, PVC, Plane und Kunstleder.`,
    vi: `${site.company} có cơ sở sản xuất ${formatArea(locale)} tại Phật Sơn và kinh nghiệm xuất khẩu máy cho màng, PVC, bạt và da nhân tạo.`,
    ja: `${site.company}は佛山に${formatArea(locale)}の生産拠点を持ち、フィルム、PVC、ターポリン、合成皮革設備の輸出経験があります。`,
    ko: `${site.company}는 포산에 ${formatArea(locale)} 생산 기반을 갖추고 필름, PVC, 타포린, 인조가죽 설비 수출 경험을 보유하고 있습니다.`,
    it: `${site.company} dispone di una base produttiva di ${formatArea(locale)} a Foshan ed esperienza export in macchine per film, PVC, teloni e pelle sintetica.`,
    tr: `${site.company}, Foshan'da ${formatArea(locale)} üretim alanına ve film, PVC, branda, suni deri makinelerinde ihracat deneyimine sahiptir.`,
    pl: `${site.company} ma bazę produkcyjną ${formatArea(locale)} w Foshan oraz doświadczenie eksportowe w maszynach do folii, PVC, plandek i skóry syntetycznej.`,
    th: `${site.company} มีฐานการผลิต ${formatArea(locale)} ในฝอซาน และมีประสบการณ์ส่งออกเครื่องจักรสำหรับฟิล์ม PVC ผ้าใบ และหนังเทียม`,
    id: `${site.company} memiliki basis produksi ${formatArea(locale)} di Foshan dan pengalaman ekspor mesin film, PVC, terpal, serta kulit sintetis.`,
    hi: `${site.company} के पास फोशान में ${formatArea(locale)} उत्पादन आधार है और फिल्म, PVC, तिरपाल व सिंथेटिक लेदर मशीनों का निर्यात अनुभव है।`,
    ms: `${site.company} mempunyai tapak pengeluaran ${formatArea(locale)} di Foshan dan pengalaman eksport mesin filem, PVC, tarpaulin serta kulit sintetik.`,
    nl: `${site.company} heeft een productiebasis van ${formatArea(locale)} in Foshan en exportervaring met machines voor folie, PVC, dekzeil en kunstleer.`,
    bn: `${site.company}-এর ফোশানে ${formatArea(locale)} উৎপাদনভিত্তি রয়েছে এবং ফিল্ম, PVC, ত্রিপল ও সিন্থেটিক লেদার মেশিন রপ্তানির অভিজ্ঞতা আছে।`,
    sv: `${site.company} har en produktionsbas på ${formatArea(locale)} i Foshan och exportvana inom maskiner för film, PVC, presenning och syntetläder.`
  };
  return intros[locale.code] || `${site.company}. ${ui.factory || labels.aboutTitle}: ${formatArea(locale)}. ${ui.experience || labels.marketNote}`;
}
