"use strict";
// HTML templates for the shared page chrome and every project view.
// All user-editable text passes through esc(), so project data is always rendered as text.

const GENERATED_NOTICE =
  "<!-- GENERATED FILE: edit data/projects.js and run `npm run build`. Changes made here will be overwritten. -->";

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Encode a docs-relative path for use in href/src (spaces etc.), keeping slashes. */
const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

const pad = (n) => String(n).padStart(2, "0");
const indent = (html, prefix) =>
  html
    .split("\n")
    .map((l) => prefix + l)
    .join("\n");
const lines = (...parts) => parts.flat(Infinity).filter((x) => x !== null && x !== undefined && x !== false && x !== "").join("\n");

/* ------------------------------------------------------------------ icons */

const svg = (body, cls = "icon") =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const icons = {
  arrowUpRight: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  arrowRight: svg('<path d="M4 12h15M13 6l6 6-6 6"/>'),
  arrowLeft: svg('<path d="M20 12H5M11 6l-6 6 6 6"/>'),
  email: svg('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>'),
  phone: svg(
    '<path d="M21 16.4v2.9a1.9 1.9 0 0 1-2.1 1.9 18.8 18.8 0 0 1-8.2-2.9 18.5 18.5 0 0 1-5.7-5.7A18.8 18.8 0 0 1 2.1 4.4 1.9 1.9 0 0 1 4 2.3h2.9a1.9 1.9 0 0 1 1.9 1.6c.1.9.3 1.8.7 2.7a1.9 1.9 0 0 1-.4 2L7.8 9.8a15.2 15.2 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4c.9.3 1.8.6 2.7.7a1.9 1.9 0 0 1 1.6 1.8z"/>'
  ),
  github: svg(
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.5-1-3.5.3-1.2.3-2.4 0-3.5 0 0-1 0-3 1.5a10.8 10.8 0 0 0-8 0C6 2 5 2 5 2c-.3 1.1-.3 2.3 0 3.5a5.4 5.4 0 0 0-1 3.5c0 3.5 3 5.5 6 5.5-.4.5-.7 1-.9 1.7-.2.6-.2 1.2-.1 1.8v4"/><path d="M9 18c-4.5 2-5-2-7-2"/>'
  ),
  linkedin: svg(
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'
  ),
  copy: svg('<rect x="8" y="8" width="13" height="13" rx="1.5"/><path d="M16 8V4.5A1.5 1.5 0 0 0 14.5 3h-10A1.5 1.5 0 0 0 3 4.5v10A1.5 1.5 0 0 0 4.5 16H8"/>'),
  expand: svg('<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>'),
};

/* --------------------------------------------------------- shared chrome */

// Runs before first paint: flags JS support and decides whether to play the
// first-visit intro, so nothing flashes or hides content when JS is off.
const BOOT_SCRIPT =
  '(function(d){var c=d.documentElement.classList;c.add("js");try{if(!sessionStorage.getItem("iad-visited")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)c.add("has-intro")}catch(e){}})(document);';

function head({ root }) {
  return lines(
    '<meta name="theme-color" content="#f3efe6" />',
    `<link rel="icon" type="image/png" href="${root}favicon.png" />`,
    `<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png" />`,
    `<link rel="preload" href="${root}assets/fonts/fraunces.woff2" as="font" type="font/woff2" crossorigin />`,
    `<link rel="preload" href="${root}assets/fonts/geist.woff2" as="font" type="font/woff2" crossorigin />`,
    `<link rel="preload" href="${root}assets/fonts/geist-mono.woff2" as="font" type="font/woff2" crossorigin />`,
    `<link rel="stylesheet" href="${root}assets/css/main.css" />`,
    `<script>${BOOT_SCRIPT}</script>`,
    `<script src="${root}assets/js/site.js" defer></script>`
  );
}

function header({ root, current, site }) {
  const items = site.nav.map((item) => {
    const isCurrent = item.href === current;
    return `        <li><a href="${root}${item.href}"${isCurrent ? ' aria-current="page"' : ""}>${esc(item.label)}</a></li>`;
  });
  return lines(
    '<a class="skip-link" href="#main">Skip to content</a>',
    '<div class="intro" aria-hidden="true">',
    `  <img class="intro-mark" src="${root}assets/img/logo-96.webp" width="96" height="96" alt="" />`,
    '  <span class="intro-line"></span>',
    "</div>",
    '<header class="site-header" data-header>',
    '  <div class="container header-inner">',
    `    <a class="brand" href="${root}index.html">`,
    `      <img class="brand-mark" src="${root}assets/img/logo-96.webp" width="36" height="36" alt="" />`,
    `      <span class="brand-name">${esc(site.name)}</span>`,
    "    </a>",
    '    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">',
    '      <span class="nav-toggle-label">Menu</span>',
    '      <span class="nav-toggle-icon" aria-hidden="true"><span></span><span></span></span>',
    "    </button>",
    '    <nav class="site-nav" id="site-nav" aria-label="Main">',
    "      <ul>",
    items,
    "      </ul>",
    "    </nav>",
    "  </div>",
    "</header>"
  );
}

function footer({ root, site }) {
  const email = site.contacts.find((c) => c.id === "email");
  const others = site.contacts.filter((c) => c.id !== "email");
  return lines(
    '<footer class="site-footer">',
    '  <div class="container">',
    '    <div class="footer-cta">',
    '      <p class="eyebrow eyebrow--on-dark">Contact</p>',
    '      <p class="footer-title">Connect with me.</p>',
    email && `      <a class="footer-email" href="${esc(email.href)}">${esc(email.value)}${icons.arrowUpRight}</a>`,
    "    </div>",
    '    <div class="footer-grid">',
    '      <nav aria-label="Footer">',
    '        <ul class="footer-list">',
    site.nav.map((item) => `          <li><a href="${root}${item.href}">${esc(item.label)}</a></li>`),
    "        </ul>",
    "      </nav>",
    '      <ul class="footer-list">',
    others.map(
      (c) =>
        `        <li><a href="${esc(c.href)}"${c.external ? ' target="_blank" rel="noopener"' : ""}>${esc(c.label)}${
          c.external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : ""
        }</a></li>`
    ),
    "      </ul>",
    "    </div>",
    '    <div class="footer-base">',
    `      <p>${esc(site.name)}</p>`,
    '      <a href="#top" class="footer-top">Back to top</a>',
    "    </div>",
    "  </div>",
    "</footer>"
  );
}

function contactList({ site }) {
  return lines(
    '<ul class="contact-list" role="list">',
    site.contacts.map((c) =>
      lines(
        `  <li class="contact-item" data-contact="${esc(c.id)}">`,
        `    <a class="contact-link" href="${esc(c.href)}"${c.external ? ' target="_blank" rel="noopener"' : ""}>`,
        `      <span class="contact-icon">${icons[c.id] || icons.arrowUpRight}</span>`,
        `      <span class="contact-label">${esc(c.label)}</span>`,
        `      <span class="contact-value">${esc(c.value)}</span>`,
        `      <span class="contact-arrow">${icons.arrowUpRight}</span>`,
        c.external ? '      <span class="visually-hidden">(opens in a new tab)</span>' : "",
        "    </a>",
        c.id === "email"
          ? `    <button class="copy-button" type="button" data-copy="${esc(c.value)}" hidden>${icons.copy}<span data-copy-label>Copy</span><span class="visually-hidden"> email address</span></button>`
          : "",
        "  </li>"
      )
    ),
    "</ul>"
  );
}

/* ------------------------------------------------------------- projects */

function image({ img, root, sizes, eager = false, cls = "" }) {
  const dims = img.size ? ` width="${img.size.width}" height="${img.size.height}"` : "";
  const loading = eager ? ' fetchpriority="high"' : ' loading="lazy"';
  return `<img${cls ? ` class="${cls}"` : ""} src="${root}${encodePath(img.src)}"${dims} alt="${esc(img.alt)}"${loading} decoding="async"${
    sizes ? ` sizes="${sizes}"` : ""
  } />`;
}

/** Typographic stand-in when a project has no thumbnail. */
function cover(project) {
  return lines(
    `<div class="cover cover--${(project.number - 1) % 4}" aria-hidden="true">`,
    `  <span class="cover-num">${pad(project.number)}</span>`,
    `  <span class="cover-title">${esc(project.title)}</span>`,
    project.category && `  <span class="cover-meta">${esc(project.category)}</span>`,
    "</div>"
  );
}

function media(project, root, opts = {}) {
  return project.thumbnail ? image({ img: project.thumbnail, root, ...opts }) : cover(project);
}

const projectHref = (project, root) => `${root}projects/${project.slug}.html`;

function titleLink(project, root) {
  return project.detailPage
    ? `<a class="stretched-link" href="${projectHref(project, root)}">${esc(project.title)}</a>`
    : esc(project.title);
}

function tagList(items, cls = "tags") {
  if (!items.length) return "";
  return `<ul class="${cls}" role="list">${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
}

/** Large alternating rows used for featured projects on the home page. */
function featuredProjects({ projects, root }) {
  const featured = projects.filter((p) => p.featured);
  if (!featured.length) {
    return `<p class="empty-note">No featured projects yet. <a href="${root}Projects.html">See all projects</a>.</p>`;
  }
  return lines(
    '<ol class="feature-list" role="list">',
    featured.map((p) =>
      lines(
        `  <li class="feature${p.detailPage ? " is-linked" : ""}" data-reveal>`,
        `    <div class="feature-media">`,
        indent(media(p, root, { sizes: "(min-width: 64em) 58vw, 100vw" }), "      "),
        "    </div>",
        '    <div class="feature-body">',
        `      <p class="eyebrow"><span class="eyebrow-num">${pad(p.number)}</span>${esc([p.category, p.year].filter(Boolean).join(" · "))}</p>`,
        `      <h3 class="feature-title">${titleLink(p, root)}</h3>`,
        `      <p class="feature-summary">${esc(p.shortDescription)}</p>`,
        `      ${tagList(p.technologies.slice(0, 5))}`,
        p.detailPage ? `      <span class="text-cta" aria-hidden="true">View case study ${icons.arrowRight}</span>` : "",
        "    </div>",
        "  </li>"
      )
    ),
    "</ol>"
  );
}

/** The full project index on Projects.html. */
function projectIndex({ projects, root }) {
  if (!projects.length) return '<p class="empty-note">Projects are on their way.</p>';
  return lines(
    '<ol class="work-list" role="list">',
    projects.map((p) =>
      lines(
        `  <li class="work${p.detailPage ? " is-linked" : ""}" id="${esc(p.slug)}" data-reveal>`,
        `    <span class="work-num" aria-hidden="true">${pad(p.number)}</span>`,
        '    <div class="work-media">',
        indent(media(p, root, { sizes: "(min-width: 64em) 30vw, 100vw" }), "      "),
        "    </div>",
        '    <div class="work-body">',
        `      <h2 class="work-title">${titleLink(p, root)}</h2>`,
        `      <p class="work-summary">${esc(p.shortDescription)}</p>`,
        `      ${tagList(p.technologies.slice(0, 6))}`,
        "    </div>",
        '    <dl class="work-meta">',
        p.category && `      <div><dt>Type</dt><dd>${esc(p.category)}</dd></div>`,
        p.year && `      <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>`,
        p.role && `      <div><dt>Role</dt><dd>${esc(p.role)}</dd></div>`,
        p.status && `      <div><dt>Status</dt><dd><span class="badge">${esc(p.status)}</span></dd></div>`,
        "    </dl>",
        p.detailPage
          ? `    <span class="work-cta" aria-hidden="true">Case study ${icons.arrowRight}</span>`
          : `    <span class="work-cta work-cta--muted">Details coming soon</span>`,
        "  </li>"
      )
    ),
    "</ol>"
  );
}

/** A complete, standalone case-study page for one project. */
function projectPage({ project: p, projects, site }) {
  const root = "../";
  const url = `${site.url}/projects/${p.slug}.html`;
  const ogImage = p.thumbnail && !/\.svg$/i.test(p.thumbnail.src) ? `${site.url}/${encodePath(p.thumbnail.src)}` : `${site.url}/assets/img/og-image.jpg`;
  const linked = projects.filter((x) => x.detailPage);
  const at = linked.indexOf(p);
  const prev = linked[(at - 1 + linked.length) % linked.length];
  const next = linked[(at + 1) % linked.length];

  // The cover image is the thumbnail; its gallery caption (if any) is reused under it.
  const coverItem = p.thumbnail && p.gallery.find((g) => g.src === p.thumbnail.src);
  const gallery = p.gallery.filter((g) => !p.thumbnail || g.src !== p.thumbnail.src);

  const spec = [
    ["Role", p.role],
    ["When", p.period || p.year],
    ["Team", p.team],
    ["Type", p.category],
    ["Status", p.status],
  ].filter(([, v]) => v);

  const actions = [
    p.liveUrl && `<a class="button button--solid" href="${esc(p.liveUrl)}" target="_blank" rel="noopener">View live project ${icons.arrowUpRight}<span class="visually-hidden"> (opens in a new tab)</span></a>`,
    p.repositoryUrl && `<a class="button" href="${esc(p.repositoryUrl)}" target="_blank" rel="noopener">${icons.github} View repository<span class="visually-hidden"> (opens in a new tab)</span></a>`,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.shortDescription,
    url,
    author: { "@type": "Person", name: site.name, url: site.url + "/" },
    ...(p.technologies.length && { keywords: p.technologies.join(", ") }),
    ...(p.repositoryUrl && { sameAs: p.repositoryUrl }),
  };

  const section = (s, i) =>
    lines(
      `<section class="prose-section" aria-labelledby="section-${i + 1}">`,
      `  <h2 id="section-${i + 1}">${esc(s.heading)}</h2>`,
      (s.paragraphs || []).map((t) => `  <p>${esc(t)}</p>`),
      s.points && s.points.length ? lines('  <ul class="points">', s.points.map((t) => `    <li>${esc(t)}</li>`), "  </ul>") : "",
      "</section>"
    );

  return lines(
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    `    ${GENERATED_NOTICE}`,
    '    <meta charset="utf-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
    `    <title>${esc(p.title)} | ${esc(site.name)}</title>`,
    `    <meta name="description" content="${esc(p.shortDescription)}" />`,
    `    <link rel="canonical" href="${url}" />`,
    '    <meta property="og:type" content="article" />',
    `    <meta property="og:site_name" content="${esc(site.name)}" />`,
    `    <meta property="og:title" content="${esc(p.title)}" />`,
    `    <meta property="og:description" content="${esc(p.shortDescription)}" />`,
    `    <meta property="og:url" content="${url}" />`,
    `    <meta property="og:image" content="${ogImage}" />`,
    '    <meta name="twitter:card" content="summary_large_image" />',
    head({ root })
      .split("\n")
      .map((l) => "    " + l),
    `    <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
    "  </head>",
    '  <body class="page-case">',
    header({ root, current: "Projects.html", site }),
    '    <main id="main">',
    '      <article class="case">',
    '        <header class="case-head container">',
    '          <nav class="crumbs" aria-label="Breadcrumb">',
    `            <ol role="list"><li><a href="${root}Projects.html">Projects</a></li><li><span aria-current="page">${esc(p.title)}</span></li></ol>`,
    "          </nav>",
    `          <p class="eyebrow"><span class="eyebrow-num">${pad(p.number)}</span>${esc(p.category || "Project")}</p>`,
    `          <h1 class="case-title">${esc(p.title)}</h1>`,
    `          <p class="lede">${esc(p.shortDescription)}</p>`,
    actions.length ? `          <div class="button-row">${actions.join("")}</div>` : "",
    "        </header>",
    spec.length
      ? lines(
          '        <div class="container">',
          '          <dl class="spec">',
          spec.map(([k, v]) => `            <div><dt>${k}</dt><dd>${esc(v)}</dd></div>`),
          "          </dl>",
          "        </div>"
        )
      : "",
    p.thumbnail
      ? lines(
          '        <figure class="case-cover container">',
          `          ${image({ img: p.thumbnail, root, eager: true, sizes: "(min-width: 80em) 76rem, 100vw" })}`,
          coverItem && coverItem.caption ? `          <figcaption>${esc(coverItem.caption)}</figcaption>` : "",
          "        </figure>"
        )
      : "",
    '        <div class="container case-body">',
    '          <div class="case-main prose">',
    p.description.length
      ? lines(
          '            <section class="prose-section" aria-labelledby="overview">',
          '              <h2 id="overview">Overview</h2>',
          p.description.map((t) => `              <p>${esc(t)}</p>`),
          "            </section>"
        )
      : "",
    p.caseStudy.map((s, i) => section(s, i).split("\n").map((l) => "            " + l)),
    "          </div>",
    p.facts.length || p.technologies.length
      ? lines(
          '          <aside class="case-aside" aria-label="Project details">',
          p.facts.length
            ? lines(
                '            <dl class="facts">',
                p.facts.map((f) => `              <div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`),
                "            </dl>"
              )
            : "",
          p.technologies.length
            ? lines('            <h2 class="aside-title">Tools &amp; technologies</h2>', `            ${tagList(p.technologies)}`)
            : "",
          "          </aside>"
        )
      : "",
    "        </div>",
    gallery.length
      ? lines(
          '        <section class="gallery container" aria-labelledby="gallery-title">',
          '          <h2 class="section-title" id="gallery-title">Gallery</h2>',
          '          <div class="gallery-grid">',
          gallery.map((g) =>
            lines(
              '            <figure class="gallery-item" data-reveal>',
              `              <a class="gallery-link" href="${root}${encodePath(g.src)}" data-lightbox>`,
              `                ${image({ img: g, root, sizes: "(min-width: 64em) 50vw, 100vw" })}`,
              `                <span class="gallery-zoom">${icons.expand}<span class="visually-hidden">Enlarge image</span></span>`,
              "              </a>",
              g.caption ? `              <figcaption>${esc(g.caption)}</figcaption>` : "",
              "            </figure>"
            )
          ),
          "          </div>",
          "        </section>"
        )
      : "",
    linked.length > 1
      ? lines(
          '        <nav class="pager container" aria-label="More projects">',
          `          <a class="pager-link" href="${prev.slug}.html" rel="prev"><span class="pager-dir">${icons.arrowLeft} Previous</span><span class="pager-title">${esc(prev.title)}</span></a>`,
          `          <a class="pager-link pager-link--next" href="${next.slug}.html" rel="next"><span class="pager-dir">Next ${icons.arrowRight}</span><span class="pager-title">${esc(next.title)}</span></a>`,
          "        </nav>"
        )
      : "",
    "      </article>",
    "    </main>",
    footer({ root, site }),
    "  </body>",
    "</html>",
    ""
  );
}

function sitemap({ site, pages }) {
  return lines(
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    pages.map((p) => `  <url><loc>${site.url}/${p === "index.html" ? "" : p}</loc></url>`),
    "</urlset>",
    ""
  );
}

module.exports = {
  GENERATED_NOTICE,
  esc,
  head,
  header,
  footer,
  contactList,
  featuredProjects,
  projectIndex,
  projectPage,
  sitemap,
};
