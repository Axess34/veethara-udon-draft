(function () {
  var root = document.documentElement;
  var KEY = "veethara-lang";
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var qp = (location.search.match(/[?&]lang=(th|en)/) || [])[1];
  var lang = qp || (stored === "th" || stored === "en" ? stored : "en");

  function setLang(next) {
    lang = next;
    root.setAttribute("lang", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang-btn") === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () { setLang(btn.getAttribute("data-lang-btn")); });
  });
  setLang(lang);

  // Mobile menu
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-mobile-nav]");
  function closeMenu() {
    if (!nav) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", lang === "th" ? "เปิดเมนู" : "Open menu");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? (lang === "th" ? "ปิดเมนู" : "Close menu") : (lang === "th" ? "เปิดเมนู" : "Open menu"));
    });
    nav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  }

  // Room enquire buttons preselect room
  var roomSelect = document.getElementById("f-room");
  document.querySelectorAll("[data-room]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (roomSelect) roomSelect.value = btn.getAttribute("data-room");
    });
  });

  // Date defaults
  var fin = document.getElementById("f-in"), fout = document.getElementById("f-out");
  if (fin && fout) {
    var today = new Date(); var iso = function (d) { return d.toISOString().slice(0, 10); };
    fin.min = iso(today); fout.min = iso(today);
    fin.addEventListener("change", function () {
      if (!fin.value) return;
      var d = new Date(fin.value); d.setDate(d.getDate() + 1);
      fout.min = iso(d);
      if (!fout.value || fout.value <= fin.value) fout.value = iso(d);
    });
  }

  // Enquiry form -> mailto
  var form = document.getElementById("enquiry-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      if (!f.name.value.trim()) { f.name.focus(); return; }
      var lines = [
        "Name / ชื่อ: " + f.name.value.trim(),
        "Phone / โทร: " + (f.phone.value.trim() || "-"),
        "Check-in / เช็คอิน: " + (f.checkin.value || "-"),
        "Check-out / เช็คเอาท์: " + (f.checkout.value || "-"),
        "Room / ห้อง: " + f.room.value,
        "Guests / ผู้เข้าพัก: " + (f.guests.value || "-"),
        "",
        f.message.value.trim()
      ];
      var subject = "Booking enquiry / สอบถามห้องพัก — " + f.name.value.trim();
      window.location.href = "mailto:veethara.udonthani@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    });
  }

  // Lightbox
  var lb = document.querySelector("[data-lightbox-root]");
  var lbImg = lb && lb.querySelector("[data-lb-img]");
  var lbCap = lb && lb.querySelector("[data-lb-caption]");
  var items = [], idx = 0;
  document.querySelectorAll("[data-gallery] img, img[data-lightbox]").forEach(function (img) { items.push(img); });
  function show(i) {
    idx = (i + items.length) % items.length;
    var img = items[idx];
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
  }
  function open(i) { show(i); lb.classList.add("is-open"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }
  if (lb) {
    items.forEach(function (img, i) {
      var target = img.closest("button") || img;
      target.addEventListener("click", function () { open(i); });
    });
    lb.querySelector("[data-lb-close]").addEventListener("click", close);
    lb.querySelector("[data-lb-prev]").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector("[data-lb-next]").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  // Reveal on scroll
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("is-visible"); }); }

  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
