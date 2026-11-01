/* 3D map of the neighbourhood — canvas, real OpenStreetMap geometry (see tools/build_map.py) */
(() => {
  'use strict';
  const D = window.MAP_DATA;
  const stage = document.getElementById('mapStage');
  if (!D || !stage) return;

  const cv = document.getElementById('mapCanvas');
  const ctx = cv.getContext('2d');
  const pinsEl = document.getElementById('mapPins');
  const list = document.getElementById('placeList');
  const compass = document.querySelector('#compass span');
  const MOBILE = matchMedia('(max-width:760px), (pointer:coarse)').matches;

  const TILT = 0.58, HZ = 0.9, FLOOR = 3.3, SITE_H = 16 * FLOOR + 3, VIEW_R = MOBILE ? 235 : 300;
  const ACCENT = '216,183,121';
  const baseRot = -Math.atan2(D.axis[1], D.axis[0]) + 0.32;
  const st = { rot: baseRot - 0.85, zoom: 0.82, active: 'school', dash: 0 };

  let W = 0, H = 0, dpr = 1, scale = 1, cx = 0, cy = 0, dirty = true, visible = false;

  function resize() {
    W = stage.clientWidth; H = stage.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, MOBILE ? 1.5 : 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    dirty = true;
  }

  function project(x, y, z) {
    const c = Math.cos(st.rot), s = Math.sin(st.rot);
    const xr = x * c - y * s, yr = x * s + y * c;
    return [cx + xr * scale, cy - yr * scale * TILT - z * scale * HZ, yr];
  }

  function pathPoly(pts) {
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.closePath();
  }

  function circlePts(r, n = 72) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; out.push(project(Math.cos(a) * r, Math.sin(a) * r, 0)); }
    return out;
  }

  function drawPrism(poly, h, site) {
    const base = poly.map(p => project(p[0], p[1], 0));
    const top = poly.map(p => project(p[0], p[1], h));
    const walls = poly.map((p, i) => {
      const j = (i + 1) % poly.length;
      return { i, j, d: (base[i][2] + base[j][2]) / 2, lit: (base[j][0] - base[i][0]) > 0 };
    }).sort((a, b) => b.d - a.d);
    ctx.lineJoin = 'round';
    for (const w of walls) {
      ctx.beginPath();
      ctx.moveTo(base[w.i][0], base[w.i][1]); ctx.lineTo(base[w.j][0], base[w.j][1]);
      ctx.lineTo(top[w.j][0], top[w.j][1]); ctx.lineTo(top[w.i][0], top[w.i][1]); ctx.closePath();
      if (site) {
        ctx.fillStyle = `rgba(${ACCENT},${w.lit ? .2 : .12})`; ctx.fill();
        ctx.strokeStyle = `rgba(${ACCENT},.95)`; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.strokeStyle = `rgba(${ACCENT},.42)`; ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let z = FLOOR * 2; z < h - 1; z += FLOOR) {
          const a = project(poly[w.i][0], poly[w.i][1], z), b = project(poly[w.j][0], poly[w.j][1], z);
          ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
        }
        ctx.stroke();
      } else {
        ctx.fillStyle = w.lit ? '#202026' : '#1a1a1f'; ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = 0.8; ctx.stroke();
      }
    }
    pathPoly(top);
    if (site) {
      ctx.save();
      if (!MOBILE) { ctx.shadowColor = `rgba(${ACCENT},.8)`; ctx.shadowBlur = 24; }
      ctx.fillStyle = `rgba(${ACCENT},.55)`; ctx.fill(); ctx.restore();
      ctx.strokeStyle = '#f3dcae'; ctx.lineWidth = 1.4; ctx.stroke();
    } else {
      ctx.fillStyle = '#26262d'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.26)'; ctx.lineWidth = 0.8; ctx.stroke();
    }
  }

  function render() {
    scale = Math.min(W / (VIEW_R * 2.05), (H - 70) / (VIEW_R * 2 * TILT + SITE_H * HZ * 0.55)) * st.zoom;
    cx = W / 2; cy = H * (MOBILE ? 0.56 : 0.53);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // ground disc + grid
    const disc = circlePts(330);
    ctx.save();
    pathPoly(disc);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 330 * scale);
    g.addColorStop(0, 'rgba(255,255,255,.035)'); g.addColorStop(1, 'rgba(255,255,255,.008)');
    ctx.fillStyle = g; ctx.fill();
    ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let v = -330; v <= 330; v += 30) {
      let a = project(v, -330, 0), b = project(v, 330, 0); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      a = project(-330, v, 0); b = project(330, v, 0); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();

    // zones (stadium, pitches, gardens)
    for (const z of D.z) {
      pathPoly(z.p.map(p => project(p[0], p[1], 0)));
      ctx.fillStyle = z.k === 'green' ? 'rgba(120,200,120,.07)' : 'rgba(110,200,150,.08)'; ctx.fill();
      ctx.strokeStyle = 'rgba(140,220,170,.22)'; ctx.lineWidth = 1; ctx.stroke();
    }

    // roads
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const r of D.r) {
      ctx.beginPath();
      r.p.forEach((p, i) => { const q = project(p[0], p[1], 0); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
      ctx.strokeStyle = r.w >= 20 ? '#2b2b31' : '#25252b';
      ctx.lineWidth = Math.max(1, r.w * scale * 0.82); ctx.stroke();
    }
    ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.lineWidth = 1;
    for (const r of D.r) {
      if (r.w < 20) continue;
      ctx.beginPath();
      r.p.forEach((p, i) => { const q = project(p[0], p[1], 0); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); });
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // distance rings
    for (const rr of [100, 200, 300]) {
      pathPoly(circlePts(rr));
      ctx.setLineDash([3, 6]); ctx.strokeStyle = `rgba(${ACCENT},${rr === 300 ? .18 : .4})`; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
      const c = Math.cos(st.rot), s = Math.sin(st.rot);
      const lp = project(-rr * s, -rr * c, 0); // point of the ring closest to the viewer
      ctx.font = '600 11px Montserrat, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(232,206,150,.92)'; ctx.fillText(rr + ' м', lp[0], Math.min(lp[1] - 6, H - 14));
    }

    // route to the active place
    const ap = D.poi[st.active];
    if (ap) {
      const a = project(0, 0, 0), b = project(ap[0], ap[1], 0);
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
      ctx.setLineDash([8, 7]); ctx.lineDashOffset = -st.dash;
      ctx.strokeStyle = `rgba(${ACCENT},1)`; ctx.lineWidth = 2.4; ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
      ctx.beginPath(); ctx.arc(b[0], b[1], 5, 0, Math.PI * 2); ctx.fillStyle = `rgb(${ACCENT})`; ctx.fill();
    }
    ctx.restore();

    // buildings far → near (site included)
    const items = D.b.map(b => {
      let sx = 0, sy = 0; b.p.forEach(p => { sx += p[0]; sy += p[1]; });
      return { b, d: project(sx / b.p.length, sy / b.p.length, 0)[2] };
    });
    items.push({ site: true, d: project(0, 0, 0)[2] });
    items.sort((a, b) => b.d - a.d);
    for (const it of items) it.site ? drawPrism(D.site, SITE_H, true) : drawPrism(it.b.p, it.b.h, false);

    // pins: labels stay inside the stage and are pushed apart when they collide
    const placed = [];
    const order = pins.slice().sort((a, b) => (b.k === 'site') - (a.k === 'site') || (b.k === st.active) - (a.k === st.active));
    for (const pin of order) {
      const p = pin.k === 'site' ? [0, 0] : D.poi[pin.k];
      if (!p) continue;
      const on = pin.k === st.active || pin.k === 'site';
      const g0 = project(p[0], p[1], pin.k === 'site' ? SITE_H : 0);
      const t = project(p[0], p[1], pin.k === 'site' ? SITE_H + 8 : 26);
      if (!pin.w) { pin.w = pin.el.offsetWidth; pin.h = pin.el.offsetHeight; }
      const x = Math.min(Math.max(t[0], pin.w / 2 + 8), W - pin.w / 2 - 8);
      let y = Math.min(Math.max(t[1], pin.h + 8), H - 8), tries = 0;
      const box = () => ({ l: x - pin.w / 2 - 3, r: x + pin.w / 2 + 3, t: y - pin.h - 3, b: y + 3 });
      let bx = box();
      while (tries < 4 && placed.some(q => bx.l < q.r && bx.r > q.l && bx.t < q.b && bx.b > q.t)) { y -= pin.h + 6; bx = box(); tries++; }
      const offStage = g0[0] < -20 || g0[0] > W + 20 || g0[1] < -20 || g0[1] > H + 20;
      const hidden = offStage || (!on && (tries >= 4 || y < pin.h + 4));
      pin.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`;
      pin.el.style.visibility = hidden ? 'hidden' : 'visible';
      pin.el.classList.toggle('is-back', g0[2] > 160 && !on);
      if (hidden) continue;
      placed.push(bx);
      ctx.beginPath(); ctx.moveTo(g0[0], g0[1]); ctx.lineTo(x, y);
      ctx.strokeStyle = on ? `rgba(${ACCENT},.9)` : 'rgba(255,255,255,.35)'; ctx.lineWidth = 1; ctx.stroke();
      if (pin.k !== 'site') { ctx.beginPath(); ctx.arc(g0[0], g0[1], 2.6, 0, Math.PI * 2); ctx.fillStyle = on ? `rgb(${ACCENT})` : '#fff'; ctx.fill(); }
    }

    // compass: direction of north on screen
    const c = Math.cos(st.rot), s = Math.sin(st.rot);
    const ang = Math.atan2(-s, c * TILT) * 180 / Math.PI;
    compass.style.transform = `rotate(${ang.toFixed(1)}deg)`;
  }

  /* ---------- pins (labels come from the list, so they follow the language) ---------- */
  let pins = [];
  function buildPins() {
    pinsEl.innerHTML = '';
    pins = [];
    const site = document.createElement('div');
    site.className = 'pin pin--site';
    site.innerHTML = '<img src="../assets/logo/mark-small-gold.svg" alt="">ЖК Юсуф Бунёдкор';
    pinsEl.append(site); pins.push({ k: 'site', el: site });
    list.querySelectorAll('[data-poi]').forEach(btn => {
      const k = btn.dataset.poi;
      if (!D.poi[k]) return;
      const el = document.createElement('button');
      el.className = 'pin' + (k === st.active ? ' is-on' : '');
      el.innerHTML = `<i></i>${btn.querySelector('.pl__t').textContent}<small>${btn.querySelector('.pl__d').textContent}</small>`;
      el.onclick = () => setActive(k);
      pinsEl.append(el); pins.push({ k, el });
    });
    dirty = true;
  }

  function setActive(k) {
    st.active = k;
    list.querySelectorAll('[data-poi]').forEach(b => b.classList.toggle('is-on', b.dataset.poi === k));
    pins.forEach(p => { p.w = 0; if (p.k !== 'site') p.el.classList.toggle('is-on', p.k === k); });
    dirty = true;
  }
  list.addEventListener('click', e => { const b = e.target.closest('[data-poi]'); if (b) setActive(b.dataset.poi); });

  /* ---------- rotate: drag + buttons ---------- */
  let drag = null;
  stage.addEventListener('pointerdown', e => {
    if (e.target.closest('.pin, .mbtn')) return;
    drag = { x: e.clientX, y: e.clientY, rot: st.rot, axis: null };
  });
  window.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.axis && Math.hypot(dx, dy) > 6) {
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'x') { stage.classList.add('is-drag'); gsap.killTweensOf(st, 'rot'); }
    }
    if (drag.axis === 'x') { st.rot = drag.rot + dx * 0.006; dirty = true; }
  });
  const end = () => { drag = null; stage.classList.remove('is-drag'); };
  window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  document.querySelectorAll('[data-rot]').forEach(b => b.onclick = () => {
    gsap.to(st, { rot: st.rot + (+b.dataset.rot) * Math.PI / 180, duration: .9, ease: 'power3.inOut', overwrite: 'auto', onUpdate: () => dirty = true });
  });

  /* ---------- loop: only while its slide is shown ---------- */
  let introDone = false;
  function setVisible(v) {
    visible = v; dirty = true;
    if (v && !introDone) {
      introDone = true;
      gsap.to(st, { rot: baseRot, zoom: 1, duration: 2.4, delay: .5, ease: 'power3.out', onUpdate: () => dirty = true });
    }
  }

  function loop() {
    if (visible) {
      if (!MOBILE) { st.dash = (st.dash + 0.6) % 1000; dirty = true; }
      if (dirty) { dirty = false; render(); }
    }
    requestAnimationFrame(loop);
  }
  new ResizeObserver(resize).observe(stage);
  resize(); buildPins();
  if (document.fonts) document.fonts.ready.then(() => dirty = true);
  requestAnimationFrame(loop);

  window.YBMap = { relabel: buildPins, setVisible };
})();
