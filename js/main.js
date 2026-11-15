/* Çisel Su Kıratlı — portfolyo
   Bölümler: yardımcılar · içerik üretimi · sürükleme · büyütme · melek · gözler · menü · Mii */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- dil (TR / EN): tarayıcı dilinden başlar, seçim hatırlanır ---------- */
  const guess = () => ((navigator.language || "tr").toLowerCase().startsWith("tr") ? "tr" : "en");
  let lang = guess();
  try { lang = localStorage.getItem("lang") || lang; } catch (e) { /* gizli mod */ }
  const ROWS = { tr: ["Meraklı", "geliştirici,", "ağ kurucu,", "arayüz sever"], en: ["Curious", "developer,", "network nerd,", "UI lover"] };
  const MSGS = {
    tr: ["merhaba! ben Su ✿", "web, veritabanı ve ağ işleri yapıyorum", "aynı zamanda illüstratörüm: Photoshop, Clip Studio Paint ✿",
         "buradaki her şeyi tutup sürükleyebilirsin!", "resimlere tıkla, büyüsünler ♥", "projelere göz at ↓", "benimle çalışmak ister misin?"],
    en: ["hi! I'm Su ✿", "I do web, databases and networks", "I'm also an illustrator: Photoshop, Clip Studio Paint ✿",
         "you can grab and drag everything here!", "click the pictures, they zoom ♥", "take a look at the projects ↓", "want to work with me?"]
  };
  const HIHI = { tr: ["hihi! ♥", "gıdıklanıyorum!", "selam selam ✿"], en: ["hehe! ♥", "that tickles!", "hi hi ✿"] };

  /* ---------- yumuşak kaydırma (Lenis) ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    document.documentElement.classList.add("lenis");
    window.__lenis = lenis;
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
    const t0 = performance.now(), num = $("#ldn"), MIN = 1500;
    let loaded = document.readyState === "complete", shown = 0;
    addEventListener("load", () => { loaded = true; }, { once: true });
    (function tick() {
      const goal = loaded ? 100 : 90, byTime = Math.min(100, (performance.now() - t0) / MIN * 100);
      shown = Math.min(goal, Math.max(shown, byTime));
      if (num) num.textContent = Math.round(shown);
      loader.style.setProperty("--ld", (shown / 100).toFixed(3));
      if (shown >= 100) { setTimeout(() => { loader.classList.add("done"); setTimeout(() => loader.remove(), 700); }, 250); return; }
      setTimeout(tick, 40);
    })();
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
  // başlık: her harf ayrı bir çıkartma (dil değişince yeniden kurulur)
  const pal = [["#bfe8e0", "#a67c68"], ["#ffc1dc", "#a67c68"], ["#fff0b8", "#a67c68"], ["#e0cdf5", "#a67c68"]];
  const lines = $("#lines");
  let builtLang = null;
  // en uzun satır pencereye sığmazsa yazı biraz küçülür
  function fitLetters() {
    if (!lines) return;
    lines.style.setProperty("--fit", "1");
    const cs = getComputedStyle(lines), avail = lines.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    let max = 0;
    // offset ölçüleri giriş animasyonundaki küçültmeden etkilenmez
    $$(".lrow", lines).forEach(r => { const f = r.firstElementChild, l = r.lastElementChild; max = Math.max(max, l.offsetLeft + l.offsetWidth - f.offsetLeft); });
    lines.style.setProperty("--fit", max > avail ? (avail / max * .96).toFixed(3) : "1");
  }
  function buildLetters(bindDrag) {
    if (!lines) return;
    builtLang = lang; lines.innerHTML = "";
    let idx = 0;
    ROWS[lang].forEach((text, ri) => {
      const row = document.createElement("div");
      row.className = "lrow";
      [...text.toLocaleUpperCase(lang)].forEach(ch => {
        const e = document.createElement("span");
        if (ch === " ") { e.className = "sp"; row.append(e); return; }
        const [c, o] = pal[ri % 2];
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
    if (bindDrag) $$(".lt", lines).forEach(makeDraggable);
    fitLetters();
  }
  buildLetters(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLetters);

  // beceriler (illüstrasyon araçları başta)
  const pills = $("#pills");
  if (pills) {
    const tools = ["Photoshop", "Clip Studio Paint", ["İllüstrasyon", "Illustration"], "C#", "ASP.NET MVC", "Entity Framework", "PHP", "JavaScript", "Python", "Java", "C++",
      "SQL / PL-SQL", "Oracle", "MS SQL Server", "MySQL", "jQuery", "Bootstrap", "React Native", "Git", "UML", "TCP/IP", "MikroTik", "Cisco Packet Tracer", "CAT6 & Fiber"];
    pills.innerHTML = tools.map(s => Array.isArray(s) ? `<li data-drag data-en="${s[1]}">${s[0]}</li>` : `<li data-drag>${s}</li>`).join("");
  }

  // dil uygulayıcı: data-en, data-en-alt/title/aria-label, data-say-en ve başlık harfleri
  function setHeadings() {
    $$("h2").forEach(h => {
      if (h.dataset.tr === undefined) h.dataset.tr = h.textContent;
      const text = lang === "en" && h.dataset.en ? h.dataset.en : h.dataset.tr;
      h.setAttribute("aria-label", text);
      if (reduce) { h.textContent = text; return; }
      let i = 0;
      h.innerHTML = text.split(" ").map(w => `<span aria-hidden="true" style="white-space:nowrap">${[...w].map(ch => `<span class="ch" style="--i:${i++}">${ch}</span>`).join("")}</span>`).join(" ");
    });
  }
  function applyLang(initial) {
    document.documentElement.lang = lang;
    $$("[data-en]").forEach(el => {
      if (el.tagName === "H2") return;
      if (el.dataset.tr === undefined) el.dataset.tr = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.tr;
    });
    ["alt", "title", "aria-label"].forEach(a => $$(`[data-en-${a}]`).forEach(el => {
      const k = `data-tr-${a}`;
      if (!el.hasAttribute(k)) el.setAttribute(k, el.getAttribute(a) || "");
      el.setAttribute(a, lang === "en" ? el.getAttribute(`data-en-${a}`) : el.getAttribute(k));
    }));
    $$("[data-say-en]").forEach(el => {
      if (el.dataset.sayTr === undefined) el.dataset.sayTr = el.dataset.say;
      el.dataset.say = lang === "en" ? el.dataset.sayEn : el.dataset.sayTr;
    });
    const ld = $(".ld-t");
    if (ld) ld.innerHTML = [...(lang === "en" ? "loading" : "yükleniyor")].map((c, i) => `<span style="--i:${i}">${c}</span>`).join("");
    $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    $$(".lang").forEach(g => { g.dataset.pos = lang; if (!initial && !reduce) { g.classList.remove("sw"); void g.offsetWidth; g.classList.add("sw"); } });
    $$("[data-lang-toggle]").forEach(b => { b.textContent = lang === "en" ? "TR" : "EN"; });
    setHeadings();
    if (builtLang !== lang) buildLetters(!initial);
    dispatchEvent(new Event("langchange"));
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem("lang", l); } catch (e) { /* gizli mod */ }
    // destekleyen tarayıcılarda sayfa çapraz geçişle değişir
    if (document.startViewTransition && !reduce) document.startViewTransition(() => applyLang(false)); else applyLang(false);
  }
  $$("[data-lang]").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
  $$("[data-lang-toggle]").forEach(b => b.addEventListener("click", () => {
    if (!reduce) b.animate([{ transform: "rotate(0) scale(1)" }, { transform: "rotate(180deg) scale(.7)" }, { transform: "rotate(360deg) scale(1)" }], { duration: 480, easing: "cubic-bezier(.3,1.5,.5,1)" });
    setLang(lang === "tr" ? "en" : "tr");
  }));

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
    let ox = 0, oy = 0, sx, sy, s0 = 0, cx = 0, cy = 0, on = false, raf = 0;
    const isPet = el.classList.contains("pet");
    // sayfa kayarken parça imlecin altında kalsın
    const place = () => { ox = cx - sx; oy = cy - sy + (scrollY - s0); el.style.translate = `${ox}px ${oy}px`; };
    // karakteri ekranın üst/alt kenarına götürünce sayfa kayar
    const edge = () => {
      if (!on) { raf = 0; return; }
      const m = 80; let d = 0;
      if (cy < m) d = -(m - cy) / m * 20; else if (cy > innerHeight - m) d = (cy - (innerHeight - m)) / m * 20;
      if (d) { const t = Math.max(0, scrollY + d); lenis ? lenis.scrollTo(t, { immediate: true }) : scrollTo(0, t); place(); }
      raf = requestAnimationFrame(edge);
    };
    el.addEventListener("pointerdown", e => {
      if (e.button) return;
      // içindeki bağlantı ve düğmeler tıklanabilsin: onlardan sürükleme başlatma
      const inner = e.target.closest("a,button");
      if (inner && inner !== el) return;
      delete el.dataset.moved;
      on = true; cx = e.clientX; cy = e.clientY; sx = cx - ox; sy = cy - oy; s0 = scrollY;
      el.setPointerCapture(e.pointerId); el.classList.add("grab");
      if (isPet && !raf) raf = requestAnimationFrame(edge);
    });
    el.addEventListener("pointermove", e => {
      if (!on) return;
      if (Math.hypot(e.clientX - (sx + ox), e.clientY - (sy + oy - (scrollY - s0))) > 5) el.dataset.moved = "1";
      cx = e.clientX; cy = e.clientY; place();
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
  applyLang(true);
  $$("[data-drag]").forEach(makeDraggable);

  /* ---------- sayfadaki küçük karakterler: tıklayınca konuşur ---------- */
  $$(".pet[data-say]").forEach(p => {
    const bub = document.createElement("span"); bub.className = "pb"; p.append(bub);
    const im = $("img", p); let t;
    p.addEventListener("click", e => {
      if (p.dataset.moved) return;
      bub.textContent = p.dataset.say; bub.classList.add("show");
      clearTimeout(t); t = setTimeout(() => bub.classList.remove("show"), 2600);
      if (!reduce) { im.animate([{ translate: "0 0" }, { translate: "0 -20px" }, { translate: "0 0" }], { duration: 480, easing: "cubic-bezier(.3,1.6,.5,1)" }); burst(e.clientX, e.clientY, 5, 160); }
    });
  });
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
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const t = e.target; t.classList.add("in"); io.unobserve(t); setTimeout(() => t.classList.add("played"), 2600); } }),
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
    const cur = () => MSGS[lang];
    if (reduce) { t.textContent = cur()[0]; addEventListener("langchange", () => { t.textContent = cur()[0]; }); }
    else {
      let i = 0, timer;
      const say = (text, after) => {
        clearTimeout(timer); t.textContent = ""; mii.classList.add("talking");
        let k = 0;
        (function step() {
          if (k < text.length) { t.textContent += text[k++]; timer = setTimeout(step, 42); }
          else { mii.classList.remove("talking"); timer = setTimeout(after, 2600); }
        })();
      };
      const loop = () => say(cur()[i++ % cur().length], loop);
      addEventListener("langchange", () => { i = 0; loop(); });
      // sekme görünmezken yazı yazmasın
      document.addEventListener("visibilitychange", () => { if (document.hidden) clearTimeout(timer); else loop(); });
      loop();
      mii.addEventListener("click", e => {
        if (mii.dataset.moved) return;
        mii.classList.remove("jump"); void mii.offsetWidth; mii.classList.add("jump");
        say(HIHI[lang][Math.floor(Math.random() * 3)], loop);
        burst(e.clientX, e.clientY, 7, 200);
      });
    }
  }
})();
