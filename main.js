// L2F Marketing — interactions
(function () {
  "use strict";

  // ---- Year ----
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Navbar scroll state ----
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("nav--scrolled");
    else nav.classList.remove("nav--scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  var toggle = document.getElementById("navToggle");
  var mobile = document.getElementById("navMobile");
  function closeMenu() {
    mobile.classList.remove("nav__mobile--open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }
  toggle.addEventListener("click", function () {
    var open = mobile.classList.toggle("nav__mobile--open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  mobile.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  // ---- Hero kinetic word ----
  var rotWord = document.getElementById("rotWord");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (rotWord && !prefersReduced) {
    var words = ["crescimento", "resultado", "autoridade", "vendas", "presença"];
    var wi = 0;
    setInterval(function () {
      rotWord.classList.add("is-out");
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        rotWord.textContent = words[wi];
        rotWord.classList.remove("is-out");
      }, 450);
    }, 2600);
  }

  // ---- Reveal on scroll ----
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---- Lightbox ----
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var lbClose = document.getElementById("lightboxClose");
  var lastFocus = null;

  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lbImg.setAttribute("src", src);
    lbImg.setAttribute("alt", alt || "");
    lb.classList.add("lightbox--open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLightbox() {
    lb.classList.remove("lightbox--open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lbImg.setAttribute("src", "");
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll(".work__item").forEach(function (item) {
    var full = item.getAttribute("data-full");
    var img = item.querySelector("img");
    var alt = img ? img.getAttribute("alt") : "";
    item.addEventListener("click", function () { openLightbox(full, alt); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(full, alt); }
    });
  });

  // ---- Projects carousel ----
  var track = document.getElementById("workTrack");
  if (track) {
    var items = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById("workDots");
    var prevBtn = document.querySelector('.carousel__btn[data-dir="prev"]');
    var nextBtn = document.querySelector('.carousel__btn[data-dir="next"]');

    // build dots
    items.forEach(function (item, i) {
      var d = document.createElement("button");
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Projeto " + (i + 1));
      d.addEventListener("click", function () { scrollToItem(i); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    var section = document.getElementById("projetos");
    var last = items.length - 1;
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    // Nearest item to the current scroll position — using real offsets
    // (rather than a proportional guess) so every index, including the
    // very first and last, is reached reliably by both buttons and dots.
    function currentIndex() {
      var pos = track.scrollLeft;
      var closest = 0;
      var closestDist = Infinity;
      items.forEach(function (item, i) {
        var dist = Math.abs(item.offsetLeft - track.offsetLeft - pos);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      return closest;
    }
    function scrollToItem(i) {
      i = Math.max(0, Math.min(last, i));
      // scrollIntoView respects scroll-padding-left, so the item lands
      // exactly on its snap point instead of drifting by the gutter size.
      items[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
    function update() {
      // When all cards fit, center them and hide the carousel controls.
      var scrollable = maxScroll() > 4;
      section.classList.toggle("is-static", !scrollable);
      var idx = currentIndex();
      dots.forEach(function (d, i) { d.setAttribute("aria-selected", String(i === idx)); });
      if (prevBtn) prevBtn.disabled = idx <= 0;
      if (nextBtn) nextBtn.disabled = idx >= last;
    }

    prevBtn && prevBtn.addEventListener("click", function () { scrollToItem(currentIndex() - 1); });
    nextBtn && nextBtn.addEventListener("click", function () { scrollToItem(currentIndex() + 1); });

    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  lbClose.addEventListener("click", closeLightbox);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("lightbox--open")) closeLightbox();
  });
})();
