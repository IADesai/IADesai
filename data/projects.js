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
    slug: "seed-melon",
    title: "Seed Melon",
    published: true,
    featured: true,
    category: "Ethical startup launchpad",
    year: "2025–",
    period: "Sep 2025 – Present",
    status: "Pre-launch",
    role: "Project Lead & Head Developer",
    team: "",
    shortDescription:
      "An ethical startup launchpad: a next-generation platform for startups, launching soon in the UK, EU and US.",
    description: [
      "Seed Melon is an ethical startup launchpad, a platform built to help founders get new ventures off the ground in a way that stays true to their values.",
      "I am leading the creation of the MVP as project lead and head developer. The pre-launch site is live at seedmelon.com, where people can sign up to be notified at launch.",
    ],
    technologies: [],
    thumbnail: {
      src: "assets/projects/seed-melon/landing.webp",
      alt: "Seed Melon pre-launch page: the Seed Melon wordmark with a watermelon slice, over a green-to-red gradient, with an email sign-up box",
    },
    gallery: [],
    liveUrl: "https://seedmelon.com/",
    repositoryUrl: "",
    facts: [],
    caseStudy: [
      {
        heading: "My role",
        paragraphs: [],
        points: [
          "Project lead and head developer",
          "Leading creation of the MVP for an ethical startup launchpad",
          "Pre-launch stage, with a live landing page and launch waitlist",
        ],
      },
    ],
  },

  {
    slug: "media-sentiment",
    title: "Coup",
    published: true,
    featured: true,
    category: "Data engineering",
    year: "2023–",
    period: "Sep 2023 – Present",
    role: "Lead Engineer & Quality Assurance",
    team: "Originally a team of 4",
    shortDescription:
      "Media vs public: how differently the press and the public feel about the same stories. The evolution of my Media Sentiment pipeline.",
    description: [
      "Despite reporting on the same topics, different media organisations can have wildly different coverage and messages. Coup measures that gap: it scores the sentiment of news coverage and of public posts on the same topics, and shows where the two disagree.",
      "Coup started life in 2023 as Media Sentiment, a data pipeline that used NLP to calculate the attitude within text from the BBC, the Daily Mail and Reddit, with each story categorised by AI. It has since grown into Coup, with a new public front end at coup.digital.",
      "Alongside the sentiment comparison, Coup surfaces real reporting from inside Sudan, from the people closest to it, so readers can make up their own minds.",
    ],
    technologies: [
      "Python",
      "NLP sentiment analysis",
      "AI summarisation",
      "AWS",
      "PostgreSQL (RDS)",
      "Terraform",
      "Docker",
      "Tableau",
      "pytest",
      "GitHub Actions",
    ],
    thumbnail: {
      src: "assets/projects/coup/title-screen.webp",
      alt: "Coup title screen: a yellow pixel-art COUP logo above the words Media vs Public and Press Start, on a dark retro grid",
    },
    gallery: [
      {
        src: "assets/projects/coup/title-screen.webp",
        alt: "Coup title screen with a pixel-art logo and a Press Start prompt",
        caption: "Coup's arcade-style title screen at coup.digital.",
      },
      {
        src: "assets/projects/coup/topic-cloud.webp",
        alt: "A cloud of 3D topic words such as United States, Brazil and Ukraine, with World and Sudan tabs above",
        caption: "Pick a word: the topics in today's news, with separate World and Sudan views.",
      },
      {
        src: "assets/projects/coup/topic-detail.webp",
        alt: "Topic view for Brazil: public sentiment +13% beside media sentiment +24%, an AI summary of the headlines, and sentiment by outlet",
        caption: "Topic view: public vs media sentiment, an AI summary of the headlines, the gap between them, and an outlet-by-outlet breakdown.",
      },
      {
        src: "assets/projects/media-sentiment/dashboard.webp",
        alt: "Tableau dashboard: 5,681 stories, average sentiment per outlet, and a bar chart of popular topics by source",
        caption: "Where it started (2023): the main Tableau dashboard, with headline figures and popular topics by source.",
      },
      {
        src: "assets/projects/media-sentiment/stories-by-topic.webp",
        alt: "Word cloud of story topics beside a table of headlines with their sentiment scores",
        caption: "2023: stories by topic, with a topic word cloud alongside individual headlines and their sentiment scores.",
      },
      {
        src: "assets/projects/media-sentiment/email-report.webp",
        alt: "Media Sentiment Report PDF with BBC and Daily Mail sentiment gauges, most popular topics, and highest and lowest sentiment stories",
        caption: "2023: the emailed PDF report, with sentiment gauges, the most popular topics, and the day's highest and lowest sentiment stories.",
      },
      {
        src: "assets/projects/media-sentiment/architecture-diagram.svg",
        alt: "Architecture diagram of the AWS Step Functions workflow powering the pipelines",
        caption: "2023: the original system architecture on AWS.",
      },
    ],
    liveUrl: "https://coup.digital/",
    repositoryUrl: "https://github.com/IADesai/media-sentiment",
    facts: [
      { value: "10+", label: "News outlets compared" },
      { value: "−100% → +100%", label: "Sentiment scale" },
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
        heading: "From Media Sentiment to Coup",
        paragraphs: [
          "The first version compared the BBC and the Daily Mail against Reddit, and reported its findings through Tableau dashboards and a daily email. Coup takes the same idea to a public audience.",
        ],
        points: [
          "Media coverage now spans outlets including the BBC, The Guardian, Al Jazeera, the New York Times, Sky News, France 24 and the Daily Mail",
          "Public sentiment now comes from Bluesky and Lemmy",
          "Every topic shows the gap between media and public sentiment, an AI summary of the headlines, and the most negative and positive stories",
          "A dedicated Sudan view puts ground-level reporting alongside the numbers",
        ],
      },
      {
        heading: "How the original pipeline works",
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
];
