#!/usr/bin/env node
"use strict";
/**
 * Builds the portfolio from data/projects.js and data/site.js. No dependencies.
 *
 *   node tools/build.js           validate data, regenerate pages, check links
 *   node tools/build.js --check   verify docs/ is up to date without writing (used by CI)
 *
 * What it writes:
 *   - docs/projects/<slug>.html            a case-study page per published project
 *   - marked regions inside the hand-written pages in docs/, e.g.
 *       <!-- build:header --> ... <!-- /build:header -->
 *     Everything between a pair of markers is replaced; everything else is left alone.
 *   - docs/sitemap.xml
 */
const fs = require("fs");
const path = require("path");
const T = require("./templates");
const { imageSize } = require("./image-size");

const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const PROJECT_DIR = path.join(DOCS, "projects");
const CHECK_ONLY = process.argv.includes("--check");
const LARGE_IMAGE_BYTES = 600 * 1024;

const site = require(path.join(ROOT, "data/site.js"));
const rawProjects = require(path.join(ROOT, "data/projects.js"));

const errors = [];
const warnings = [];
// Read text with LF line endings, so a CRLF checkout (Windows) never looks "out of date".
const readText = (file) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const rel = (file) => path.relative(ROOT, file).split(path.sep).join("/");

/* ------------------------------------------------------------ validation */

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isUrl = (v) => /^https?:\/\/\S+$/i.test(v);

function checkImage(img, where) {
  if (!img || typeof img !== "object" || !img.src) {
    errors.push(`${where}: needs a "src".`);
    return null;
  }
  if (/^(https?:)?\/\//i.test(img.src)) {
    errors.push(`${where}: "${img.src}" must be a file inside docs/, not a URL.`);
    return null;
  }
  if (!img.alt || !String(img.alt).trim()) {
    errors.push(`${where}: "${img.src}" needs "alt" text describing the image.`);
  }
  const file = path.join(DOCS, img.src);
  if (!fs.existsSync(file)) {
    errors.push(`${where}: image not found at docs/${img.src}`);
    return null;
  }
  const bytes = fs.statSync(file).size;
  if (bytes > LARGE_IMAGE_BYTES && !/\.svg$/i.test(file)) {
    warnings.push(`${where}: docs/${img.src} is ${Math.round(bytes / 1024)} KB. Consider a WebP under 1600px wide.`);
  }
  return { ...img, size: imageSize(file) };
}

function normalise(project, index) {
  const where = `data/projects.js → project #${index + 1}${project && project.slug ? ` ("${project.slug}")` : ""}`;
  if (!project || typeof project !== "object") {
    errors.push(`${where}: is not an object.`);
    return null;
  }
  for (const field of ["slug", "title", "shortDescription"]) {
    if (!project[field] || !String(project[field]).trim()) errors.push(`${where}: missing required field "${field}".`);
  }
  if (project.slug && !SLUG.test(project.slug)) {
    errors.push(`${where}: slug "${project.slug}" may only use lowercase letters, numbers and single hyphens.`);
  }
  for (const field of ["liveUrl", "repositoryUrl"]) {
    if (project[field] && !isUrl(project[field])) errors.push(`${where}: ${field} must start with https:// (got "${project[field]}").`);
  }
  const list = (field) => {
    const value = project[field];
    if (value === undefined || value === null || value === "") return [];
    if (!Array.isArray(value)) {
      errors.push(`${where}: "${field}" must be a list in [square brackets].`);
      return [];
    }
    return value.filter((x) => x !== null && x !== undefined && x !== "");
  };

  const caseStudy = list("caseStudy").map((s, i) => {
    if (!s.heading) errors.push(`${where}: caseStudy section ${i + 1} needs a "heading".`);
    return { heading: s.heading || "", paragraphs: Array.isArray(s.paragraphs) ? s.paragraphs : [], points: Array.isArray(s.points) ? s.points : [] };
  });

  return {
    slug: project.slug,
    title: project.title,
    shortDescription: project.shortDescription,
    published: project.published !== false,
    featured: project.featured === true,
    detailPage: project.detailPage !== false,
    category: project.category || "",
    year: project.year || "",
    period: project.period || "",
    status: project.status || "",
    role: project.role || "",
    team: project.team || "",
    description: list("description"),
    technologies: list("technologies"),
    thumbnail: project.thumbnail ? checkImage(project.thumbnail, `${where} thumbnail`) : null,
    gallery: list("gallery")
      .map((g, i) => {
        const img = checkImage(g, `${where} gallery item ${i + 1}`);
        return img && { ...img, caption: g.caption || "" };
      })
      .filter(Boolean),
    liveUrl: project.liveUrl || "",
    repositoryUrl: project.repositoryUrl || "",
    facts: list("facts").filter((f) => f && f.value && f.label),
    caseStudy,
  };
}

if (!Array.isArray(rawProjects)) {
  errors.push("data/projects.js must export a list: module.exports = [ ... ];");
}
const allProjects = (Array.isArray(rawProjects) ? rawProjects : []).map(normalise).filter(Boolean);

const seen = new Set();
for (const p of allProjects) {
  if (seen.has(p.slug)) errors.push(`data/projects.js: slug "${p.slug}" is used more than once.`);
  seen.add(p.slug);
}

const projects = allProjects.filter((p) => p.published);
projects.forEach((p, i) => (p.number = i + 1));

/* --------------------------------------------------------------- render */

const outputs = new Map(); // absolute path -> content

for (const project of projects.filter((p) => p.detailPage)) {
  outputs.set(path.join(PROJECT_DIR, `${project.slug}.html`), T.projectPage({ project, projects, site }));
}

const BLOCKS = {
  head: (ctx) => T.head(ctx),
  header: (ctx) => T.header(ctx),
  footer: (ctx) => T.footer(ctx),
  "contact-list": (ctx) => T.contactList(ctx),
  "featured-projects": (ctx) => T.featuredProjects(ctx),
  "project-index": (ctx) => T.projectIndex(ctx),
  "project-count": (ctx) => String(ctx.projects.length).padStart(2, "0"),
};
const MARKER = /([ \t]*)<!-- build:([a-z-]+) -->[\s\S]*?<!-- \/build:\2 -->/g;

// Sorted explicitly: directory listing order differs between Windows and Linux (CI),
// and the sitemap must come out byte-identical on both. Home page first.
const byName = (a, b) => (a === "index.html" ? -1 : b === "index.html" ? 1 : a.toLowerCase().localeCompare(b.toLowerCase(), "en"));
const handWritten = fs
  .readdirSync(DOCS)
  .filter((f) => f.endsWith(".html"))
  .sort(byName);
for (const name of handWritten) {
  const file = path.join(DOCS, name);
  const source = readText(file);
  const ctx = { root: "", current: name, site, projects };
  const result = source.replace(MARKER, (match, indent, block) => {
    if (!BLOCKS[block]) {
      errors.push(`docs/${name}: unknown build marker "${block}".`);
      return match;
    }
    const body = BLOCKS[block](ctx);
    // Inline blocks (single line, e.g. a count) stay on one line.
    if (!body.includes("\n") && !match.includes("\n")) return `${indent}<!-- build:${block} -->${body}<!-- /build:${block} -->`;
    const indented = body
      .split("\n")
      .map((l) => (l ? indent + l : l))
      .join("\n");
    return `${indent}<!-- build:${block} -->\n${indented}\n${indent}<!-- /build:${block} -->`;
  });
  outputs.set(file, result);
}

const sitemapPages = [
  ...handWritten.filter((f) => f !== "404.html"),
  ...projects.filter((p) => p.detailPage).map((p) => `projects/${p.slug}.html`),
];
outputs.set(path.join(DOCS, "sitemap.xml"), T.sitemap({ site, pages: sitemapPages }));

// Generated project pages that no longer correspond to a published project.
const stale = fs.existsSync(PROJECT_DIR)
  ? fs
      .readdirSync(PROJECT_DIR)
      .map((f) => path.join(PROJECT_DIR, f))
      .filter((f) => f.endsWith(".html") && !outputs.has(f) && fs.readFileSync(f, "utf8").includes(T.GENERATED_NOTICE))
  : [];

/* ---------------------------------------------------------- link check */

// Every relative href/src in the final HTML must point at a real file.
function checkLinks(file, html) {
  const attr = /\s(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = attr.exec(html))) {
    const url = m[1];
    if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) continue;
    const clean = url.split(/[?#]/)[0];
    if (!clean) continue;
    let target;
    try {
      const decoded = decodeURIComponent(clean);
      // Root-absolute links ("/Projects.html") resolve from docs/, the site root.
      target = decoded.startsWith("/") ? path.join(DOCS, decoded) : path.resolve(path.dirname(file), decoded);
      if (target.endsWith(path.sep)) target = path.join(target, "index.html");
    } catch {
      errors.push(`${rel(file)}: malformed link "${url}".`);
      continue;
    }
    const willExist = outputs.has(target) && !stale.includes(target);
    if (!willExist && !fs.existsSync(target)) errors.push(`${rel(file)}: broken link "${url}".`);
  }
}
for (const [file, html] of outputs) if (file.endsWith(".html")) checkLinks(file, html);

/* --------------------------------------------------------------- output */

const report = (title, items) => items.length && console.log(`\n${title}\n${items.map((i) => "  - " + i).join("\n")}`);
report("Warnings:", warnings);
if (errors.length) {
  report("Errors (nothing was written):", errors);
  process.exit(1);
}

const changed = [...outputs].filter(([file, content]) => !fs.existsSync(file) || readText(file) !== content);

if (CHECK_ONLY) {
  const problems = [...changed.map(([f]) => rel(f) + " is out of date"), ...stale.map((f) => rel(f) + " should be removed")];
  if (problems.length) {
    report("docs/ is out of date. Run `npm run build` and commit the result:", problems);
    process.exit(1);
  }
  console.log(`✓ docs/ is up to date (${projects.length} projects, links OK).`);
  process.exit(0);
}

fs.mkdirSync(PROJECT_DIR, { recursive: true });
for (const [file, content] of changed) fs.writeFileSync(file, content);
for (const file of stale) fs.unlinkSync(file);

console.log(`✓ Built ${projects.length} published project(s), ${projects.filter((p) => p.featured).length} featured.`);
report("Updated:", changed.map(([f]) => rel(f)));
report("Removed (project unpublished or renamed):", stale.map(rel));
if (!changed.length && !stale.length) console.log("  Everything was already up to date.");
