/*
 * Site behaviour, layered on top of fully working HTML:
 * first-visit intro, mobile menu, header state, hero parallax,
 * scroll reveals, gallery lightbox and copy-to-clipboard.
 * Each feature is independent and does nothing if its markup is absent.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- First-visit intro (started by the inline boot script in <head>) ---- */
  try {
    sessionStorage.setItem("iad-visited", "1");
  } catch (e) {}
  if (root.classList.contains("has-intro")) {
    setTimeout(function () {
      root.classList.remove("has-intro");
    }, 1800);
  }

  /* ---- Header: border once scrolled ---- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (header && toggle && nav) {
    root.classList.add("nav-ready");
    var desktop = window.matchMedia("(min-width: 52em)");
    var outside = document.querySelectorAll("main, .site-footer");
    var label = toggle.querySelector(".nav-toggle-label");

    var setOpen = function (open, restoreFocus) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
      document.body.classList.toggle("menu-open", open);
      outside.forEach(function (el) {
        el.inert = open;
      });
      if (!open && restoreFocus) toggle.focus();
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) setOpen(false, true);
    });
    desktop.addEventListener("change", function () {
      if (desktop.matches) setOpen(false);
    });
  }

  /* ---- Hero parallax: the name drifts behind the subject as you scroll ---- */
  var hero = document.querySelector(".hero-stage");
  var layers = hero ? hero.querySelectorAll("[data-depth]") : [];
  if (hero && layers.length && !reduceMotion.matches) {
    var title = hero.querySelector(".hero-title");
    var ticking = false;
    var render = function () {
      ticking = false;
      var y = Math.max(0, window.scrollY);
      var height = hero.offsetHeight;
      if (y > height) return;
      layers.forEach(function (layer) {
        var depth = parseFloat(layer.getAttribute("data-depth")) || 0;
        layer.style.transform = "translate3d(0," + (y * depth).toFixed(1) + "px,0)";
      });
      if (title) title.style.opacity = Math.max(0, 1 - y / (height * 0.7)).toFixed(3);
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(render);
        }
      },
      { passive: true }
    );
    render();
  }

  /* ---- Scroll reveals ---- */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length && "IntersectionObserver" in window && !reduceMotion.matches) {
    root.classList.add("reveal-ready");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    revealables.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- Gallery lightbox (links open the full image if this never runs) ---- */
  var galleryLinks = document.querySelectorAll("[data-lightbox]");
  if (galleryLinks.length && typeof HTMLDialogElement === "function") {
    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Enlarged image");
    dialog.innerHTML =
      '<button class="lightbox-close" type="button">Close <span aria-hidden="true">✕</span></button>' +
      '<img class="lightbox-img" alt="" />' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(dialog);
    var bigImg = dialog.querySelector(".lightbox-img");
    var caption = dialog.querySelector(".lightbox-caption");

    dialog.querySelector(".lightbox-close").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      bigImg.removeAttribute("src");
    });

    galleryLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        var thumb = link.querySelector("img");
        var figure = link.closest("figure");
        var figcaption = figure && figure.querySelector("figcaption");
        bigImg.src = link.href;
        bigImg.alt = thumb ? thumb.alt : "";
        caption.textContent = figcaption ? figcaption.textContent : "";
        caption.hidden = !figcaption;
        dialog.showModal();
      });
    });
  }

  /* ---- Copy email address ---- */
  document.querySelectorAll("[data-copy]").forEach(function (button) {
    if (!navigator.clipboard) return;
    var text = button.querySelector("[data-copy-label]");
    if (text) text.setAttribute("aria-live", "polite");
    button.hidden = false;
    button.addEventListener("click", function () {
      navigator.clipboard.writeText(button.getAttribute("data-copy")).then(
        function () {
          if (!text) return;
          text.textContent = "Copied";
          setTimeout(function () {
            text.textContent = "Copy";
          }, 2000);
        },
        function () {
          if (text) text.textContent = "Copy failed";
        }
      );
    });
  });
})();
