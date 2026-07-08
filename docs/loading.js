// Shared site behaviour: loading screen, mobile navigation, hero parallax,
// and scroll-in reveals. Loaded at the end of <body> on every page.
(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Loading screen (full animation only on first visit per session) ---- */
  var loadingScreen = document.getElementById("loading-screen");
  var loadingProgress = document.getElementById("loading-progress");
  var alreadyVisited = false;
  try {
    alreadyVisited = sessionStorage.getItem("iad-visited") === "1";
  } catch (e) {}

  if (loadingScreen) {
    var hideLoadingScreen = function () {
      loadingScreen.style.opacity = "0";
      setTimeout(function () {
        loadingScreen.classList.add("skip");
      }, 500);
    };

    if (alreadyVisited || reduceMotion) {
      loadingScreen.classList.add("skip");
    } else {
      if (loadingProgress) loadingProgress.style.width = "30%";
      window.addEventListener("load", function () {
        if (loadingProgress) loadingProgress.style.width = "100%";
        setTimeout(hideLoadingScreen, 700);
      });
      // Safety net: never trap the visitor behind the loader
      setTimeout(hideLoadingScreen, 4000);
      try {
        sessionStorage.setItem("iad-visited", "1");
      } catch (e) {}
    }
  }

  /* ---- Mobile navigation ---- */
  var hamburger = document.querySelector(".hamburger");
  var navBar = document.querySelector(".nav-bar");
  if (hamburger && navBar) {
    hamburger.setAttribute("role", "button");
    hamburger.setAttribute("tabindex", "0");
    hamburger.setAttribute("aria-label", "Toggle navigation menu");
    hamburger.setAttribute("aria-expanded", "false");

    var setMenu = function (open) {
      navBar.classList.toggle("active", open);
      hamburger.classList.toggle("active", open);
      hamburger.setAttribute("aria-expanded", String(open));
    };

    hamburger.addEventListener("click", function () {
      setMenu(!navBar.classList.contains("active"));
    });
    hamburger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setMenu(!navBar.classList.contains("active"));
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---- Hero parallax (home page only) ---- */
  var heroBg = document.querySelector("header .background");
  var heroFg = document.querySelector("header .foreground");
  var heroTitle = document.querySelector("header .title");
  if (heroBg && heroFg && !reduceMotion) {
    var ticking = false;
    var renderParallax = function () {
      ticking = false;
      var y = Math.max(0, window.scrollY || window.pageYOffset || 0);
      heroBg.style.transform = "translate3d(0," + (y * 0.5).toFixed(1) + "px,0)";
      heroFg.style.transform = "translate3d(0," + (y * 0.3).toFixed(1) + "px,0)";
      if (heroTitle) {
        heroTitle.style.transform = "translate3d(0," + (y * 0.2).toFixed(1) + "px,0)";
        heroTitle.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.55)).toFixed(3);
      }
    };
    var queueParallax = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(renderParallax);
      }
    };
    window.addEventListener("scroll", queueParallax, { passive: true });
    window.addEventListener("resize", queueParallax);
    renderParallax();
  }

  /* ---- Scroll-in reveals ---- */
  var revealTargets = document.querySelectorAll("section, .project-box");
  if (!reduceMotion && "IntersectionObserver" in window && revealTargets.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }
})();
