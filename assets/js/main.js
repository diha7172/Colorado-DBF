/* Colorado DBF site scripts. No dependencies. */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- nav: scrolled state, hide on scroll down, show on scroll up ---------- */
  const nav = $(".nav");
  let lastY = window.scrollY;
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 24);
      if (y > 400 && y > lastY + 6 && !document.body.classList.contains("drawer-open")) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 200) nav.classList.remove("is-hidden");
    }
    const prog = $(".progress");
    if (prog) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.setProperty("--p", h > 0 ? Math.min(1, y / h) : 0);
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  const toggle = $(".nav__toggle");
  const drawer = $(".drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      document.body.classList.toggle("drawer-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", drawer).forEach(a => a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      drawer.classList.remove("is-open");
      document.body.classList.remove("drawer-open");
      document.body.style.overflow = "";
    }));
  }

  /* ---------- mark current page in nav ---------- */
  const here = location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  $$(".nav__links a, .drawer a").forEach(a => {
    const href = a.getAttribute("href") || "";
    const target = href.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    const isHome = (target === "index" || target === "./" || target === "/" || target === ".") && (here === "/" || here.endsWith("/") || here.endsWith("/index"));
    if (isHome || (target !== "index" && here.endsWith("/" + target))) a.setAttribute("aria-current", "page");
  });

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  $$("[data-reveal], .stagger, .timeline__item").forEach(el => io.observe(el));
  // clipped frames: a fully clipped element never reports as visible, so watch its parent block instead
  const fio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll(".media--reveal").forEach(m => m.classList.add("is-in")); fio.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  $$(".media--reveal").forEach(el => fio.observe(el.parentElement));

  /* ---------- count-up numbers ---------- */
  $$("[data-countdown]").forEach(el => {
    const start = new Date(el.dataset.countdown);
    const end = new Date(el.dataset.countdownEnd || el.dataset.countdown);
    const now = new Date();
    const days = Math.ceil((start - now) / 864e5);
    const label = el.closest("div") && el.closest("div").querySelector("small");
    if (days > 0) { el.dataset.count = String(days); el.textContent = "0"; }
    else if (now <= end) { el.parentElement.textContent = "Now"; if (label) label.textContent = "Fly-off in progress"; }
    else { el.parentElement.textContent = "Done"; if (label) label.textContent = "See you next season"; }
  });
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1400;
    const t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    if (reduceMotion) { el.textContent = end.toFixed(dec); return; }
    requestAnimationFrame(step);
  }
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(el => cio.observe(el));

  /* ---------- card spotlight follows the cursor ---------- */
  $$(".card").forEach(card => {
    card.addEventListener("pointermove", (ev) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (ev.clientX - r.left) + "px");
      card.style.setProperty("--my", (ev.clientY - r.top) + "px");
    });
  });

  /* ---------- timeline progress line ---------- */
  const tl = $(".timeline");
  if (tl) {
    const upd = () => {
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / r.height));
      tl.style.setProperty("--progress", p);
    };
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  }

  /* ---------- word-by-word scrub text ---------- */
  $$(".scrub").forEach(block => {
    const parts = block.innerHTML.trim().split(/\*\*(.+?)\*\*/);
    block.innerHTML = parts.map((part, i) => part.split(/(\s+)/).map(chunk => {
      if (!chunk || /^\s+$/.test(chunk)) return chunk;
      return `<span class="w${i % 2 ? " gold" : ""}">${chunk}</span>`;
    }).join("")).join("");
    const words = $$(".w", block);
    const upd = () => {
      const r = block.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.3)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("is-on", i < n));
    };
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  });

  /* ---------- accordion ---------- */
  $$(".acc__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".acc__item");
      const open = !item.classList.contains("is-open");
      const group = btn.closest(".acc");
      if (group && group.dataset.single !== undefined) {
        $$(".acc__item", group).forEach(i => { i.classList.remove("is-open"); $(".acc__btn", i).setAttribute("aria-expanded", "false"); });
      }
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- drag to scroll on horizontal strips ---------- */
  $$(".strip").forEach(strip => {
    let down = false, startX = 0, startL = 0;
    strip.addEventListener("pointerdown", e => { down = true; startX = e.clientX; startL = strip.scrollLeft; strip.setPointerCapture(e.pointerId); });
    strip.addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) strip.classList.add("is-dragging");
      strip.scrollLeft = startL - dx;
    });
    const up = () => { down = false; setTimeout(() => strip.classList.remove("is-dragging"), 50); };
    strip.addEventListener("pointerup", up);
    strip.addEventListener("pointercancel", up);
    strip.addEventListener("click", e => { if (strip.classList.contains("is-dragging")) e.preventDefault(); }, true);
  });

  /* ---------- copy email on click (contact page) ---------- */
  $$("[data-copy]").forEach(el => {
    el.addEventListener("click", (e) => {
      if (!navigator.clipboard) return;
      e.preventDefault();
      navigator.clipboard.writeText(el.dataset.copy).then(() => toast("Copied " + el.dataset.copy));
    });
  });
  function toast(msg) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("is-on"), 1800);
  }

  /* ---------- hero parallax ---------- */
  const heroImg = $(".hero__media img");
  if (heroImg && !reduceMotion) {
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.translate = `0 ${y * 0.18}px`;
    }, { passive: true });
  }

  /* ---------- dashed flight path draws on scroll ---------- */
  $$(".plane-path path").forEach(path => {
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    const upd = () => {
      const r = path.closest("section, .section, .hero, div").getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.5)));
      path.style.strokeDashoffset = `${len * (1 - p)}`;
    };
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  });

  /* ---------- page transition fallback (browsers without cross-document view transitions) ---------- */
  const hasVT = "startViewTransition" in document && CSS.supports("view-transition-name: x") && /Chrome|Edg/.test(navigator.userAgent);
  if (!hasVT && !reduceMotion) {
    document.documentElement.classList.add("no-vt");
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      e.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(() => { location.href = url.href; }, 280);
    });
    window.addEventListener("pageshow", (e) => { if (e.persisted) document.body.classList.remove("page-leave"); });
  }

  /* ---------- hero airflow: streamlines bending around an airfoil ---------- */
  const flow = $(".hero__flow");
  if (flow && !reduceMotion) {
    const ctx = flow.getContext("2d");
    let W, H, parts = [], raf;
    const N = 140;
    const resize = () => {
      const r = flow.parentElement.getBoundingClientRect();
      W = flow.width = Math.floor(r.width);
      H = flow.height = Math.floor(r.height);
    };
    const field = (x, y) => {
      // uniform flow left to right, deflected by a "wing" sitting at 62% across, 45% down
      const cx = W * 0.62, cy = H * 0.45, rad = Math.min(W, H) * 0.22;
      const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy, d = Math.sqrt(d2) || 1;
      let vx = 1, vy = 0;
      if (d < rad * 3) {
        const k = (rad * rad) / d2;             // doublet: flow around a cylinder
        vx += -k * (dx * dx - dy * dy) / d2;
        vy += -k * (2 * dx * dy) / d2;
        const g = (rad * 0.9) / d;               // a little circulation so streamlines curve like a lifting wing
        vx += -g * dy / d * 0.35;
        vy += g * dx / d * 0.35;
      }
      const t = performance.now() / 4000;
      vy += Math.sin(y * 0.01 + t) * 0.12;       // gentle gust
      return [vx, vy];
    };
    const spawn = (p, fresh) => {
      p.x = fresh ? Math.random() * W : -10;
      p.y = Math.random() * H;
      p.life = 0;
      p.max = 160 + Math.random() * 220;
      p.speed = 1.2 + Math.random() * 1.6;
      p.px = p.x; p.py = p.y;
    };
    const init = () => { resize(); parts = Array.from({ length: N }, () => { const p = {}; spawn(p, true); return p; }); };
    const step = () => {
      ctx.fillStyle = "rgba(10,10,12,0.08)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1;
      parts.forEach(p => {
        const [vx, vy] = field(p.x, p.y);
        p.px = p.x; p.py = p.y;
        p.x += vx * p.speed; p.y += vy * p.speed; p.life++;
        const a = Math.sin(Math.min(1, p.life / p.max) * Math.PI) * 0.55;
        ctx.strokeStyle = `rgba(232,213,156,${a})`;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.x > W + 10 || p.y < -10 || p.y > H + 10 || p.life > p.max) spawn(p, false);
      });
      raf = requestAnimationFrame(step);
    };
    init(); step();
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); init(); step(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else step(); });
  }

  /* ---------- custom cursor ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    const dot = document.createElement("div"); dot.className = "cursor";
    const ring = document.createElement("div"); ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let mx = -100, my = -100, rx = -100, ry = -100, shown = false;
    window.addEventListener("pointermove", e => {
      mx = e.clientX; my = e.clientY;
      if (!shown) { shown = true; document.body.classList.add("has-cursor"); }
      const t = e.target.closest("a, button, .tile, .acc__btn");
      const m = e.target.closest(".strip");
      document.body.classList.toggle("cursor-link", !!t && !m);
      document.body.classList.toggle("cursor-media", !!m);
    });
    document.addEventListener("mouseleave", () => document.body.classList.remove("has-cursor"));
    document.addEventListener("mouseenter", () => { if (shown) document.body.classList.add("has-cursor"); });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    $$(".btn").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.32;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
})();
