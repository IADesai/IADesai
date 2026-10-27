# Managing projects on ibrahimayubdesai.com

Every project on the site comes from **one file: [`data/projects.js`](data/projects.js)**.
You edit that file, run one command, and the site regenerates:

| What                                     | Where it appears                          |
| ---------------------------------------- | ----------------------------------------- |
| Every published project                  | `docs/Projects.html` (the project list)   |
| Projects with `featured: true`           | `docs/index.html` (Featured projects)     |
| A case-study page per project            | `docs/projects/<slug>.html`               |
| Sitemap for search engines               | `docs/sitemap.xml`                        |

You never edit those generated parts by hand. Anything between `<!-- build:… -->` and
`<!-- /build:… -->` markers, and every file in `docs/projects/`, is overwritten on the next build.

---

## One-time setup

Install [Node.js](https://nodejs.org) 18 or newer. There are no packages to install.

## The everyday loop

```bash
npm run build      # validate data/projects.js and regenerate the pages
npm run preview    # open http://localhost:8080 to check it
```

When it looks right, commit and push. GitHub Pages publishes the `docs/` folder automatically:

```bash
git add -A
git commit -m "Add Weather Dashboard project"
git push
```

If you forget to run the build, the **Site check** GitHub Action fails on your push and tells you
which files are out of date. Run `npm run build`, commit, and push again.

---

## Add a new project

1. **Add the images.** Create a folder named after the project and put the images in it:

   ```
   docs/assets/projects/weather-dashboard/
     ├─ home.webp
     └─ forecast.webp
   ```

   Use WebP or JPEG, about 1600px wide. The build warns you about any image over 600 KB.
   (Free converter: <https://squoosh.app>.)

2. **Add an entry** to `data/projects.js`. Copy this block into the list, in the position
   you want it to appear (projects show in the order they're listed):

   ```js
   {
     slug: "weather-dashboard",            // URL becomes projects/weather-dashboard.html
     title: "Weather Dashboard",
     published: true,
     featured: false,                      // true = also show on the home page
     category: "Data visualisation",
     year: "2026",
     period: "Jan 2026 – Mar 2026",
     role: "Solo Developer",
     team: "",
     shortDescription: "One or two sentences for the project list and search results.",
     description: [
       "First overview paragraph.",
       "Second overview paragraph.",
     ],
     technologies: ["Python", "Streamlit", "Plotly"],
     thumbnail: {
       src: "assets/projects/weather-dashboard/home.webp",
       alt: "Describe what the image shows, for people who can't see it",
     },
     gallery: [
       {
         src: "assets/projects/weather-dashboard/forecast.webp",
         alt: "Seven-day forecast chart for London",
         caption: "Forecast view: optional caption shown under the image.",
       },
     ],
     liveUrl: "https://example.com",
     repositoryUrl: "https://github.com/IADesai/weather-dashboard",
     facts: [{ value: "12k", label: "Readings processed per day" }],
     caseStudy: [
       {
         heading: "My role",
         paragraphs: ["A paragraph of text."],
         points: ["A bullet point", "Another bullet point"],
       },
     ],
   },
   ```

3. Run `npm run build`, then `npm run preview`, and check the new page.

**Only `slug`, `title` and `shortDescription` are required.** Leave anything else out (or empty)
and that part of the page simply doesn't appear:

- No `thumbnail`: a typographic cover with the project's title is drawn instead.
- No `liveUrl` / `repositoryUrl`: the button is hidden.
- No `gallery`, `facts`, `technologies` or `caseStudy`: those sections are skipped.
- `detailPage: false`: the project is listed without a case-study page, which is useful for
  projects that aren't ready to write up yet.

## Rewrite an existing project

Find the project in `data/projects.js` by its `title` and edit the text. Text is plain text:
quotes, ampersands and `<` are all safe, because the build escapes them. Run `npm run build`.

To use an apostrophe inside a string, keep using double quotes around it:
`"The app's main feature"`.

## Replace a project's images

1. Put the new file in `docs/assets/projects/<slug>/`.
2. Point `thumbnail.src` (or a `gallery` item's `src`) at it, and update its `alt` text.
3. Run `npm run build`. It fails with a clear message if a path is wrong.
4. Delete the old image file if nothing uses it any more.

The build reads each image's real width and height, so pages don't jump while images load.

## Add or remove technologies

Edit the `technologies` list:

```js
technologies: ["Python", "Dash (Plotly)", "pytest"],
```

Cards show the first 5–6; the case-study page shows them all.

## Update live and repository links

```js
liveUrl: "https://my-app.example.com",                    // must start with https://
repositoryUrl: "https://github.com/IADesai/my-app",
```

Set either to `""` to hide its button.

## Feature or unfeature a project

`featured: true` adds the project to **Featured projects** on the home page. `false` removes it.
Featured projects appear in the same order as in the file.

## Hide a project without deleting it

`published: false` removes it from the site entirely, including its page. The build deletes the old
generated page for you. Set it back to `true` to restore it.

## Add a new section to a case study

Add another object to `caseStudy`. Sections appear in order, below the overview:

```js
caseStudy: [
  { heading: "My role", paragraphs: ["..."], points: [] },
  { heading: "Lessons learned", paragraphs: ["What I'd do differently..."], points: ["...", "..."] },
],
```

`paragraphs` become paragraphs and `points` become a bulleted list. Either can be empty.

## Change a project's URL

The URL comes from `slug`. Changing the slug moves the page to a new address and the old one stops
working, so avoid changing slugs of projects you've already shared. If you must, the build removes
the old page automatically.

---

## Other things you might edit

| To change…                                       | Edit                                                   |
| ------------------------------------------------ | ------------------------------------------------------ |
| Navigation links, email, phone, LinkedIn, GitHub | `data/site.js`, then `npm run build`                   |
| About Me, Resume or home-page text               | The page itself in `docs/` (outside build markers)     |
| Colours, fonts, spacing                          | Tokens at the top of `docs/assets/css/main.css`        |
| Layout of case studies / project cards           | `tools/templates.js`                                   |
| The CV                                           | Replace `docs/Ibrahim Ayub Desai CV.pdf` (same name), **and** update the text in `docs/Resume.html` to match. The Resume page is real HTML text (readable by search engines and screen readers), not an image of the PDF. |

## When the build reports an error

The build checks everything before writing anything, so a mistake never half-updates the site.
Common messages:

- `missing required field "title"`: every project needs `slug`, `title` and `shortDescription`.
- `image not found at docs/assets/...`: the path in `src` doesn't match the file (check spelling and capitals).
- `needs "alt" text`: describe the image.
- `slug "My Project" may only use lowercase letters…`: use `my-project`.
- `broken link "..."`: a page links to a file that doesn't exist.
- `SyntaxError` pointing into `data/projects.js`: usually a missing comma between projects or a missing quote.
