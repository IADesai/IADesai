/**
 * Site-wide settings used by the build (tools/build.js) to render the shared
 * header, footer, contact list and sitemap. Edit here, then run `npm run build`.
 */
module.exports = {
  name: "Ibrahim Ayub Desai",
  // Public address, used for canonical URLs and the sitemap. No trailing slash.
  url: "https://www.ibrahimayubdesai.com",

  // Main navigation, in order. `href` is a page in docs/.
  nav: [
    { href: "index.html", label: "Home" },
    { href: "AboutMe.html", label: "About Me" },
    { href: "Resume.html", label: "Resume" },
    { href: "Projects.html", label: "Projects" },
    { href: "Contact.html", label: "Contact" },
  ],

  // Contact methods, shown on the Contact page and in every footer.
  contacts: [
    { id: "email", label: "Email", value: "ibrahim.desai02@gmail.com", href: "mailto:ibrahim.desai02@gmail.com" },
    { id: "linkedin", label: "LinkedIn", value: "in/ibrahimdesai", href: "https://www.linkedin.com/in/ibrahimdesai/", external: true },
    { id: "github", label: "GitHub", value: "IADesai", href: "https://github.com/IADesai", external: true },
    { id: "phone", label: "Phone", value: "+44 7486 600030", href: "tel:+447486600030" },
  ],
};
