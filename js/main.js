/* Çisel Su Kıratlı — portfolyo
   Bölümler: yardımcılar · içerik üretimi · sürükleme · büyütme · melek · gözler · menü · Mii */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- yükleme ekranı ---------- */
  const loader = $("#loader");
  if (loader) {
    const t0 = performance.now();
    const hide = () => setTimeout(() => { loader.classList.add("done"); setTimeout(() => loader.remove(), 700); },
                                  Math.max(0, 1100 - (performance.now() - t0)));
    document.readyState === "complete" ? hide() : addEventListener("load", hide, { once: true });
  }

  /* ---------- kalp yağmuru ---------- */
  function burst(x, y, n = 8, spread = 220) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const h = document.createElement("img");
      h.src = "img/heart-only.webp"; h.alt = ""; h.className = "fly";
      h.style.cssText = `left:${x - 13}px;top:${y - 13}px;--x:${rand(-spread / 2, spread / 2)}px;--y:${-rand(55, 175)}px;--rot:${rand(-40, 40)}deg`;
      document.body.append(h);
      setTimeout(() => h.remove(), 1300);
    }
  }

  /* ---------- içerik üretimi ---------- */
  // başlık: her harf ayrı bir çıkartma
  const lines = $("#lines");
  if (lines) {
    const pal = [["#ffe27a", "#f0a02c"], ["#ff9fc8", "#d9468a"], ["#9be3c0", "#2e8f63"], ["#8fb4ff", "#2f56b8"],
                 ["#dcaef2", "#7d4fb4"], ["#ffbf80", "#e0702a"], ["#b9ec7a", "#6d9a1a"], ["#8fe0f0", "#2a93a8"]];
    ["Meraklı", "geliştirici,", "ağ kurucu,", "arayüz sever"].forEach((text, ri) => {
      const row = document.createElement("div");
      row.className = "lrow";
      [...text.toLocaleUpperCase("tr")].forEach((ch, i) => {
        const e = document.createElement("span");
        if (ch === " ") { e.className = "sp"; row.append(e); return; }
        const [c, o] = pal[(ri * 3 + i * 5) % pal.length];
        e.className = "lt"; e.textContent = ch; e.dataset.drag = "";
        e.style.cssText = `--c:${c};--o:${o};--r:${rand(-9, 9).toFixed(1)}deg;--y:${rand(-.05, .05).toFixed(3)}em`;
        row.append(e);
      });
      lines.append(row);
    });
  }

  // beceriler
  const pills = $("#pills");
  if (pills) {
    pills.innerHTML = ["C#", "ASP.NET MVC", "Entity Framework", "PHP", "JavaScript", "Python", "Java", "C++", "SQL / PL-SQL", "Oracle",
      "MS SQL Server", "MySQL", "jQuery", "Bootstrap", "React Native", "Git", "UML", "TCP/IP", "MikroTik", "Cisco Packet Tracer", "CAT6 & Fiber"]
      .map(s => `<li data-drag>${s}</li>`).join("");
  }

  // melek kalp: aynı parçadan her yerde
  $$("[data-angel]").forEach(a => {
    a.classList.add("angel");
    a.setAttribute("role", "img");
    a.setAttribute("aria-label", "angelRadio: kanatlı piksel kalp");
    a.innerHTML = ["wing-left:wl", "wing-right:wr", "halo-ring:halo", "heart-only:heart"]
      .map(p => { const [f, c] = p.split(":"); return `<img class="${c}" src="img/${f}.webp" alt="" draggable="false">`; }).join("");
  });

  /* ---------- sürükleme ---------- */
  // kısa basış tıklama, uzun hareket sürükleme sayılır
  const dlg = $("#dlg"), big = $("img", dlg);
  function makeDraggable(el) {
    let ox = 0, oy = 0, sx, sy, px, py, on = false;
    el.addEventListener("pointerdown", e => {
      if (e.button) return;
      delete el.dataset.moved;
      on = true; px = e.clientX; py = e.clientY; sx = px - ox; sy = py - oy;
      el.setPointerCapture(e.pointerId); el.classList.add("grab");
    });
    el.addEventListener("pointermove", e => {
      if (!on) return;
      if (Math.hypot(e.clientX - px, e.clientY - py) > 5) el.dataset.moved = "1";
      ox = e.clientX - sx; oy = e.clientY - sy;
      el.style.translate = `${ox}px ${oy}px`;
    });
    const end = () => { on = false; el.classList.remove("grab"); };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    // sürüklemeden sonra bağlantı açılmasın
    el.addEventListener("click", e => { if (el.dataset.moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }
  $$("[data-drag]").forEach(makeDraggable);
  document.addEventListener("dragstart", e => e.preventDefault());

  /* ---------- büyütme penceresi ve rozet bağlantısı ---------- */
  $$(".shot").forEach(s => s.addEventListener("click", () => {
    if (s.dataset.moved) return;
    if (s.dataset.href) { open(s.dataset.href, "_blank", "noopener"); return; }
    const im = $("img", s);
    big.src = im.currentSrc || im.src; big.alt = im.alt;
    dlg.showModal();
  }));
  dlg.addEventListener("click", () => dlg.close());

  /* ---------- melek: tıklayınca kalpler ---------- */
  $$(".angel").forEach(a => a.addEventListener("click", e => {
    if (a.dataset.moved) return;
    a.classList.remove("pop"); void a.offsetWidth; a.classList.add("pop");
    burst(e.clientX, e.clientY, 9, 240);
  }));

  /* ---------- imleci izleyen gözler ---------- */
  const pupils = $$(".eye u");
  if (pupils.length && matchMedia("(hover:hover)").matches) {
    addEventListener("pointermove", e => pupils.forEach(u => {
      const r = u.parentNode.getBoundingClientRect(), a = Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
      const d = r.width * .2;
      u.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px)`;
    }), { passive: true });
  }

  /* ---------- menü: landing'de gizli, aşağı inince kayarak gelir ---------- */
  const nav = $("nav"), desk = $(".desk");
  if (nav && desk) {
    new IntersectionObserver(([e]) => nav.classList.toggle("show", !e.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" }).observe(desk);
  }

  /* ---------- Mii: sohbet balonu yazı yazar, tıklayınca zıplar ---------- */
  const mii = $("#mii");
  if (mii) {
    const t = $(".mt", mii), bub = $(".mb", mii);
    const msgs = ["merhaba! ben Su ✿", "web, veritabanı ve ağ işleri yapıyorum", "buradaki her şeyi tutup sürükleyebilirsin!",
                  "resimlere tıkla, büyüsünler ♥", "projelere göz at ↓", "benimle çalışmak ister misin?"];
    if (reduce) { t.textContent = msgs[0]; }
    else {
      let i = 0, timer;
      const say = (text, after) => {
        clearTimeout(timer); t.textContent = ""; mii.classList.add("talking");
        bub.style.animation = "none"; void bub.offsetWidth; bub.style.animation = "";
        let k = 0;
        (function step() {
          if (k < text.length) { t.textContent += text[k++]; timer = setTimeout(step, 42); }
          else { mii.classList.remove("talking"); timer = setTimeout(after, 2600); }
        })();
      };
      const loop = () => say(msgs[i++ % msgs.length], loop);
      // sekme görünmezken yazı yazmasın
      document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else loop(); });
      loop();
      mii.addEventListener("click", e => {
        if (mii.dataset.moved) return;
        mii.classList.remove("jump"); void mii.offsetWidth; mii.classList.add("jump");
        say(["hihi! ♥", "gıdıklanıyorum!", "selam selam ✿"][Math.floor(Math.random() * 3)], loop);
        burst(e.clientX, e.clientY, 7, 200);
      });
    }
  }
})();
