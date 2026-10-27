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

  /* ---- Home headshot: coral pixels "generate" the portrait, then trail the cursor ----
     A canvas sits over the photo. Without JS, or with reduced motion, the photo shows as normal. */
  var pixelFigure = document.querySelector("[data-pixel-portrait]");
  var pixelImg = pixelFigure && pixelFigure.querySelector("img");
  var pixelCtx = pixelImg && document.createElement("canvas").getContext("2d");
  if (pixelCtx && !reduceMotion.matches && "IntersectionObserver" in window) {
    (function (ctx) {
      var canvas = ctx.canvas;
      canvas.className = "portrait-pixels";
      canvas.setAttribute("aria-hidden", "true");
      pixelFigure.appendChild(canvas);

      var cssColour = function (name, fallback) {
        var m = /^#([0-9a-f]{6})$/i.exec(getComputedStyle(root).getPropertyValue(name).trim());
        if (!m) return fallback;
        var n = parseInt(m[1], 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      };
      var rgb = function (c) {
        return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")";
      };
      var mix = function (a, b, t) {
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      };
      var coral = cssColour("--coral", [239, 106, 99]);
      var CORAL = rgb(coral);
      var COVER = rgb(cssColour("--paper-2", [232, 225, 211]));
      var DEEP = [46, 14, 13];
      var LIGHT = [255, 228, 224];

      var CELL = 12; // block size in CSS pixels
      var SWEEP = 900; // ms for the scan line to cross the photo
      var JITTER = 450; // random lag per block behind the scan line
      var FLASH = 160; // ms a block glows solid coral
      var RESOLVE = 420; // ms for the pink pixels to fade into the photo
      var TOTAL = SWEEP + JITTER + FLASH + RESOLVE;
      var RADIUS = 3.2; // cursor reach, in blocks

      var w = 0, h = 0, cols = 0, rows = 0;
      var tones = null; // pink duotone colour per block, sampled from the photo
      var heat = null; // cursor energy per block, 0..1
      var delays = null; // when each block is generated, ms after the start
      var start = 0, done = false, raf = 0, last = 0, hud = 0;
      var pointer = null;

      // Stable pseudo-random number in [0, 1) for block i
      var hash = function (i, salt) {
        var x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };

      var sample = function () {
        tones = null;
        if (!cols || !pixelImg.complete || !pixelImg.naturalWidth) return;
        try {
          var small = document.createElement("canvas");
          small.width = cols;
          small.height = rows;
          var sctx = small.getContext("2d");
          sctx.drawImage(pixelImg, 0, 0, cols, rows);
          var data = sctx.getImageData(0, 0, cols, rows).data;
          tones = [];
          for (var i = 0; i < cols * rows; i++) {
            var lum = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
            lum = Math.min(1, Math.max(0, (lum - 0.12) / 0.76));
            tones.push(rgb(lum < 0.5 ? mix(DEEP, coral, lum * 2) : mix(coral, LIGHT, (lum - 0.5) * 2)));
          }
        } catch (e) {
          tones = null; // e.g. a tainted canvas when opened from disk: fall back to flat coral
        }
      };

      var layout = function () {
        w = pixelImg.offsetWidth;
        h = pixelImg.offsetHeight;
        if (!w || !h) return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        canvas.style.left = pixelImg.offsetLeft + "px";
        canvas.style.top = pixelImg.offsetTop + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var c = Math.ceil(w / CELL), r = Math.ceil(h / CELL);
        if (c !== cols || r !== rows) {
          cols = c;
          rows = r;
          heat = new Float32Array(cols * rows);
          delays = new Float32Array(cols * rows);
          for (var i = 0; i < cols * rows; i++) {
            delays[i] = (Math.floor(i / cols) / rows) * SWEEP + hash(i, 1) * JITTER;
          }
          sample();
        }
      };

      var corners = function (alpha) {
        var inset = 8, len = 14;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = CORAL;
        ctx.lineWidth = 2;
        ctx.beginPath();
        [[inset, inset, 1, 1], [w - inset, inset, -1, 1], [inset, h - inset, 1, -1], [w - inset, h - inset, -1, -1]].forEach(function (k) {
          ctx.moveTo(k[0], k[1] + len * k[3]);
          ctx.lineTo(k[0], k[1]);
          ctx.lineTo(k[0] + len * k[2], k[1]);
        });
        ctx.stroke();
      };

      var readout = function (text, alpha) {
        ctx.globalAlpha = alpha;
        ctx.font = "500 10px 'Geist Mono', 'Courier New', monospace";
        var tw = ctx.measureText(text).width;
        ctx.fillStyle = "rgba(20, 26, 22, 0.78)";
        ctx.fillRect(12, h - 32, tw + 14, 20);
        ctx.fillStyle = CORAL;
        ctx.textBaseline = "middle";
        ctx.fillText(text, 19, h - 22);
      };

      var pad = function (n) {
        return ("00" + Math.max(0, Math.round(n))).slice(-3);
      };

      var frame = function (now) {
        raf = 0;
        if (!w) return;
        var dt = last ? Math.min(now - last, 64) : 16;
        last = now;
        var t = start ? now - start : -1;
        if (t > TOTAL) done = true;
        var decay = Math.exp(-dt / 380);
        var flicker = Math.floor(now / 90);
        var busy = start > 0 && !done;

        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < cols * rows; i++) {
          var x = (i % cols) * CELL, y = Math.floor(i / cols) * CELL;
          var tone = tones ? tones[i] : CORAL;
          var hv = (heat[i] *= decay);
          if (hv < 0.01) hv = heat[i] = 0;
          else busy = true;
          var u = done ? Infinity : t < 0 ? -1 : t - delays[i];

          if (u < 0) {
            // Not generated yet: covered, with the odd coral blip
            ctx.fillStyle = COVER;
            ctx.fillRect(x, y, CELL, CELL);
            if (hash(i, flicker) > 0.985) {
              ctx.globalAlpha = 0.5;
              ctx.fillStyle = CORAL;
              ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
              ctx.globalAlpha = 1;
            }
          } else if (u < FLASH) {
            ctx.fillStyle = CORAL;
            ctx.fillRect(x, y, CELL, CELL);
          } else if (u < FLASH + RESOLVE) {
            var fade = 1 - (u - FLASH) / RESOLVE;
            ctx.globalAlpha = fade;
            ctx.fillStyle = tone;
            ctx.fillRect(x, y, CELL - 1, CELL - 1);
            ctx.globalAlpha = 1;
          } else if (hv > 0) {
            // Cursor trail: the photo turns back into pink pixels, with coral sparks
            ctx.globalAlpha = Math.min(1, hv * 1.15);
            ctx.fillStyle = hash(i, flicker) < hv * 0.3 ? CORAL : tone;
            ctx.fillRect(x, y, CELL - 1, CELL - 1);
            ctx.globalAlpha = 1;
          }
        }

        // Scan line leading the reveal
        if (t >= 0 && t < SWEEP) {
          var sy = (t / SWEEP) * h;
          var band = ctx.createLinearGradient(0, sy - 40, 0, sy);
          band.addColorStop(0, "rgba(" + coral.join(",") + ",0)");
          band.addColorStop(1, "rgba(" + coral.join(",") + ",0.35)");
          ctx.fillStyle = band;
          ctx.fillRect(0, sy - 40, w, 40);
          ctx.fillStyle = CORAL;
          ctx.fillRect(0, sy - 1, w, 2);
        }

        // HUD: corner brackets and a readout while generating or hovering
        var target = pointer || (start && !done) ? 1 : 0;
        hud += (target - hud) * Math.min(1, dt / 140);
        if (Math.abs(target - hud) > 0.01) busy = true;
        if (hud > 0.01) {
          corners(hud);
          if (start && !done) {
            readout("GENERATING " + pad(Math.min(100, (t / TOTAL) * 100)) + "%", hud);
          } else if (pointer) {
            ctx.globalAlpha = hud;
            ctx.strokeStyle = CORAL;
            ctx.lineWidth = 1;
            ctx.strokeRect(Math.floor(pointer.x / CELL) * CELL + 0.5, Math.floor(pointer.y / CELL) * CELL + 0.5, CELL - 1, CELL - 1);
            readout("X " + pad(pointer.x) + "  Y " + pad(pointer.y), hud);
          }
          ctx.globalAlpha = 1;
        }

        if (busy) wake();
        else last = 0;
      };

      var wake = function () {
        if (!raf) raf = requestAnimationFrame(frame);
      };

      layout();
      frame(performance.now()); // paint the covered state straight away

      var ready = pixelImg.decode ? pixelImg.decode().catch(function () {}) : Promise.resolve();
      ready.then(function () {
        sample();
        var seen = new IntersectionObserver(
          function (entries) {
            if (!entries[0].isIntersecting) return;
            seen.disconnect();
            setTimeout(function () {
              start = performance.now();
              wake();
            }, 250);
          },
          { threshold: 0.35 }
        );
        seen.observe(pixelFigure);
      });

      pixelFigure.addEventListener("pointermove", function (e) {
        var box = pixelImg.getBoundingClientRect();
        var x = e.clientX - box.left, y = e.clientY - box.top;
        if (x < 0 || y < 0 || x > box.width || y > box.height) {
          pointer = null;
        } else {
          pointer = { x: x, y: y };
          var cx = x / CELL, cy = y / CELL, reach = Math.ceil(RADIUS);
          for (var r = Math.floor(cy) - reach; r <= Math.floor(cy) + reach; r++) {
            for (var c = Math.floor(cx) - reach; c <= Math.floor(cx) + reach; c++) {
              if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
              var d = Math.hypot(c + 0.5 - cx, r + 0.5 - cy) / RADIUS;
              if (d < 1) heat[r * cols + c] = Math.max(heat[r * cols + c], 1 - d);
            }
          }
        }
        wake();
      });
      pixelFigure.addEventListener("pointerleave", function () {
        pointer = null;
        wake();
      });

      var relayout = function () {
        layout();
        wake();
      };
      if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(pixelImg);
      else window.addEventListener("resize", relayout);
    })(pixelCtx);
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
