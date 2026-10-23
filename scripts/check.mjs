// Verifies the generated site: links, anchors, metadata, headings, images, JSON-LD and pricing.
// Usage: node scripts/check.mjs   (run after npm run generate)
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { brandingPackages, websitePackages, nav } from "../src/content.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skip = new Set([".git", ".claude", "node_modules", "assets", "src", "scripts"]);
const legacy = ["web-design-gauteng.html", "web-design-soweto.html", "digital-marketing-gauteng.html", "digital-marketing-soweto.html"];
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (skip.has(name)) return [];
    if (statSync(p).isDirectory()) return walk(p);
    return name.endsWith(".html") ? [p] : [];
  });
}

const pages = walk(root).filter((p) => !legacy.includes(relative(root, p)));
const html = Object.fromEntries(pages.map((p) => [p, readFileSync(p, "utf8")]));
const ids = (s) => new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const titles = new Map();
const descriptions = new Map();

function resolve(href) {
  const clean = href.split("#")[0].split("?")[0];
  const p = join(root, decodeURIComponent(clean));
  if (existsSync(p) && statSync(p).isFile()) return p;
  if (existsSync(join(p, "index.html"))) return join(p, "index.html");
  return null;
}

for (const [file, s] of Object.entries(html)) {
  const rel = relative(root, file);
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(rel, `expected 1 <h1>, found ${h1}`);
  const title = (s.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (s.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail(rel, "missing <title>");
  else if (titles.has(title)) fail(rel, `duplicate title with ${titles.get(title)}`);
  else titles.set(title, rel);
  if (!desc) fail(rel, "missing meta description");
  else {
    if (descriptions.has(desc)) fail(rel, `duplicate description with ${descriptions.get(desc)}`);
    descriptions.set(desc, rel);
    if (desc.length < 70 || desc.length > 170) fail(rel, `description length ${desc.length} (aim 70-170)`);
  }
  if (title && title.length > 75) fail(rel, `title length ${title.length} (aim <= 75)`);
  if (!/<link rel="canonical" href="https:\/\/lmmediasolutions\.co\.za\//.test(s)) fail(rel, "missing canonical");
  if (!/<html lang="en-ZA">/.test(s)) fail(rel, "missing lang");
  for (const img of s.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt="/.test(img)) fail(rel, `image without alt: ${img.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) fail(rel, `image without dimensions: ${img.slice(0, 80)}`);
    const src = (img.match(/\ssrc="([^"]+)"/) || [])[1];
    if (src && src.startsWith("/") && !resolve(src)) fail(rel, `missing image ${src}`);
  }
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(rel, "invalid JSON-LD"); }
  }
  // Heading levels must not skip (e.g. h2 -> h4).
  let last = 1;
  for (const m of s.matchAll(/<h([1-6])[\s>]/g)) {
    const level = Number(m[1]);
    if (level > last + 1) fail(rel, `heading jumps from h${last} to h${level}`);
    last = level;
  }
  for (const m of s.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    if (href.startsWith("#")) { if (href.length > 1 && !ids(s).has(href.slice(1))) fail(rel, `broken anchor ${href}`); continue; }
    if (!href.startsWith("/")) { fail(rel, `relative link ${href}`); continue; }
    const target = resolve(href);
    if (!target) { fail(rel, `broken link ${href}`); continue; }
    const hash = href.split("#")[1];
    if (hash && target.endsWith(".html") && !ids(readFileSync(target, "utf8")).has(hash)) fail(rel, `broken anchor ${href}`);
  }
  const navBlock = (s.match(/<header class="site-header">[\s\S]*?<\/header>/) || [""])[0];
  if (/portfolio|our work/i.test(navBlock)) fail(rel, "portfolio or 'Our Work' item in navigation");
  if (!navBlock.includes("/assets/lm-media-solutions-logo.png")) fail(rel, "logo missing from header");
}

// Every package price appears on the pages that list packages, and no stale prices remain.
const pageText = (p) => html[join(root, p, "index.html")] || "";
for (const p of brandingPackages) for (const page of ["", "packages"]) if (!pageText(page).includes(p.price)) fail(page || "index", `missing ${p.name} price ${p.price}`);
for (const p of websitePackages) for (const page of ["", "website-design"]) if (!pageText(page).includes(p.price)) fail(page || "index", `missing ${p.name} price ${p.price}`);
for (const [file, s] of Object.entries(html)) for (const stale of ["R3,999", "R6,999", "R9,999", "Digital Marketing"]) if (s.includes(stale)) fail(relative(root, file), `stale content "${stale}"`);
for (const [, href] of nav) if (!resolve(href)) fail("nav", `nav link ${href} does not resolve`);

// Legacy URLs must redirect to a page that exists.
for (const f of legacy) {
  const s = readFileSync(join(root, f), "utf8");
  const to = (s.match(/url=([^"]+)"/) || [])[1];
  if (!to || !resolve(to)) fail(f, `redirect target ${to} missing`);
}

// Sitemap entries resolve.
for (const m of readFileSync(join(root, "sitemap.xml"), "utf8").matchAll(/<loc>https:\/\/lmmediasolutions\.co\.za([^<]*)<\/loc>/g)) if (!resolve(m[1])) fail("sitemap.xml", `missing ${m[1]}`);

// JavaScript syntax.
for (const f of ["src/site.js", "server.mjs", "scripts/build.mjs", "src/content.mjs", "src/blog.mjs"]) {
  try { execFileSync(process.execPath, ["--check", join(root, f)], { stdio: "pipe" }); } catch (e) { fail(f, String(e.stderr)); }
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s) in ${pages.length} pages.`);
  process.exit(1);
}
console.log(`All checks passed for ${pages.length} pages.`);
