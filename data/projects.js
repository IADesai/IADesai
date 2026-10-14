/**
 * PORTFOLIO PROJECTS: the single source of truth for every project on the site.
 *
 * Edit this file, then run `npm run build` (or `node tools/build.js`).
 * The build regenerates:
 *   - docs/projects/<slug>.html        one case-study page per project
 *   - the project list on docs/Projects.html
 *   - the featured projects on docs/index.html
 *   - docs/sitemap.xml
 *
 * Projects appear in the order they are listed here.
 * See PROJECTS.md for a step-by-step guide and a copy-paste template.
 *
 * FIELDS (* = required)
 *   slug*             Stable identifier and URL: projects/<slug>.html. Lowercase letters,
 *                     numbers and hyphens. Changing it changes the page URL.
 *   title*            Project name.
 *   shortDescription* One or two sentences used on cards and as the page's meta description.
 *   published         false hides the project everywhere (default true).
 *   featured          true also shows the project on the home page (default false).
 *   detailPage        false lists the project without generating a case-study page (default true).
 *   category          Short label, e.g. "Data engineering".
 *   year              Shown on cards, e.g. "2023".
 *   period            Longer date range shown on the case study, e.g. "Dec 2024 – Jul 2025".
 *   status            Optional badge, e.g. "Pre-launch".
 *   role              Your role.
 *   team              Team context, e.g. "Team of 4".
 *   description       Array of paragraphs for the overview.
 *   technologies      Array of tools and technologies.
 *   thumbnail         { src, alt }: main image. Paths are relative to the docs/ folder.
 *                     Without one, a typographic cover is drawn automatically.
 *   gallery           Array of { src, alt, caption } shown on the case study.
 *   liveUrl           Link to the live project.
 *   repositoryUrl     Link to the source code.
 *   facts             Array of { value, label } key figures, e.g. { value: "89%", label: "Test coverage" }.
 *   caseStudy         Array of sections: { heading, paragraphs: [...], points: [...] }.
 *
 * All text is plain text: it is escaped when rendered, so characters like < & " are safe.
 */
module.exports = [
  {
    slug: "media-sentiment",
    title: "Media Sentiment",
    published: true,
    featured: true,
    category: "Data engineering",
    year: "2023–",
    period: "Sep 2023 – Present",
    role: "Lead Engineer & Quality Assurance",
    team: "Originally a team of 4",
    shortDescription:
      "A project designed to evidence the bias of media outlets on current topics.",
    description: [
      "Despite reporting on the same topics, different media organisations can have wildly different coverage and messages. Collecting and analysing data on how coverage differs between organisations helps us understand the media landscape and its bias.",
      "The pipeline uses NLP to calculate the attitude within text used by the BBC, the Daily Mail and Reddit/BlueSky, comparing the negative or positive sentiment held on current topics, with each story categorised by AI.",
      "The project now lives on as Coup, the Media Sentiment Analyser at coup.digital.",
    ],
    technologies: [
      "Python",
      "NLP sentiment analysis",
      "ChatGPT",
      "AWS",
      "PostgreSQL (RDS)",
      "Terraform",
      "Docker",
      "Tableau",
      "pytest",
      "GitHub Actions",
    ],
    thumbnail: {
      src: "assets/projects/media-sentiment/dashboard.webp",
      alt: "Media Sentiment Tableau dashboard showing total stories, average BBC and Daily Mail sentiment, and popular topics by source",
    },
    gallery: [
      {
        src: "assets/projects/media-sentiment/dashboard.webp",
        alt: "Tableau dashboard: 5,681 stories, average sentiment per outlet, and a bar chart of popular topics by source",
        caption: "Main Tableau dashboard: headline figures and popular topics by source, filterable by outlet and date.",
      },
      {
        src: "assets/projects/media-sentiment/stories-by-topic.webp",
        alt: "Word cloud of story topics beside a table of headlines with their sentiment scores",
        caption: "Stories by topic: a topic word cloud alongside individual headlines and their sentiment scores.",
      },
      {
        src: "assets/projects/media-sentiment/email-report.webp",
        alt: "Media Sentiment Report PDF with BBC and Daily Mail sentiment gauges, most popular topics, and highest and lowest sentiment stories",
        caption: "The emailed PDF report: sentiment gauges, the most popular topics, and the day's highest and lowest sentiment stories.",
      },
      {
        src: "assets/projects/media-sentiment/architecture-diagram.svg",
        alt: "Architecture diagram of the AWS Step Functions workflow powering the pipelines",
        caption: "System architecture on AWS.",
      },
    ],
    liveUrl: "https://coup.digital/",
    repositoryUrl: "https://github.com/IADesai/media-sentiment",
    facts: [
      { value: "2", label: "Dashboards built" },
      { value: "−1 → 1", label: "Sentiment scale" },
    ],
    caseStudy: [
      {
        heading: "My role",
        paragraphs: [
          "Lead engineer and quality assurance. The original 2023 build was delivered by a team of four, working in an Agile way.",
        ],
        points: [
          "Agile development of the project",
          "Cloud resource initialisation",
          "Fabricating 2 dashboards",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "UK news articles are extracted from different RSS feeds, and related articles from other outlets are matched up alongside comments about the same story on Reddit.",
        ],
        points: [
          "Sentiment analysis scores every article and comment from −1 (most negative) to 1 (most positive)",
          "Topic keywords are extracted with ChatGPT so coverage of the same story can be linked across sources",
          "Everything is loaded into a PostgreSQL database on AWS RDS",
          "A Tableau dashboard visualises the results, and an email report with a PDF attached shares the day's most popular stories and key insights",
        ],
      },
      {
        heading: "Engineering practice",
        paragraphs: [],
        points: [
          "Separate pipelines for news feeds and public (Reddit) sentiment",
          "AWS resources set up and torn down with Terraform",
          "GitHub Actions run pytest and pylint on every pull request into main",
        ],
      },
    ],
  },

  {
    slug: "cycle-pricing",
    title: "Mock Cycle Prices App",
    published: true,
    featured: true,
    category: "Data visualisation",
    year: "2023",
    period: "2023 · UCL coursework (COMP0034)",
    role: "",
    team: "The Coding Cyclists",
    shortDescription:
      "A project aimed to adjust TFL cycle hire pricing, via an algorithm that adjusts the price of the cycle hire dependent on hourly and monthly TFL cycle hire data, alongside PM 2.5 pollution levels across the boroughs of London.",
    description: [
      "The aim was to create a price map that increases TFL revenue by promoting cycle hire and taking advantage of rush hour prices, as well as promoting cycle hire in highly polluted boroughs with hopes to reduce pollution across greater London.",
    ],
    technologies: ["Python", "Dash (Plotly)", "pytest", "Selenium", "Coverage", "flake8", "GitHub Actions"],
    thumbnail: {
      src: "assets/projects/cycle-pricing/pricing-map.webp",
      alt: "TFL Cycle Hire Pricing app home page with a choropleth map of cycle hire prices across London boroughs",
    },
    gallery: [
      {
        src: "assets/projects/cycle-pricing/pricing-map.webp",
        alt: "Choropleth map of London boroughs coloured by cycle hire price, with time-of-day and month dropdowns",
        caption: "Home: the pricing choropleth map, filterable by time of day and month of year.",
      },
      {
        src: "assets/projects/cycle-pricing/daily-data.webp",
        alt: "Bar chart of hourly cycle hires for Sunday 1 July 2018",
        caption: "Daily data: cycle hire usage by hour.",
      },
      {
        src: "assets/projects/cycle-pricing/monthly-data.webp",
        alt: "Bar chart of average cycle hire usage for each month of the year",
        caption: "Monthly data: average cycle hire usage per month.",
      },
      {
        src: "assets/projects/cycle-pricing/pollution-map.webp",
        alt: "Choropleth map of total recorded PM 2.5 particles for each London borough",
        caption: "Pollution data: total recorded PM 2.5 per borough.",
      },
    ],
    liveUrl: "",
    repositoryUrl: "https://github.com/IADesai/Cycle-Pricing-App",
    facts: [
      { value: "15", label: "Automated tests, all passing" },
      { value: "89%", label: "Test coverage" },
    ],
    caseStudy: [
      {
        heading: "The app",
        paragraphs: [
          "The Dash app's main feature is an interactive pricing choropleth map, letting users identify the price of Santander cycles in different boroughs of London, at different times of day and in different months of the year.",
          "The map can be broken down into the graphs behind it, visualising the hourly, monthly and pollution data used to form it. These sit in tabs on a sidebar for users to view and analyse.",
        ],
        points: [],
      },
      {
        heading: "Testing and continuous integration",
        paragraphs: [
          "Because the multi-page app's sidebar wasn't testable, a single-page version of the app was created specifically for testing.",
        ],
        points: [
          "15 tests written with pytest and Selenium, each documented using the GIVEN-WHEN-THEN approach",
          "Coverage reports showed 89% coverage across the tested files",
          "A GitHub Actions workflow lints with flake8 and runs pytest with coverage on every commit to main",
        ],
      },
    ],
  },

  {
    slug: "halal-stints",
    title: "Halal Stints",
    published: true,
    featured: false,
    category: "Web & mobile app",
    year: "2024–25",
    period: "Dec 2024 – Jul 2025",
    role: "Solo Developer",
    team: "",
    shortDescription:
      "A platform for Muslims and non-Muslims to find short-term work that aligns with their values.",
    description: [
      "An app (web and mobile) built for finding short-term jobs for employees, and filling spaces for employers, both of whom share the same ethics and morals.",
    ],
    technologies: ["PetiteVue.js", "Python", "Firebase", "GitHub"],
    thumbnail: null,
    gallery: [],
    liveUrl: "",
    repositoryUrl: "https://github.com/IADesai/halalstints",
    facts: [],
    caseStudy: [
      {
        heading: "Build",
        paragraphs: [],
        points: [
          "Ideated and built the app solo",
          "PetiteVue.js for the front-end and Python for the back-end",
          "DevOps done with Firebase, and versioned with GitHub",
        ],
      },
    ],
  },

  {
    slug: "accelorate",
    title: "Accelorate",
    published: true,
    featured: false,
    detailPage: false,
    category: "Ethical startup launchpad",
    year: "2025–",
    period: "Sep 2025 – Present",
    status: "Pre-launch",
    role: "Project Lead & Head Developer",
    team: "",
    shortDescription: "Leading creation of an MVP for an ethical startup launchpad.",
    description: [],
    technologies: [],
    thumbnail: null,
    gallery: [],
    liveUrl: "",
    repositoryUrl: "",
    facts: [],
    caseStudy: [],
  },
];
