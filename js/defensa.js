/* Sensastreaming · Defensa — motor de la presentación */
(function () {
  "use strict";

  var LOGO = "https://i.imgur.com/6NUFAMf.png";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var viewport = document.getElementById("viewport");
  var stage = document.getElementById("stage");
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var fx = document.getElementById("fx");
  var total = slides.length;
  var cur = -1, busy = false;

  /* ---------- Escala del escenario ---------- */
  function fit() {
    var s = Math.min(viewport.clientWidth / 1920, viewport.clientHeight / 1080);
    stage.style.setProperty("--s", s);
  }
  window.addEventListener("resize", fit); fit();

  /* ---------- HUD: contador, ticker, progreso ---------- */
  var cEl = document.getElementById("hudCur"), tEl = document.getElementById("hudTot");
  var prog = document.querySelector(".progress i");
  tEl.textContent = pad(total);
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var titles = ["El riesgo de limitar al periodismo", "Fuera de los 90 minutos", "El Cangri: un crimen que se convirtió en meme", "Influencer: el precio de la viralidad", "Podcast: análisis de los 4 documentales"];
  var tk = document.getElementById("ticker"), html = "";
  for (var r = 0; r < 4; r++) titles.forEach(function (t) { html += "<span><em>Última hora</em>" + t + "</span>"; });
  tk.innerHTML = html;

  /* ---------- Índice (vista general) ---------- */
  var ov = document.getElementById("overview"), ovGrid = ov.querySelector(".ov-grid");
  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.className = "ov-item"; b.type = "button";
    b.innerHTML = '<span class="n">' + pad(i + 1) + '</span><span class="t">' + (s.getAttribute("data-title") || "") + "</span>";
    b.addEventListener("click", function () { toggleOverview(false); go(i); });
    ovGrid.appendChild(b);
  });
  function toggleOverview(force) {
    var open = typeof force === "boolean" ? force : !ov.classList.contains("open");
    ov.classList.toggle("open", open);
    Array.prototype.forEach.call(ovGrid.children, function (c, i) { c.classList.toggle("cur", i === cur); });
  }

  /* ---------- Notas del orador ---------- */
  var notes = document.getElementById("notes");
  function updateNotes() {
    var n = slides[cur].getAttribute("data-notes") || "Sin notas para esta diapositiva.";
    notes.innerHTML = "<small>Notas · diapositiva " + (cur + 1) + "</small>" + n;
  }
  function toggleNotes() { notes.classList.toggle("open"); updateNotes(); }

  /* ---------- Métricas (desde data/metricas.js) ---------- */
  function buildMetrics() {
    var M = window.SENSA_METRICAS; if (!M) return;
    var k = document.getElementById("kpis"), p = document.getElementById("plats"), u = document.getElementById("upd");
    k.innerHTML = (M.destacadas || []).map(function (d, i) {
      var has = d.valor !== null && d.valor !== undefined;
      return '<div class="card gl kpi rv z" style="--i:' + (i + 1) + '"><span class="v ' + (has ? "" : "empty") + '" data-val="' + (has ? d.valor : "") + '" data-suf="' + (d.sufijo || "") + '">' + (has ? "0" : "—") + '</span><span class="l">' + d.etiqueta + "</span>" + (d.detalle ? '<span class="d">' + d.detalle + "</span>" : "") + "</div>";
    }).join("");
    p.innerHTML = (M.plataformas || []).map(function (pl, i) {
      return '<div class="card plat rv" style="--i:' + (i + 5) + '"><h4>' + pl.nombre + (pl.usuario ? " <small>" + pl.usuario + "</small>" : "") + "</h4><ul>" +
        (pl.datos || []).map(function (d) {
          var has = d.valor !== null && d.valor !== undefined;
          return "<li><span>" + d.etiqueta + "</span><b>" + (has ? fmt(d.valor) : "—") + "</b></li>";
        }).join("") + "</ul></div>";
    }).join("");
    u.textContent = M.actualizado || "Datos por completar";
  }
  function fmt(n) { return typeof n === "number" ? n.toLocaleString("es-CL") : n; }
  function countUp(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll(".kpi .v[data-val]"), function (el) {
      var raw = el.getAttribute("data-val"); if (raw === "") return;
      var to = parseFloat(raw), suf = el.getAttribute("data-suf") || "", t0 = null;
      if (reduce) { el.textContent = fmt(to) + suf; return; }
      function step(t) { if (!t0) t0 = t; var p = Math.min((t - t0) / 1600, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(to * e)) + suf; if (p < 1) requestAnimationFrame(step); }
      setTimeout(function () { requestAnimationFrame(step); }, 700);
    });
  }
  buildMetrics();

  /* ---------- Comportamientos por diapositiva ---------- */
  function onEnter(s) {
    // iframe del sitio en vivo (carga diferida)
    var fr = s.querySelector("iframe[data-src]");
    if (fr && !fr.getAttribute("src")) fr.setAttribute("src", fr.getAttribute("data-src"));
    if (s.querySelector(".kpi")) countUp(s);
  }
  function onLeave(s) {
    Array.prototype.forEach.call(s.querySelectorAll("video"), function (v) { v.remove(); });
  }

  // Vista previa de video al pasar el mouse (como en el sitio)
  document.addEventListener("mouseover", function (e) {
    var t = e.target.closest && e.target.closest(".thumb[data-mp4]");
    if (!t || t.querySelector("video")) return;
    var v = document.createElement("video");
    v.src = t.getAttribute("data-mp4"); v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = "auto";
    v.style.opacity = 0; v.style.transition = "opacity .4s";
    v.addEventListener("playing", function () { v.style.opacity = 1; });
    t.insertBefore(v, t.firstChild.nextSibling || null);
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });
  document.addEventListener("mouseout", function (e) {
    var t = e.target.closest && e.target.closest(".thumb[data-mp4]");
    if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return;
    var v = t.querySelector("video"); if (v) v.remove();
  });

  /* ---------- Transición con el logo girando ---------- */
  var wash = fx.querySelector(".fx-wash"), ring = fx.querySelector(".fx-ring"), ring2 = fx.querySelector(".fx-ring.b"),
      glow = fx.querySelector(".fx-glow"), logo = fx.querySelector(".fx-logo"), fb = fx.querySelector(".fx-fallback"),
      streaks = fx.querySelectorAll(".fx-streak");
  logo.addEventListener("error", function () { logo.style.display = "none"; fb.style.display = "block"; });
  var logoOk = true; logo.addEventListener("error", function () { logoOk = false; });

  function runFx(dir, swap, done) {
    var D = 1250, mid = 520, sp = dir >= 0 ? 1 : -1;
    fx.classList.add("on");
    if (reduce) {
      wash.style.clipPath = "circle(150% at 50% 50%)";
      var a = wash.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, fill: "forwards" });
      setTimeout(swap, 170);
      setTimeout(function () { wash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: "forwards" }).onfinish = function () { cleanup(); done(); }; }, 260);
      return;
    }
    var all = [];
    all.push(wash.animate([
      { clipPath: "circle(0% at 50% 50%)" },
      { clipPath: "circle(78% at 50% 50%)", offset: .36 },
      { clipPath: "circle(78% at 50% 50%)", offset: .56 },
      { clipPath: "circle(0% at 50% 50%)" }
    ], { duration: D, easing: "cubic-bezier(.6,0,.3,1)", fill: "forwards" }));
    all.push(logo.animate([
      { opacity: 0, transform: "perspective(1000px) rotateY(0deg) scale(.25)" },
      { opacity: 1, transform: "perspective(1000px) rotateY(" + (sp * 300) + "deg) scale(.95)", offset: .34 },
      { opacity: 1, transform: "perspective(1000px) rotateY(" + (sp * 560) + "deg) scale(1.08)", offset: .62 },
      { opacity: 1, transform: "perspective(1000px) rotateY(" + (sp * 720) + "deg) scale(1.2)", offset: .74 },
      { opacity: 0, transform: "perspective(1000px) rotateY(" + (sp * 840) + "deg) scale(3.4)" }
    ], { duration: D, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" }));
    if (!logoOk || fb.style.display === "block") all.push(fb.animate([{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "scale(1)", offset: .4 }, { opacity: 1, offset: .7 }, { opacity: 0, transform: "scale(2.5)" }], { duration: D, fill: "forwards" }));
    all.push(ring.animate([
      { opacity: 0, transform: "rotate(0deg) scale(.5)" },
      { opacity: 1, transform: "rotate(" + (sp * 260) + "deg) scale(.95)", offset: .4 },
      { opacity: 1, transform: "rotate(" + (sp * 560) + "deg) scale(1.1)", offset: .72 },
      { opacity: 0, transform: "rotate(" + (sp * 700) + "deg) scale(1.9)" }
    ], { duration: D, easing: "ease-in-out", fill: "forwards" }));
    all.push(ring2.animate([
      { opacity: 0, transform: "rotate(0deg) scale(.4)" },
      { opacity: .7, transform: "rotate(" + (-sp * 200) + "deg) scale(.9)", offset: .45 },
      { opacity: 0, transform: "rotate(" + (-sp * 520) + "deg) scale(1.7)" }
    ], { duration: D, easing: "ease-in-out", fill: "forwards" }));
    all.push(glow.animate([
      { opacity: 0, transform: "scale(.4)" },
      { opacity: 1, transform: "scale(1.1)", offset: .5 },
      { opacity: 0, transform: "scale(2.6)" }
    ], { duration: D, fill: "forwards" }));
    Array.prototype.forEach.call(streaks, function (s, i) {
      all.push(s.animate([
        { transform: "skewX(-18deg) translateX(" + (sp > 0 ? -400 : 2300) + "px)" },
        { transform: "skewX(-18deg) translateX(" + (sp > 0 ? 2300 : -400) + "px)" }
      ], { duration: 780, delay: 90 + i * 140, easing: "cubic-bezier(.5,0,.2,1)", fill: "both" }));
    });
    setTimeout(swap, mid);
    setTimeout(function () { cleanup(); done(); }, D + 40);
    function cleanup() {
      all.forEach(function (a) { try { a.cancel(); } catch (e) {} });
      wash.style.clipPath = ""; fx.classList.remove("on");
    }
  }

  /* ---------- Navegación ---------- */
  function show(i) {
    if (cur >= 0) { onLeave(slides[cur]); slides[cur].classList.remove("active"); }
    cur = i;
    slides[cur].classList.add("active");
    cEl.textContent = pad(cur + 1);
    prog.style.width = ((cur + 1) / total * 100) + "%";
    prevB.disabled = cur === 0; nextB.disabled = cur === total - 1;
    try { history.replaceState(null, "", "#" + (cur + 1)); } catch (e) {}
    onEnter(slides[cur]);
    if (notes.classList.contains("open")) updateNotes();
    try { window.parent !== window && window.parent.postMessage({ type: "sensastreaming-slide", index: cur + 1, total: total }, "*"); } catch (e) {}
  }
  function go(i, silent) {
    i = Math.max(0, Math.min(total - 1, i));
    if (busy || i === cur) return;
    if (silent || cur < 0) { show(i); return; }
    busy = true;
    var dir = i > cur ? 1 : -1;
    runFx(dir, function () { show(i); }, function () { busy = false; });
  }
  function next() { go(cur + 1); } function prev() { go(cur - 1); }

  var prevB = document.getElementById("prev"), nextB = document.getElementById("next");
  prevB.addEventListener("click", prev); nextB.addEventListener("click", next);
  document.getElementById("bPrev").addEventListener("click", prev);
  document.getElementById("bNext").addEventListener("click", next);
  document.getElementById("bOv").addEventListener("click", function () { toggleOverview(); });
  document.getElementById("bNotes").addEventListener("click", toggleNotes);
  var bFs = document.getElementById("bFs");
  function toggleFs() {
    var el = document.documentElement;
    if (!document.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el); }
    else { (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document); }
  }
  bFs.addEventListener("click", toggleFs);
  if (!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen)) bFs.style.display = "none";

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (ov.classList.contains("open")) { if (k === "Escape" || k === "g" || k === "G") toggleOverview(false); return; }
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " " || k === "Enter") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp" || k === "Backspace") { e.preventDefault(); prev(); }
    else if (k === "Home") go(0); else if (k === "End") go(total - 1);
    else if (k === "f" || k === "F") toggleFs();
    else if (k === "g" || k === "G" || k === "Escape") toggleOverview(k !== "Escape");
    else if (k === "n" || k === "N") toggleNotes();
    else if (/^[1-9]$/.test(k)) go(parseInt(k, 10) - 1);
  });

  // Gestos táctiles
  var tx = null, ty = null;
  viewport.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; document.body.classList.add("show-ui"); }, { passive: true });
  viewport.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { dx < 0 ? next() : prev(); }
    tx = ty = null;
  }, { passive: true });

  // Mostrar/ocultar controles según actividad del mouse
  var uiT;
  function ui() { document.body.classList.add("show-ui"); clearTimeout(uiT); uiT = setTimeout(function () { document.body.classList.remove("show-ui"); }, 2600); }
  document.addEventListener("mousemove", ui); ui();

  // API para quien incruste el iframe: ?s=5 o #5
  var q = /[?&]s=(\d+)/.exec(location.search), h = /^#(\d+)$/.exec(location.hash);
  var start = q ? parseInt(q[1], 10) - 1 : h ? parseInt(h[1], 10) - 1 : 0;
  window.addEventListener("message", function (e) {
    var d = e.data; if (!d || d.type !== "sensastreaming-go") return;
    if (d.to === "next") next(); else if (d.to === "prev") prev(); else if (typeof d.to === "number") go(d.to - 1);
  });
  show(Math.max(0, Math.min(total - 1, isNaN(start) ? 0 : start)));
  document.body.classList.add("ready");
})();
