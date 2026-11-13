/* Çisel Su Kıratlı — portfolyo
   Bölümler: yardımcılar · içerik üretimi · sürükleme · büyütme · melek · gözler · menü · Mii */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- yumuşak kaydırma (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    document.documentElement.classList.add("lenis");
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    // menü ve klasör bağlantıları da yumuşak kayar
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href^="#"]');
      const target = a && $(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.5 });
    });
  }

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
  const pal = [["#ffe27a", "#f0a02c"], ["#ff9fc8", "#d9468a"], ["#9be3c0", "#2e8f63"], ["#8fb4ff", "#2f56b8"],
                 ["#dcaef2", "#7d4fb4"], ["#ffbf80", "#e0702a"], ["#b9ec7a", "#6d9a1a"], ["#8fe0f0", "#2a93a8"]];
  const lines = $("#lines");
  if (lines) {
    let idx = 0;
    ["Meraklı", "geliştirici,", "ağ kurucu,", "arayüz sever"].forEach((text, ri) => {
      const row = document.createElement("div");
      row.className = "lrow";
      [...text.toLocaleUpperCase("tr")].forEach((ch, i) => {
        const e = document.createElement("span");
        if (ch === " ") { e.className = "sp"; row.append(e); return; }
        const [c, o] = pal[(ri * 3 + i * 5) % pal.length];
        e.className = "lt"; e.textContent = ch; e.dataset.drag = "";
        e.style.cssText = `--i:${idx++};--c:${c};--o:${o};--r:${rand(-9, 9).toFixed(1)}deg;--y:${rand(-.05, .05).toFixed(3)}em`;
        // dokununca kendi etrafında döner
        e.addEventListener("click", () => {
          if (e.dataset.moved || reduce) return;
          e.animate([{ transform: "rotate(0) scale(1)" }, { transform: "rotate(360deg) scale(1.35)" }, { transform: "rotate(720deg) scale(1)" }],
                    { duration: 750, easing: "cubic-bezier(.3,1.5,.5,1)" });
        });
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
    // 'toparla' düğmesi: harf yerine yaylanarak döner
    el.addEventListener("reset", () => {
      ox = oy = 0; delete el.dataset.moved;
      el.style.transition = "translate .7s cubic-bezier(.3,1.5,.5,1)";
      el.style.translate = "0px 0px";
      setTimeout(() => { el.style.transition = ""; }, 750);
    });
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    // sürüklemeden sonra bağlantı açılmasın
    el.addEventListener("click", e => { if (el.dataset.moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }
  $$("[data-drag]").forEach(makeDraggable);
  document.addEventListener("dragstart", e => e.preventDefault());

  /* ---------- pencere başlığına tıkla: harfler renk değiştirir ---------- */
  const ttl = $(".win .tb span");
  if (ttl) {
    ttl.style.cursor = "pointer";
    ttl.addEventListener("click", () => $$(".lt").forEach((l, i) => {
      const [c, o] = pal[Math.floor(Math.random() * pal.length)];
      setTimeout(() => {
        l.style.setProperty("--c", c); l.style.setProperty("--o", o);
        if (!reduce) l.animate([{ transform: "scale(1)" }, { transform: "scale(1.5) rotate(15deg)" }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(.3,1.6,.5,1)" });
      }, i * 22);
    }));
  }

  /* ---------- toparla: harfleri yerlerine döndür ---------- */
  const tidy = $(".tidy");
  const tidyUp = () => $$(".lt").forEach((l, i) => setTimeout(() => l.dispatchEvent(new Event("reset")), i * 18));
  if (tidy) tidy.addEventListener("click", () => {
    tidyUp();
    if (!reduce) tidy.animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 600, easing: "cubic-bezier(.3,1.5,.5,1)" });
  });
  if (lines) lines.addEventListener("dblclick", tidyUp);

  /* ---------- büyütme penceresi ve rozet bağlantısı ---------- */
  $$(".shot").forEach(s => s.addEventListener("click", () => {
    if (s.dataset.moved) return;
    if (s.dataset.href) { open(s.dataset.href, "_blank", "noopener"); return; }
    const im = $("img", s);
    big.src = im.currentSrc || im.src; big.alt = im.alt;
    if (lenis) lenis.stop();
    dlg.showModal();
  }));
  dlg.addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", () => { if (lenis) lenis.start(); });

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

  /* ---------- beceri hapları: dokununca renk değiştirir ve zıplar ---------- */
  const cols = ["#ff9fc8", "#ffe27a", "#bdea7c", "#86e0d4", "#dcaef2", "#ffbf80", "#8fb4ff"];
  $$("#pills li").forEach(li => {
    li.addEventListener("click", () => {
      if (li.dataset.moved) return;
      li.style.background = cols[Math.floor(Math.random() * cols.length)]; li.style.color = "#000";
      if (!reduce) li.animate([{ transform: "scale(1)" }, { transform: "scale(1.25) rotate(-6deg)" }, { transform: "scale(1)" }], { duration: 380, easing: "cubic-bezier(.3,1.6,.5,1)" });
    });
    li.addEventListener("pointerenter", () => {
      if (!reduce) li.animate([{ rotate: "0deg" }, { rotate: "-5deg" }, { rotate: "4deg" }, { rotate: "0deg" }], { duration: 420 });
    });
  });

  /* ---------- sayfa kaydırdıkça beliren bölümler ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    $$("h2,.info,.pile,.receipt,.badges,.contact,.pills,.more").forEach(el => { el.classList.add("rv"); io.observe(el); });
  }

  /* ---------- ekran görüntüleri imleci izleyip eğilir ---------- */
  if (matchMedia("(hover:hover)").matches && !reduce) {
    $$(".shot").forEach(s => {
      const im = $("img", s);
      s.addEventListener("pointermove", e => {
        if (e.buttons) return;
        const r = s.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 2 - 1, y = (e.clientY - r.top) / r.height * 2 - 1;
        im.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(1)}deg) rotateY(${(x * 9).toFixed(1)}deg) scale(1.02)`;
      });
      s.addEventListener("pointerleave", () => { im.style.transform = ""; });
    });
  }

  /* ---------- imleç izi ve boş yere tıklayınca kalp yağmuru ---------- */
  if (matchMedia("(hover:hover)").matches && !reduce) {
    let lx = -99, ly = -99;
    addEventListener("pointermove", e => {
      if (e.buttons || Math.hypot(e.clientX - lx, e.clientY - ly) < 28) return;
      lx = e.clientX; ly = e.clientY;
      const t = document.createElement("span");
      t.className = "tr"; t.textContent = ["✦", "♥", "✿", "✧"][Math.floor(Math.random() * 4)];
      t.style.cssText = `left:${lx + rand(-6, 6)}px;top:${ly + rand(8, 16)}px;--x:${rand(-18, 18)}px;color:${["#ff6fae", "#ffb347", "#6fd6e8", "#b58cf0"][Math.floor(Math.random() * 4)]}`;
      document.body.append(t); setTimeout(() => t.remove(), 950);
    }, { passive: true });
  }
  addEventListener("click", e => { if (!e.target.closest("a,button,[data-drag],dialog,.mb,.paper,li")) burst(e.clientX, e.clientY, 5, 150); });

  /* ---------- kaydırma: ilerleme çubuğu, arka plan kayması, başa dön ---------- */
  const prog = $("#prog"), up = $("#up");
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight, y = scrollY;
    document.documentElement.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    if (!reduce) document.body.style.setProperty("--par", `${-(y * .1 % 72).toFixed(1)}px`);
    if (up) up.classList.toggle("show", y > 700);
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (up) up.addEventListener("click", () => lenis ? lenis.scrollTo(0, { duration: 1.5 }) : scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

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
