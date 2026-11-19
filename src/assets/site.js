/* INDEX — 作品集 2026
   开屏、横向图片序列、灯箱；无第三方依赖 */
(function () {
  "use strict";

  /* ---------- 开屏：d13 从右向左的一次滑动 ---------- */

  function initIntro() {
    var intro = document.getElementById("intro");
    if (!intro) return;

    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var seen = false;
    try {
      seen = sessionStorage.getItem("indexIntroSeen") === "1";
    } catch (e) {
      seen = false;
    }

    if (reduce || seen) {
      intro.parentNode && intro.parentNode.removeChild(intro);
      return;
    }

    var img = intro.querySelector(".intro-img");
    var started = false;
    var finished = false;

    document.body.classList.add("is-intro");

    function finish() {
      if (finished) return;
      finished = true;
      intro.classList.add("is-done");
      document.body.classList.remove("is-intro");
      try {
        sessionStorage.setItem("indexIntroSeen", "1");
      } catch (e) {}
      window.setTimeout(function () {
        intro.parentNode && intro.parentNode.removeChild(intro);
      }, 650);
    }

    function begin() {
      if (started) return;
      started = true;
      intro.classList.add("is-playing");
      window.setTimeout(finish, 1500);
    }

    function ready() {
      if (!img) {
        begin();
        return;
      }
      if (img.complete && img.naturalWidth) {
        begin();
      } else {
        img.addEventListener("load", begin, { once: true });
        img.addEventListener("error", begin, { once: true });
      }
    }

    if (document.readyState === "complete") {
      ready();
    } else {
      window.addEventListener("load", ready, { once: true });
    }

    /* 兜底：页面资源异常时也不要挡住内容 */
    window.setTimeout(begin, 2200);
  }

  /* ---------- 横向拖动 ---------- */

  function initReel(shell) {
    var reel = shell.querySelector("[data-reel]");
    if (!reel) return;

    var track = reel.querySelector(".reel-track");
    var prev = shell.querySelector("[data-prev]");
    var next = shell.querySelector("[data-next]");
    var bar = shell.querySelector("[data-progress]");
    var current = shell.querySelector("[data-current]");
    var total = track ? track.querySelectorAll(".slide").length : 0;

    var down = false;
    var dragged = false;
    var startX = 0;
    var startLeft = 0;
    var ticking = false;

    function maxScroll() {
      return Math.max(0, reel.scrollWidth - reel.clientWidth);
    }

    function update() {
      ticking = false;
      var max = maxScroll();
      var ratio = max > 0 ? reel.scrollLeft / max : 0;
      if (bar) bar.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
      if (prev) prev.disabled = reel.scrollLeft < 4;
      if (next) next.disabled = reel.scrollLeft > max - 4;

      if (current && total) {
        var slides = track.querySelectorAll(".slide");
        var edge = reel.scrollLeft + Math.min(reel.clientWidth * 0.4, 320);
        var idx = 1;
        for (var i = 0; i < slides.length; i++) {
          if (slides[i].offsetLeft <= edge) idx = i + 1;
        }
        current.textContent = String(idx).padStart(2, "0");
      }
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    function stepSize() {
      var slides = track ? track.querySelectorAll(".slide") : [];
      if (slides.length > 1) {
        return Math.max(
          240,
          slides[1].offsetLeft - slides[0].offsetLeft
        );
      }
      return Math.max(260, reel.clientWidth * 0.72);
    }

    function scrollDir(dir) {
      reel.scrollBy({ left: dir * stepSize(), behavior: "smooth" });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        scrollDir(-1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        scrollDir(1);
      });
    }

    reel.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    function onDragMove(e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) dragged = true;
      reel.scrollLeft = startLeft - dx;
    }

    function endDrag() {
      if (!down) return;
      down = false;
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.setTimeout(function () {
        dragged = false;
      }, 80);
    }

    reel.addEventListener(
      "pointerdown",
      function (e) {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        down = true;
        dragged = false;
        startX = e.clientX;
        startLeft = reel.scrollLeft;
        window.addEventListener("pointermove", onDragMove, { passive: true });
        window.addEventListener("pointerup", endDrag);
        window.addEventListener("pointercancel", endDrag);
      },
      { passive: true }
    );

    reel.addEventListener(
      "click",
      function (e) {
        if (!dragged) return;
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      },
      true
    );

    reel.setAttribute("tabindex", "0");
    reel.addEventListener("keydown", function (e) {
      if (e.target.closest && e.target.closest(".project-end")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollDir(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollDir(1);
      }
    });

    reel.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();
  }

  /* ---------- 灯箱 ---------- */

  function initLightbox() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll("a[data-lightbox]")
    );
    if (!links.length) return;

    var groups = {};
    links.forEach(function (a) {
      var g = a.getAttribute("data-lightbox") || "default";
      (groups[g] = groups[g] || []).push(a);
    });

    var lb = document.createElement("div");
    lb.className = "lb";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "图片查看");
    lb.innerHTML =
      '<div class="lb-stage"><img class="lb-img" alt=""></div>' +
      '<button class="lb-btn lb-close" type="button" aria-label="关闭（Esc）">✕</button>' +
      '<div class="lb-bar"><div class="lb-cap"></div>' +
      '<div class="lb-ctrl">' +
      '<button class="lb-btn" type="button" data-dir="-1" aria-label="上一张">←</button>' +
      '<button class="lb-btn" type="button" data-dir="1" aria-label="下一张">→</button>' +
      "</div></div>";
    document.body.appendChild(lb);

    var img = lb.querySelector(".lb-img");
    var cap = lb.querySelector(".lb-cap");
    var list = [];
    var pos = 0;
    var opener = null;

    function label(a) {
      var text = a.getAttribute("data-caption");
      if (text) return text;
      var fig = a.closest("figure");
      if (fig) {
        var fc = fig.querySelector("figcaption");
        if (fc) return fc.textContent.replace(/\s+/g, " ").trim();
      }
      return "";
    }

    function render() {
      var a = list[pos];
      img.src = a.getAttribute("href");
      img.alt = label(a);
      var noCount = a.hasAttribute("data-no-count");
      cap.textContent =
        (label(a) || "") +
        (list.length > 1 && !noCount
          ? "   ·   " + (pos + 1) + " / " + list.length
          : "");
      var many = list.length > 1;
      lb.querySelector('[data-dir="-1"]').style.visibility = many
        ? "visible"
        : "hidden";
      lb.querySelector('[data-dir="1"]').style.visibility = many
        ? "visible"
        : "hidden";
    }

    function open(a) {
      var g = a.getAttribute("data-lightbox") || "default";
      list = groups[g] || [a];
      pos = list.indexOf(a);
      if (pos < 0) pos = 0;
      opener = a;
      lb.dataset.open = "true";
      document.body.classList.add("lb-open");
      render();
      lb.querySelector(".lb-close").focus();
    }

    function close() {
      lb.dataset.open = "false";
      document.body.classList.remove("lb-open");
      img.removeAttribute("src");
      if (opener) opener.focus();
    }

    function step(d) {
      if (list.length < 2) return;
      pos = (pos + d + list.length) % list.length;
      render();
    }

    links.forEach(function (a) {
      a.addEventListener("click", function (ev) {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
        ev.preventDefault();
        open(a);
      });
    });

    lb.addEventListener("click", function (ev) {
      if (ev.target.closest("button")) return;
      if (ev.target === lb || ev.target.classList.contains("lb-stage")) close();
    });

    lb.querySelector(".lb-close").addEventListener("click", close);
    Array.prototype.forEach.call(lb.querySelectorAll("[data-dir]"), function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        step(parseInt(b.getAttribute("data-dir"), 10));
      });
    });

    document.addEventListener("keydown", function (ev) {
      if (lb.dataset.open !== "true") return;
      if (ev.key === "Escape") close();
      else if (ev.key === "ArrowLeft") step(-1);
      else if (ev.key === "ArrowRight") step(1);
      else if (ev.key === "Tab") {
        var f = lb.querySelectorAll("button");
        var first = f[0];
        var last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) {
          ev.preventDefault();
          last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
          ev.preventDefault();
          first.focus();
        }
      }
    });

    var x0 = null;
    lb.addEventListener(
      "touchstart",
      function (e) {
        x0 = e.touches[0].clientX;
      },
      { passive: true }
    );
    lb.addEventListener(
      "touchend",
      function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
        x0 = null;
      },
      { passive: true }
    );
  }

  /* ---------- 写作页：展开 / 收起 ---------- */

  function initArticles() {
    document.querySelectorAll("[data-paper]").forEach(function (shell) {
      var paper = shell.querySelector(".paper");
      var button = shell.querySelector(".paper-toggle");
      var full = shell.querySelector(".paper-full");
      var abstract = shell.querySelector(".abstract");
      if (!paper || !button || !full) return;

      button.addEventListener("click", function () {
        var expanded = button.getAttribute("aria-expanded") === "true";
        var next = !expanded;

        button.setAttribute("aria-expanded", String(next));
        button.textContent = next ? "收起" : "展开";
        full.hidden = !next;
        if (abstract) abstract.hidden = next;
        paper.classList.toggle("is-open", next);

        if (!next) {
          var top = shell.getBoundingClientRect().top + window.scrollY - 80;
          if (window.scrollY > top) {
            window.scrollTo({ top: top, behavior: "smooth" });
          }
        }
      });
    });
  }

  /* ---------- 年份 ---------- */

  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- boot ---------- */

  initIntro();
  initYear();
  initArticles();
  document.querySelectorAll("[data-reel-shell]").forEach(initReel);
  initLightbox();
})();
