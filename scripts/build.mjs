// Static site generator for LM Media Solutions (no dependencies).
// Usage: npm run generate  (node scripts/build.mjs)
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as c from "../src/content.mjs";
import { articles, categories } from "../src/blog.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { site } = c;
const today = new Date().toISOString().slice(0, 10);
const written = [];

// ---------- helpers ----------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (path) => site.url + path;
const waLink = (text = "Hi LM Media Solutions, I would like to discuss a project.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
const contactFor = (service) => `/contact/?service=${encodeURIComponent(service)}#enquiry`;
const formatDate = (d) => new Date(d + "T00:00:00Z").toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const sortedArticles = [...articles].sort((a, b) => b.published.localeCompare(a.published));

function inline(text) {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function markdown(body) {
  return body.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.trim().split("\n");
    if (block.startsWith("### ")) return `<h3>${inline(block.slice(4))}</h3>`;
    if (block.startsWith("## ")) { const t = block.slice(3); return `<h2 id="${slugify(t)}">${inline(t)}</h2>`; }
    if (lines.every((l) => l.startsWith("- "))) return `<ul class="list">${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
    if (lines.every((l) => /^\d+\. /.test(l))) return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
    return `<p>${inline(lines.join(" "))}</p>`;
  }).join("\n");
}

const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Read JPEG dimensions so images reserve space and avoid layout shift.
function jpegSize(file) {
  const b = readFileSync(file);
  let i = 2;
  while (i < b.length) {
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  throw new Error("No JPEG size for " + file);
}

function picture(name, alt, { sizes = "(max-width: 850px) 100vw, 50vw", eager = false, cls = "" } = {}) {
  const variants = [640, 1280].map((w) => {
    const path = `/assets/img/${name}-${w}.jpg`;
    return { path, ...jpegSize(join(root, path)) };
  });
  const big = variants[1];
  return `<img${cls ? ` class="${cls}"` : ""} src="${big.path}" srcset="${variants.map((v) => `${v.path} ${v.w}w`).join(", ")}" sizes="${sizes}" width="${big.w}" height="${big.h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'} />`;
}

const logo = (cls = "") => `<img${cls ? ` class="${cls}"` : ""} src="${site.logo}" width="467" height="459" alt="LM Media Solutions" />`;
const button = (href, label, alt = false) => `<a class="button${alt ? " alt" : ""}" href="${href}">${esc(label)}</a>`;
const list = (items) => `<ul class="list">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
const section = ({ id, label, title, intro, cls = "", body, headingTag = "h2" }) => `
<section${id ? ` id="${id}"` : ""} class="section ${cls}">
  <div class="shell">
    ${label ? `<p class="eyebrow">${esc(label)}</p>` : ""}
    ${title ? `<${headingTag} class="heading">${esc(title)}</${headingTag}>` : ""}
    ${intro ? `<p class="intro">${intro}</p>` : ""}
    ${body}
  </div>
</section>`;

// ---------- shared layout ----------
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": site.url + "/#organization",
  name: site.name,
  slogan: site.tagline,
  description: "Business Branding & Development Studio providing brand identity design, business documents and presentations, and website design and development.",
  url: site.url + "/",
  logo: site.url + site.logo,
  image: site.url + site.logo,
  email: site.emails[0],
  telephone: site.phoneIntl,
  foundingDate: site.founded,
  founder: { "@type": "Person", name: site.founder, jobTitle: "Graphic Designer, Web Designer and Video Editor" },
  address: { "@type": "PostalAddress", addressLocality: "Pretoria North", addressRegion: "Gauteng", addressCountry: "ZA" },
  areaServed: { "@type": "Country", name: "South Africa" },
  sameAs: site.social.map((s) => s[1]),
};

function header(path) {
  const current = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <nav class="shell nav" aria-label="Main">
    <a class="brand" href="/" aria-label="LM Media Solutions home">${logo()}</a>
    <button class="menu" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
    <div class="links" id="nav-links">
      ${c.nav.map(([label, href]) => `<a href="${href}"${current(href) ? ' aria-current="page"' : ""}>${label}</a>`).join("\n      ")}
      ${button("/contact/#enquiry", "Start Your Project")}
    </div>
  </nav>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="shell foot">
    <div>
      <a class="brand foot-brand" href="/" aria-label="LM Media Solutions home">${logo()}</a>
      <p class="foot-tag">${esc(site.tagline)}</p>
      <p class="foot-small">${esc(site.category)} · Founded ${site.founded} · ${esc(site.location)}</p>
    </div>
    <nav aria-label="Footer">
      <p class="foot-title">Explore</p>
      ${c.nav.map(([l, h]) => `<a href="${h}">${l}</a>`).join("\n      ")}
    </nav>
    <div>
      <p class="foot-title">Contact</p>
      <a href="tel:${site.phoneIntl}">${site.phoneDisplay}</a>
      ${site.emails.map((e) => `<a href="mailto:${e}">${e}</a>`).join("\n      ")}
      <a href="${waLink()}" rel="noopener">WhatsApp</a>
      <p class="foot-title social-title">Follow</p>
      ${site.social.map(([n, u]) => `<a href="${u}" rel="noopener">${n}</a>`).join("\n      ")}
    </div>
  </div>
  <div class="shell foot-base"><p>&copy; ${new Date().getFullYear()} ${site.name}. All rights reserved.</p></div>
</footer>`;
}

function layout({ path, title, description, body, schema = [], ogImage = site.logo, ogType = "website", noindex = false }) {
  const canonical = abs(path);
  const ld = [orgSchema, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join("\n    ");
  return `<!doctype html>
<html lang="en-ZA">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    ${noindex ? '<meta name="robots" content="noindex" />' : ""}
    <meta name="theme-color" content="#0B4F8A" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${abs(ogImage)}" />
    <meta property="og:locale" content="en_ZA" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/png" href="/assets/lm-media-solutions-mark.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/src/styles.css" />
    ${ld}
    <script src="/src/site.js" defer></script>
  </head>
  <body>
    ${header(path)}
    <main id="main">
${body}
    </main>
    ${footer()}
  </body>
</html>
`;
}

function write(path, html) {
  const file = path.endsWith(".html") ? join(root, path) : join(root, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(path);
}

// ---------- reusable blocks ----------
const divider = () => `
<div class="divider" role="region" aria-label="Services we offer">
  <div class="track">
    ${c.dividerLabels.map((x) => `<span>${esc(x)}</span>`).join("")}
    ${c.dividerLabels.map((x) => `<span aria-hidden="true">${esc(x)}</span>`).join("")}
  </div>
</div>`;

function packageCard(p, { detail = false, service } = {}) {
  return `<article class="card${p.featured ? " featured" : ""}" id="${p.id}">
  <p class="card-label">${esc(p.name)}</p>
  <h3><span class="price-prefix">${p.price.includes("–") ? "Indicative range" : "From"}</span> ${esc(p.price)}</h3>
  <p class="card-audience"><strong>For:</strong> ${esc(p.audience)}</p>
  ${detail && p.positioning ? `<p class="card-audience">${esc(p.positioning)}</p>` : ""}
  ${p.includes ? `<p class="card-includes">${esc(p.includes)}</p>` : ""}
  ${list(detail ? p.items : p.items.slice(0, p.includes ? 4 : 6))}
  ${!detail && p.items.length > (p.includes ? 4 : 6) ? `<p class="card-more">+ ${p.items.length - (p.includes ? 4 : 6)} more deliverables</p>` : ""}
  <a class="card-link" href="${contactFor(service || p.name + (c.websitePackages.includes(p) ? " website" : " package"))}">Enquire about ${esc(p.name)}</a>
</article>`;
}

function articleCard(a, headingTag = "h3") {
  return `<article class="post-card">
  <a class="post-image" href="/blog/${a.slug}/" tabindex="-1" aria-hidden="true">${picture(a.image, "", { sizes: "(max-width: 850px) 100vw, 33vw" })}</a>
  <p class="post-meta"><span>${esc(a.category)}</span> <time datetime="${a.published}">${formatDate(a.published)}</time></p>
  <${headingTag}><a href="/blog/${a.slug}/">${esc(a.title)}</a></${headingTag}>
  <p>${esc(a.excerpt)}</p>
  <a class="card-link" href="/blog/${a.slug}/" aria-label="Read article: ${esc(a.title)}">Read Article</a>
</article>`;
}

const finalCta = () => `
<section class="section final-cta">
  <div class="shell final-inner">
    <div>
      <p class="eyebrow">Start your project</p>
      <h2 class="heading">Ready to Build a Better Business Presence?</h2>
      <p class="intro">Let's bring your brand, business documents, and digital presence together.</p>
    </div>
    <div class="actions">
      ${button("/contact/#enquiry", "Start Your Project")}
      <a class="button alt" href="${waLink()}" rel="noopener">Chat on WhatsApp</a>
    </div>
  </div>
</section>`;

const pageHero = (label, title, intro) => `
<section class="page-hero">
  <div class="shell">
    <p class="eyebrow">${esc(label)}</p>
    <h1>${esc(title)}</h1>
    ${intro ? `<p class="lead">${intro}</p>` : ""}
  </div>
</section>`;

// ---------- pages ----------
function home() {
  const hero = `
<section class="hero">
  <div class="shell hero-grid">
    <div>
      <p class="eyebrow">${esc(site.category)}</p>
      <h1>Build Better. <span>Brand Better.</span> Grow Further.</h1>
      <p class="lead">LM Media Solutions helps entrepreneurs and established businesses build a professional identity, establish a strong digital presence, and present their businesses with confidence.</p>
      <div class="actions">
        ${button("/contact/#enquiry", "Start Your Project")}
        ${button("/services/", "Explore Our Services", true)}
      </div>
    </div>
    <figure class="hero-visual">
      ${picture("pexels-mikael-blomkvist-6476257", "Team meeting in a modern studio with a website design displayed on a desktop monitor", { eager: true })}
      <div class="mock mock-card" aria-hidden="true">
        ${logo()}
        <span class="mock-line strong"></span><span class="mock-line"></span><span class="mock-line short"></span>
      </div>
      <div class="mock mock-doc" aria-hidden="true">
        <div class="mock-doc-head">${logo()}<span class="mock-line short"></span></div>
        <span class="mock-line strong"></span><span class="mock-line"></span><span class="mock-line"></span><span class="mock-line short"></span>
        <span class="mock-chip">Company Profile</span>
      </div>
      <figcaption>Brand identity, business documents and digital presence.</figcaption>
    </figure>
  </div>
</section>`;

  const audiences = section({
    id: "who-we-help", label: "Who we help", title: "Branding and digital presence for every stage of business.",
    body: `<div class="grid two audiences">${c.audiences.map((a, i) => `
      <article class="audience${i ? " dark-card" : ""}">
        <p class="card-label">${i ? "Established businesses" : "New businesses"}</p>
        <h3>${esc(a.title)}</h3>
        <p>${esc(a.text)}</p>
        <a class="card-link" href="${a.href}">${esc(a.cta)}</a>
      </article>`).join("")}</div>`,
  });

  const services = section({
    id: "services", label: "Our services", title: "Four ways we help you build and brand your business.",
    body: `<div class="grid services">${c.services.map((s, i) => `
      <article>
        <strong class="num">0${i + 1}</strong>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.summary)}</p>
        ${list(s.items)}
        <a class="card-link" href="/services/#${s.id}">${esc(s.cta)}</a>
      </article>`).join("")}</div>`,
  });

  const brandPacks = section({
    id: "packages", label: "Business branding packages", title: "Choose the right foundation for your business.",
    intro: esc(c.pricingNote),
    body: `<div class="grid cards">${c.brandingPackages.map((p) => packageCard(p)).join("")}</div>
      <p class="more-link">${button("/packages/", "Compare all branding packages", true)}</p>`,
  });

  const webPacks = section({
    id: "website", label: "Website design packages", title: "Need only a website? Choose a standalone package.",
    intro: "Bronze, Silver and Gold are a separate service line, so you can purchase a professional website without buying a complete branding package. Domain, hosting and email subscriptions are not included in these prices.",
    body: `<div class="grid cards">${c.websitePackages.map((p) => packageCard(p)).join("")}</div>
      <p class="more-link">${button("/website-design/", "View full website package details", true)}</p>`,
  });

  const why = section({
    id: "why", label: "Why LM Media Solutions", title: "Why Choose LM Media Solutions?",
    body: `<div class="grid three why">${c.differentiators.map(([t, d]) => `
      <article><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>`,
  });

  const how = section({
    id: "how-it-works", label: "How it works", title: "A clear process from first conversation to final files.", cls: "dark",
    body: `<ol class="process">${c.process.map(([t, d], i) => `
      <li><strong>0${i + 1}</strong><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("")}</ol>
      <p class="process-note">${esc(c.processNote)}</p>`,
  });

  const blogPreview = section({
    id: "blog", label: "From the blog", title: "Practical guidance for building a credible business.",
    body: `<div class="grid three posts">${sortedArticles.slice(0, 3).map((a) => articleCard(a)).join("")}</div>
      <p class="more-link">${button("/blog/", "View all articles", true)}</p>`,
  });

  return layout({
    path: "/",
    title: "LM Media Solutions | Business Branding & Website Design Studio",
    description: "LM Media Solutions is a Business Branding & Development Studio helping South African businesses with brand identity, company profiles, presentations and websites.",
    body: hero + audiences + services + divider() + brandPacks + webPacks + why + how + blogPreview + finalCta(),
    schema: [{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url + "/" }],
  });
}

function servicesPage() {
  const ctaFor = (s) => s.href ? button(s.href, s.cta) : button(contactFor(s.title), "Discuss " + s.title);
  const body = pageHero("Our services", "Business Branding & Development Services",
    "Brand identity, business documents, websites and coordinated launch support for entrepreneurs, startups, small businesses and established companies.")
    + divider()
    + c.services.map((s, i) => `
<section id="${s.id}" class="section service-detail">
  <div class="shell service-grid">
    <div>
      <strong class="num">0${i + 1}</strong>
      <h2 class="heading">${esc(s.title)}</h2>
      <p class="intro">${esc(s.summary)}</p>
      <div class="actions">${ctaFor(s)}${s.href ? button(contactFor(s.title), "Request a quote", true) : ""}</div>
    </div>
    <div class="service-items"><h3>What's included</h3>${list(s.items)}</div>
  </div>
</section>`).join("")
    + `<section class="section"><div class="shell"><p class="notice">Offering portfolio-style websites to clients means we can build a portfolio or project showcase for <em>your</em> business. Services can be purchased individually or combined in our <a href="/packages/">business branding packages</a>. ${esc(c.pricingNote)}</p></div></section>`
    + finalCta();
  return layout({
    path: "/services/",
    title: "Branding, Document & Website Services | LM Media Solutions",
    description: "Brand identity design, stationery, company profiles, pitch decks, proposals, website design and business launch support from LM Media Solutions.",
    body,
    schema: [{
      "@context": "https://schema.org", "@type": "ItemList", name: "LM Media Solutions services",
      itemListElement: c.services.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Service", name: s.title, description: s.summary, provider: { "@id": site.url + "/#organization" }, url: abs("/services/#" + s.id) } })),
    }],
  });
}

const costsBlock = (title = "Recurring costs not included") => `
<div class="split-notes">
  <div class="notice"><h3>${esc(title)}</h3><p>The following third-party costs are not included in package prices and are paid by the client directly or quoted separately:</p>${list(c.recurringCosts)}<p>We can assist with domain, hosting and business email setup.</p></div>
  <div class="notice"><h3>How pricing works</h3><p>${esc(c.pricingNote)}</p><p>Revisions are limited to the rounds stated for each package. Additional rounds or deliverables are quoted separately.</p></div>
</div>`;

function packagesPage() {
  const body = pageHero("Business branding packages", "Business Branding Packages",
    "Three clearly scoped packages that bring your brand identity, business documents and digital presence together, at the right level for your stage of growth.")
    + section({
      label: "Choose your package", title: "Indicative package pricing",
      intro: esc(c.pricingNote),
      body: `<div class="grid cards">${c.brandingPackages.map((p) => packageCard(p, { detail: true })).join("")}</div>${costsBlock()}`,
    })
    + section({
      label: "Only need a website?", title: "Standalone website packages are priced separately.",
      body: `<p class="intro">Our Bronze (R3,499), Silver (R7,999) and Gold (R14,999) website packages are a separate service line. You can purchase a website without a branding package, and bundled package prices are not the sum of standalone prices.</p><div class="actions">${button("/website-design/", "View website packages")}${button("/blog/business-branding-packages-what-does-your-business-need/", "Which package do I need?", true)}</div>`,
    })
    + finalCta();
  return layout({
    path: "/packages/",
    title: "Business Branding Packages & Prices | LM Media Solutions",
    description: "Compare the Business Starter, Professional Business and Corporate Ready branding packages: indicative prices, deliverables and who each package is for.",
    body,
  });
}

function websitePage() {
  const body = pageHero("Website design & development", "Website Design Packages",
    "Custom, responsive business websites, available on their own without a branding package. Choose Bronze, Silver or Gold depending on the size and scope your business needs.")
    + section({
      label: "Standalone website packages", title: "Bronze, Silver and Gold",
      intro: "Starting prices for the defined scope below. Final pricing depends on confirmed requirements.",
      body: `<div class="grid cards">${c.websitePackages.map((p) => packageCard(p, { detail: true })).join("")}</div>`,
    })
    + section({
      label: "Scope", title: "What may require a separate quotation",
      body: `<div class="split-notes"><div class="notice"><p>The following are not included in the Bronze, Silver or Gold packages and are quoted separately:</p>${list(c.websiteExclusions)}</div>
      <div class="notice"><h3>Domain, hosting and email</h3><p>Domain registration, hosting and business email subscriptions are <strong>not included</strong> in website package prices. We can assist with setting them up on your accounts, and we explain the recurring costs before you commit.</p>${list(c.recurringCosts)}</div></div>
      <p class="intro">${esc(c.processNote)} Read our guide to <a href="/blog/how-much-does-website-design-cost-in-south-africa/">website design cost in South Africa</a>, or see our <a href="/packages/">branding packages</a> if you also need a logo, stationery or company profile.</p>`,
    })
    + finalCta();
  return layout({
    path: "/website-design/",
    title: "Website Design Packages in South Africa | LM Media Solutions",
    description: "Custom business website design and development: Bronze R3,499, Silver R7,999 and Gold R14,999. Responsive, SEO-ready websites for South African businesses.",
    body,
    schema: [{
      "@context": "https://schema.org", "@type": "Service", name: "Website design and development", serviceType: "Website design",
      provider: { "@id": site.url + "/#organization" }, areaServed: { "@type": "Country", name: "South Africa" }, url: abs("/website-design/"),
      offers: c.websitePackages.map((p) => ({ "@type": "Offer", name: p.name + " website package", price: p.price.replace(/[^0-9]/g, ""), priceCurrency: "ZAR" })),
    }],
  });
}

function aboutPage() {
  const a = c.about;
  const body = pageHero("About LM Media Solutions", a.heading, esc(a.subheading))
    + `
<section class="section about-section">
  <div class="shell about">
    <div class="about-media">
      ${picture("pexels-canvastudio-3194519", "Overhead view of a team working on laptops and phones around a white table")}
    </div>
    <div class="about-copy">
      <div class="about-logo">${logo()}</div>
      ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n      ")}
      <blockquote><p class="eyebrow">Our mission</p>${esc(a.mission)}</blockquote>
      <p class="signoff">${esc(a.signoff)}</p>
    </div>
  </div>
</section>`
    + section({ label: "What we do", title: "One studio for your brand, documents and website.",
      body: `<div class="grid services compact">${c.services.map((s) => `<article><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><a class="card-link" href="/services/#${s.id}">${esc(s.cta)}</a></article>`).join("")}</div>` })
    + finalCta();
  return layout({
    path: "/who-we-are/",
    title: "Who We Are | LM Media Solutions, Business Branding Studio",
    description: "LM Media Solutions is a Business Branding & Development Studio founded in 2023 by Lehlohonolo Thomas Maishoane, serving businesses of all sizes.",
    body,
    schema: [{ "@context": "https://schema.org", "@type": "AboutPage", name: "Who We Are", url: abs("/who-we-are/"), about: { "@id": site.url + "/#organization" } }],
  });
}

function blogIndex() {
  const body = pageHero("Blog", "Business Branding & Website Design Blog",
    "Practical guidance on business branding, company profiles and presentations, website design and launching your business professionally.")
    + `<section class="section"><div class="shell">
  <nav class="category-nav" aria-label="Blog categories">${categories.map((cat) => `<a href="#${slugify(cat)}">${esc(cat)}</a>`).join("")}</nav>
  ${categories.map((cat) => {
    const posts = sortedArticles.filter((a) => a.category === cat);
    return posts.length ? `<div class="category" id="${slugify(cat)}"><h2 class="category-title">${esc(cat)}</h2><div class="grid three posts">${posts.map((a) => articleCard(a)).join("")}</div></div>` : "";
  }).join("")}
</div></section>` + finalCta();
  return layout({
    path: "/blog/",
    title: "Blog: Branding, Company Profiles & Website Design | LM Media Solutions",
    description: "Guides on business branding, company profile design, presentations and website design costs for South African entrepreneurs and businesses.",
    body,
    schema: [{ "@context": "https://schema.org", "@type": "Blog", name: "LM Media Solutions Blog", url: abs("/blog/"), publisher: { "@id": site.url + "/#organization" } }],
  });
}

function articlePage(a) {
  const path = `/blog/${a.slug}/`;
  const related = sortedArticles.filter((x) => x.slug !== a.slug && x.category === a.category).concat(sortedArticles.filter((x) => x.slug !== a.slug && x.category !== a.category)).slice(0, 3);
  const body = `
<article class="article">
  <header class="shell article-head">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/blog/">Blog</a> <span aria-hidden="true">/</span> <span aria-current="page">${esc(a.title)}</span></nav>
    <p class="eyebrow">${esc(a.category)}</p>
    <h1>${esc(a.title)}</h1>
    <p class="article-intro">${esc(a.excerpt)}</p>
    <p class="article-meta">By ${esc(site.founder)} · Published <time datetime="${a.published}">${formatDate(a.published)}</time>${a.modified !== a.published ? ` · Updated <time datetime="${a.modified}">${formatDate(a.modified)}</time>` : ""}</p>
  </header>
  <figure class="shell article-figure">${picture(a.image, a.imageAlt, { eager: true, sizes: "(max-width: 900px) 100vw, 900px" })}</figure>
  <div class="shell article-body">
${markdown(a.body)}
    <aside class="article-cta">
      <h2>Need help with this?</h2>
      <p>Tell us about your business and we will recommend the right service or package.</p>
      <div class="actions">${button("/contact/#enquiry", "Start Your Project")}<a class="button alt" href="${waLink("Hi LM Media Solutions, I read your article \"" + a.title + "\" and would like to discuss a project.")}" rel="noopener">Chat on WhatsApp</a></div>
    </aside>
  </div>
</article>
<section class="section"><div class="shell"><h2 class="heading small">Related articles</h2><div class="grid three posts">${related.map((r) => articleCard(r)).join("")}</div></div></section>`;
  return layout({
    path,
    title: a.seoTitle.length + 21 <= 70 ? a.seoTitle + " | LM Media Solutions" : a.seoTitle,
    description: a.description,
    body,
    ogType: "article",
    ogImage: `/assets/img/${a.image}-1280.jpg`,
    schema: [
      {
        "@context": "https://schema.org", "@type": "BlogPosting", headline: a.title, description: a.description,
        image: abs(`/assets/img/${a.image}-1280.jpg`), datePublished: a.published, dateModified: a.modified,
        author: { "@type": "Person", name: site.founder }, publisher: { "@id": site.url + "/#organization" },
        mainEntityOfPage: abs(path), articleSection: a.category, inLanguage: "en-ZA",
      },
      {
        "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Blog", item: abs("/blog/") },
          { "@type": "ListItem", position: 3, name: a.title, item: abs(path) },
        ],
      },
    ],
  });
}

function contactPage() {
  const opts = (items, placeholder) => `<option value="">${placeholder}</option>` + items.map((x) => `<option>${esc(x)}</option>`).join("");
  const body = pageHero("Contact", "Start Your Project",
    "Tell us about your business and what you need. We will respond with recommendations and, once the scope is clear, a quotation.")
    + `
<section class="section" id="enquiry">
  <div class="shell contact">
    <form class="enquiry" data-endpoint="${esc(site.formEndpoint)}" data-email="${site.emails[0]}" data-whatsapp="${site.whatsapp}" novalidate>
      <h2 class="heading small">Project enquiry</h2>
      <p class="form-help">Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>
      <div class="form-grid">
        <div class="field"><label for="f-name">Name <span aria-hidden="true">*</span></label><input id="f-name" name="name" autocomplete="name" required maxlength="100" /></div>
        <div class="field"><label for="f-business">Business name</label><input id="f-business" name="business" autocomplete="organization" maxlength="120" /></div>
        <div class="field"><label for="f-email">Email address <span aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="160" /></div>
        <div class="field"><label for="f-phone">Contact number <span aria-hidden="true">*</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required maxlength="20" /></div>
        <div class="field"><label for="f-service">Service required <span aria-hidden="true">*</span></label><select id="f-service" name="service" required>${opts(c.enquiryServices, "Select a service")}</select></div>
        <div class="field"><label for="f-budget">Budget range</label><select id="f-budget" name="budget">${opts(c.budgetRanges, "Select a budget range")}</select></div>
      </div>
      <div class="field"><label for="f-message">Project description <span aria-hidden="true">*</span></label><textarea id="f-message" name="message" required minlength="20" maxlength="3000" aria-describedby="f-message-help"></textarea><p class="field-help" id="f-message-help">Tell us about your business, what you need and any deadlines.</p></div>
      <div class="hp" aria-hidden="true"><label for="f-website">Leave this field empty</label><input id="f-website" name="website" tabindex="-1" autocomplete="off" /></div>
      <div class="form-actions">
        <button class="button" type="submit">Send Enquiry</button>
        <button class="button alt" type="button" data-whatsapp-send>Send via WhatsApp</button>
      </div>
      <p class="form-status" role="status" aria-live="polite"></p>
      <noscript><p class="form-status">This form needs JavaScript. Please email <a href="mailto:${site.emails[0]}">${site.emails[0]}</a> or call ${site.phoneDisplay}.</p></noscript>
    </form>
    <aside class="contact-info">
      <h2>Contact information</h2>
      <p><a href="tel:${site.phoneIntl}">${site.phoneDisplay}</a></p>
      ${site.emails.map((e) => `<p><a href="mailto:${e}">${e}</a></p>`).join("")}
      <p><a href="${waLink()}" rel="noopener">Chat on WhatsApp</a></p>
      <p>${esc(site.location)}</p>
      <iframe title="Map showing Pretoria North, South Africa" src="https://www.google.com/maps?q=Pretoria%20North%2C%20South%20Africa&amp;output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </aside>
  </div>
</section>`;
  return layout({
    path: "/contact/",
    title: "Contact LM Media Solutions | Start Your Branding or Website Project",
    description: `Start your branding, company profile or website project with LM Media Solutions. Call ${site.phoneDisplay}, email us or chat on WhatsApp.`,
    body,
  });
}

function notFound() {
  return layout({
    path: "/404.html", title: "Page not found | LM Media Solutions", description: "The page you are looking for could not be found. Visit our homepage, services, packages or blog to find what you need.", noindex: true,
    body: pageHero("404", "Page not found", `The page you are looking for may have moved. Try the <a href="/">homepage</a>, our <a href="/services/">services</a> or the <a href="/blog/">blog</a>.`),
  });
}

function redirect(to) {
  return `<!doctype html>
<html lang="en-ZA">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page moved | LM Media Solutions</title>
    <link rel="canonical" href="${abs(to)}" />
    <meta http-equiv="refresh" content="0; url=${to}" />
  </head>
  <body>
    <p>This page has moved. <a href="${to}">Continue to LM Media Solutions</a>.</p>
  </body>
</html>
`;
}

// ---------- build ----------
write("/", home());
write("/services/", servicesPage());
write("/packages/", packagesPage());
write("/website-design/", websitePage());
write("/who-we-are/", aboutPage());
write("/blog/", blogIndex());
for (const a of articles) write(`/blog/${a.slug}/`, articlePage(a));
write("/contact/", contactPage());
write("/404.html", notFound());

// Legacy URLs: client-side redirects (configure server-side 301s on the host where possible).
export const redirects = {
  "/web-design-gauteng.html": "/website-design/",
  "/web-design-soweto.html": "/website-design/",
  "/digital-marketing-gauteng.html": "/services/",
  "/digital-marketing-soweto.html": "/services/",
};
for (const [from, to] of Object.entries(redirects)) writeFileSync(join(root, from), redirect(to));

const lastmod = (p) => (p.startsWith("/blog/") && p !== "/blog/" ? articles.find((a) => p.includes(a.slug)).modified : today);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written.filter((p) => p !== "/404.html").map((p) => `  <url>\n    <loc>${abs(p)}</loc>\n    <lastmod>${lastmod(p)}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
writeFileSync(join(root, "sitemap.xml"), sitemap);
writeFileSync(join(root, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /lm-media-solutions-website.zip\n\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(root, "redirects.json"), JSON.stringify(redirects, null, 2) + "\n");
// Vercel hosting: the committed files are served as they are; add real 301 redirects and trailing slashes.
writeFileSync(join(root, "vercel.json"), JSON.stringify({
  trailingSlash: true,
  redirects: Object.entries(redirects).map(([source, destination]) => ({ source, destination, permanent: true })),
}, null, 2) + "\n");

console.log(`Built ${written.length} pages, ${Object.keys(redirects).length} redirects, sitemap and robots.txt.`);
if (!existsSync(join(root, "assets/img"))) console.warn("assets/img missing: run scripts/optimise-images.ps1");
