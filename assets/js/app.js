/* ЖК «Юсуф Бунёдкор» — landing interactions */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MOBILE = matchMedia('(max-width:760px), (pointer:coarse)').matches;
  const REDUCED = matchMedia('(prefers-reduced-motion:reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.body.classList.add('is-loading');

  /* ---------------- price list ---------------- */
  const FLOORS = {
    5: [680, 6320, 70], 6: [670, 6230, 70], 7: [660, 6130, 60], 8: [650, 6040, 60],
    9: [640, 5950, 50], 10: [630, 5850, 50], 11: [620, 5760, 50], 12: [610, 5670, 40],
    13: [600, 5580, 40], 14: [590, 5480, 30], 15: [580, 5400, 30], 16: [570, 5300, 20]
  };
  const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ');

  /* ---------------- i18n ---------------- */
  let lang = 'tg';
  const RU = {
    nAbout: 'Проект', nLoc: 'Расположение', nInfra: 'Инфраструктура', nFlats: 'Квартиры', nPrice: 'Цены', nContact: 'Контакты',
    brandSub: 'ЖК · г. Вахдат', menu: 'Меню', nGallery: 'Галерея', ovCta: 'Приходите в офис',
    addrShort: 'г. Вахдат, проспект Сомониён, возле школы №1',
    heroChip: 'г. Вахдат, проспект Сомониён', heroMeta: '16 этажей · 2 блока · 182 квартиры', day: 'День', night: 'Ночь',
    aLabel: 'Проект', aTitle: 'Комфортная жизнь в центре Вахдата',
    aText: 'ЖК «Юсуф Бунёдкор» находится в Вахдате на проспекте Сомониён, напротив Колледжа статистики. Рядом школа, детский сад, рынок и главные дороги города.',
    sFloors: 'этажей', sBlocks: 'блока', sFlats: 'квартиры', sLifts: 'лифта',
    nLabel: 'Знакомство', nTitle: 'Что для вас важнее всего?',
    need1: 'Для семейной жизни', need2: 'Для инвестиций', need3: 'Площадь и планировка', need4: 'Цена и условия оплаты',
    payQ: 'Способ оплаты', payFull: 'Полностью', payInst: 'Рассрочка', payNote: 'Ваш выбор учитывается в калькуляторе.',
    lLabel: 'Расположение', lTitle: 'Всё необходимое рядом',
    lText: 'На повседневные дела не нужно тратить лишнее время. Школа, детский сад и стадион в нескольких шагах.',
    pSchool: 'Школа №1', pLyceum: 'Гимназия-лицей «Балъами»', pKinder: 'Детский сад «Лола»', pBehind: 'за домом',
    pStadium: 'Стадион «Хайр»', pFront: 'напротив', pCollege: 'Колледж статистики', pCross: 'Перекрёсток Файзобод',
    pBazaar: 'Центральный рынок', pBank: 'Банки', pPharm: 'Аптека', mapHint: 'Потяните, чтобы повернуть',
    t1: 'Аптеки', t2: 'Больницы', t3: 'Банки', t4: 'Магазины', t5: 'Соборная мечеть', t6: 'Рынок',
    iLabel: 'Инфраструктура', iTitle: 'Не просто квартира, а удобная среда для жизни',
    iText: 'Большую часть повседневных задач можно решить рядом с домом.',
    c1t: 'Торговый центр', c1d: 'На втором этаже, с эскалатором.', c2t: 'Магазины и услуги',
    c2d: 'Первый и второй этажи: одежда, обувь, парикмахерская, салон красоты.', c3t: 'Детская площадка',
    c3d: 'Закрытый двор, игровое оборудование, скамейки и качели.', c4t: 'Лифты и парковка',
    c4d: '4 лифта в двух подъездах. Подземная и наземная парковка.', f1: 'блока', f2: 'подъезда', f3: 'лифта', f4: 'парковка',
    gLabel: 'Галерея', gTitle: 'Дом вблизи', gText: 'Реальные фото дома и офиса продаж, а также визуализации проекта.', floors34: 'Цену уточняйте в офисе продаж',
    sLabel: 'Безопасность', sTitle: 'Безопасность и автономность',
    sText: 'Комфорт должен сохраняться и в непредвиденных ситуациях.',
    z1: 'Камеры видеонаблюдения', z2: 'Система безопасности', z3: 'Солнечные панели', z4: 'Генератор', z5: 'Запас воды',
    z6: 'Городская вода и своя скважина', z7: 'трансформатора',
    z8: 'При отключении света работают отдельные лифты, освещение подъездов и водоснабжение.',
    qLabel: 'Качество строительства', qTitle: 'Строительство с вниманием к деталям',
    q1: 'этажей', q2: 'рядов панорамных окон', q3: 'марка цемента', q4: 'квартиры всего',
    q5: 'Арматура по заявленным стандартам', q6: 'Лифты в обоих подъездах', q7: 'Техническую документацию можно посмотреть в офисе продаж', q8: 'Ход строительства',
    fLabel: 'Квартиры', fTitle: 'От однокомнатной до трёхкомнатной', fText: 'Площадь квартир от 50 до 93 м². Цена зависит от этажа.',
    r1: '1-комнатная', r2: '2-комнатная', r3: '3-комнатная', from: 'от',
    r1a: 'Для одного человека или молодой пары', r1b: 'Подходит для инвестиций', r1c: 'Минимальный бюджет',
    r2a: 'Для молодых семей', r2b: 'Можно превратить в полноценную 3-комнатную', r2c: 'Даже с окном на кухне',
    r3a: 'Для больших семей', r3b: 'Отдельные просторные комнаты', r3c: 'Панорамные окна', calcBtn: 'Рассчитать',
    pLabel: 'Цены и условия', pTitle: 'Условия покупки', tm1: 'Первый взнос', tm2: 'Рассрочка', tm2v: '6 · 12 · 18 мес', tm3: 'Цена за 1 м²',
    floor: 'Этаж', minPre: 'Взнос от', mallShort: 'Торговый центр', cFloor: 'Этаж', cArea: 'Площадь', cPre: 'Первый взнос', cTerm: 'Рассрочка',
    m6: '6 мес', m12: '12 мес', m18: '18 мес', rTotal: 'Общая стоимость', rM2: '1 м²', rPre: 'Первый взнос', rMonth: 'В месяц',
    fine: 'Расчёт ориентировочный. Точную сумму определим в офисе продаж.',
    ctLabel: 'Контакты', ctTitle: 'Приходите в офис продаж', ctText: 'Чтобы получить подробную информацию и выбрать квартиру.',
    ftAddr: 'Адрес', ftPhone: 'Телефон', addr: 'г. Вахдат, проспект Сомониён, перекрёсток Файзобод, возле школы №1', ftNote: 'Изображения являются визуализацией'
  };
  const MARQUEE = {
    tg: ['Маркази савдо', 'Эскалатор', 'Майдончаи кӯдакона', 'Ҳавлии пӯшида', 'Парковкаи зеризаминӣ', 'Панелҳои офтобӣ', 'Камераҳои назоратӣ', 'Генератор', 'Тирезаҳои панорамӣ'],
    ru: ['Торговый центр', 'Эскалатор', 'Детская площадка', 'Закрытый двор', 'Подземная парковка', 'Солнечные панели', 'Видеонаблюдение', 'Генератор', 'Панорамные окна']
  };
  const T = {
    tg: { som: 'сомонӣ', full: 'Пардохти пурра', minPre: m => `Барои ин ошёна аз ${m}%`,
      sum: c => `<b>Ошёнаи ${c.floor}-ум · ${c.area} м² · $${fmt(c.total)}</b><br>${c.pre >= 100 ? 'Пардохти пурра' : `Пешпардохт ${c.pre}% · ${c.term} моҳ × $${fmt(c.month)}`}`,
      wa: c => `Салом! Ба ЖК «Юсуф Бунёдкор» шавқ дорам: ошёнаи ${c.floor}-ум, ${c.area} м², тахминан $${fmt(c.total)}. ${c.pre >= 100 ? 'Пардохти пурра.' : `Пешпардохт ${c.pre}%, рассрочка ${c.term} моҳ.`}` },
    ru: { som: 'сомони', full: 'Полная оплата', minPre: m => `Для этого этажа от ${m}%`,
      sum: c => `<b>${c.floor} этаж · ${c.area} м² · $${fmt(c.total)}</b><br>${c.pre >= 100 ? 'Полная оплата' : `Взнос ${c.pre}% · ${c.term} мес × $${fmt(c.month)}`}`,
      wa: c => `Здравствуйте! Интересует ЖК «Юсуф Бунёдкор»: ${c.floor} этаж, ${c.area} м², примерно $${fmt(c.total)}. ${c.pre >= 100 ? 'Полная оплата.' : `Первый взнос ${c.pre}%, рассрочка ${c.term} мес.`}` }
  };

  function setLang(l, init) {
    lang = l;
    document.documentElement.lang = l === 'ru' ? 'ru' : 'tg';
    $$('[data-lang]').forEach(b => b.classList.toggle('is-on', b.dataset.lang === l));
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (k === 'marquee') {
        const m = MARQUEE[l]; el.innerHTML = [...m, ...m, ...m, ...m].map(s => `<span>${s}</span>`).join(''); return;
      }
      if (el.dataset.tg === undefined) el.dataset.tg = el.textContent;
      el.textContent = l === 'ru' && RU[k] ? RU[k] : el.dataset.tg;
      if (el.classList.contains('split') || el.classList.contains('fill')) splitWords(el);
    });
    window.YBMap?.relabel();
    updateArcCap();
    requestAnimationFrame(() => moveInd(activeLink));
    calc();
    if (!init) { setupText(true); ScrollTrigger.refresh(); }
    try { localStorage.setItem('yb-lang', l); } catch (e) {}
  }
  $$('[data-lang]').forEach(b => b.onclick = () => setLang(b.dataset.lang));

  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w"><span class="wi">${w}</span></span>`).join(' ');
  }

  /* ---------------- smooth scroll (desktop) ---------------- */
  let lenis = null;
  if (!MOBILE && !REDUCED && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  function scrollToEl(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
    else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
  }

  /* ---------------- menu overlay ---------------- */
  const burger = $('#burger'), ov = $('#ov'), ovImg = $('#ovImg');
  const isOpen = () => document.body.classList.contains('ov-open');
  function setMenu(open) {
    if (open === isOpen()) return;
    document.body.classList.toggle('ov-open', open);
    burger.setAttribute('aria-expanded', String(open));
    ov.setAttribute('aria-hidden', String(!open));
    nav.classList.remove('is-hidden');
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      gsap.fromTo('.ov__links a', { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .9, ease: 'expo.out', stagger: .05, delay: .3 });
      gsap.fromTo('.ov__ph, .ov__foot', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9, ease: 'expo.out', delay: .5 });
      setTimeout(() => $('.ov__links a').focus({ preventScroll: true }), 400);
    } else {
      document.documentElement.style.overflow = '';
      lenis?.start();
      if (ov.contains(document.activeElement)) burger.focus({ preventScroll: true });
    }
  }
  burger.onclick = () => setMenu(!isOpen());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  $$('.ov__links a').forEach(a => a.addEventListener('mouseenter', () => {
    const src = `assets/img/${a.dataset.img}-m.webp`;
    if (ovImg.getAttribute('src') === src) return;
    ovImg.classList.add('is-swap');
    setTimeout(() => {
      ovImg.onload = () => ovImg.classList.remove('is-swap');
      ovImg.src = src;
    }, 160);
  }));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    const wasOpen = isOpen(), href = a.getAttribute('href');
    setMenu(false);
    setTimeout(() => scrollToEl(href === '#top' ? document.body : href), wasOpen ? 420 : 0);
  });

  /* ---------------- nav: hide on scroll down, active section pill, progress ---------------- */
  const nav = $('#nav'), ind = $('#navInd'), prog = $('#navProg');
  let lastY = 0, activeLink = null;
  function moveInd(a) {
    if (!a || !a.offsetWidth) { ind.style.opacity = 0; return; }
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
    ind.style.opacity = 1;
  }
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
    const y = self.scroll();
    if (!isOpen()) {
      if (y > 420 && y > lastY + 3) nav.classList.add('is-hidden');
      else if (y < lastY - 3 || y <= 420) nav.classList.remove('is-hidden');
    }
    nav.classList.toggle('is-scrolled', y > 40);
    prog.style.transform = `scaleX(${self.progress.toFixed(4)})`;
    lastY = y;
  } });
  $$('.nav__links a').forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: st => {
      a.classList.toggle('is-on', st.isActive);
      if (st.isActive) activeLink = a; else if (activeLink === a) activeLink = null;
      moveInd(activeLink);
    } });
    a.addEventListener('mouseenter', () => moveInd(a));
  });
  $('#navLinks').addEventListener('mouseleave', () => moveInd(activeLink));
  addEventListener('resize', () => moveInd(activeLink));

  /* ---------------- giant headline: fitted exactly to the content width ---------------- */
  const giant = $('.giant');
  function fitGiant() {
    const box = giant.parentElement, cs = getComputedStyle(box);
    const W = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    giant.style.fontSize = '100px';
    const stacked = getComputedStyle(giant).flexDirection === 'column';
    const ws = $$('.giant__line>span', giant).map(el => el.getBoundingClientRect().width);
    const fs = stacked ? 100 * W / Math.max(...ws) : 100 * W / (ws[0] + ws[1] + 18);
    giant.style.fontSize = Math.min(fs * 0.99, stacked ? 170 : 400).toFixed(1) + 'px';
  }

  /* ---------------- hero ---------------- */
  $('#dayNight').onclick = () => $('.hero').classList.toggle('is-day');

  function intro() {
    document.body.classList.remove('is-loading');
    const tl = gsap.timeline();
    tl.to('#loader', { autoAlpha: 0, duration: .6, ease: 'power2.out' })
      .from('.giant__line>span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: .08 }, .1)
      .from('.hero__top>*', { y: 20, autoAlpha: 0, duration: .9, ease: 'expo.out', stagger: .06 }, .25)
      .fromTo('#heroMedia', { clipPath: 'inset(14% 10% 0% 10% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.6, ease: 'expo.inOut' }, .2)
      .from('.hero__img', { scale: 1.25, duration: 2, ease: 'expo.out' }, .3)
      .from('.nav__in', { y: -30, autoAlpha: 0, duration: .9, ease: 'expo.out', clearProps: 'transform' }, .6)
      .from('.hero__ui>*', { y: 20, autoAlpha: 0, duration: .8, ease: 'expo.out', stagger: .08 }, 1.1);
  }
  if (!REDUCED) {
    gsap.to('.hero__img', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '#heroMedia', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.giant', { yPercent: -30, autoAlpha: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '60% top', scrub: true } });
  }

  /* ---------------- scroll reveals ---------------- */
  let textTriggers = [];
  function setupText(rebuild) {
    textTriggers.forEach(t => t.kill()); textTriggers = [];
    $$('.split').forEach(el => {
      const words = $$('.wi', el);
      if (rebuild) { gsap.set(words, { yPercent: 0 }); return; }
      gsap.set(words, { yPercent: 110 });
      textTriggers.push(ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .035 }) }));
    });
    $$('.fill').forEach(el => {
      const words = $$('.wi', el);
      gsap.set(words, { opacity: .32 });
      const tw = gsap.to(words, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 65%', scrub: true } });
      textTriggers.push(tw.scrollTrigger);
    });
  }

  function setupReveals() {
    gsap.set('[data-r]', { y: 46, opacity: 0 });
    ScrollTrigger.batch('[data-r]', {
      start: 'top 90%', once: true,
      onEnter: els => gsap.to(els, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true })
    });
    $$('[data-count]').forEach(el => {
      const to = +el.dataset.count;
      ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => {
        const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => el.textContent = Math.round(o.v) });
      } });
    });
    $$('.plan').forEach(p => ScrollTrigger.create({ trigger: p, start: 'top 80%', once: true, onEnter: () => p.classList.add('is-in') }));
    ScrollTrigger.create({ trigger: '#tower', start: 'top 85%', once: true, onEnter: () => $('#tower').classList.add('is-in') });
    if (!MOBILE && !REDUCED) {
      $$('[data-px]').forEach(img => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
      gsap.fromTo('.ph--tilt-l', { rotation: 0, y: 40 }, { rotation: -4, y: -20, ease: 'none', scrollTrigger: { trigger: '.trio', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.fromTo('.ph--tilt-r', { rotation: 0, y: 40 }, { rotation: 4, y: -20, ease: 'none', scrollTrigger: { trigger: '.trio', start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------------- arc gallery: 3D focus carousel ---------------- */
  // Photos sit on a big circle; scrolling turns the circle, and the photo passing the top
  // comes towards the camera (bigger, upright, full brightness) while the rest recede.
  const CAPS = {
    tg: { office: 'Офиси фурӯш', mall: 'Маркази савдо', facade: 'Фасад', lobby: 'Толори лифтҳо', lifts: 'Лифтҳо', cabin: 'Кабинаи лифт', corridor: 'Долони ошёна', door: 'Дари квартира', build: 'Раванди сохтмон' },
    ru: { office: 'Офис продаж', mall: 'Торговый центр', facade: 'Фасад', lobby: 'Лифтовый холл', lifts: 'Лифты', cabin: 'Кабина лифта', corridor: 'Коридор этажа', door: 'Дверь квартиры', build: 'Ход строительства' }
  };
  const arcState = { cur: 0, target: 0, focus: -1 };
  const arcFigs = $$('#arc figure');
  function updateArcCap() {
    const f = arcFigs[arcState.focus];
    if (!f) return;
    $('#arcNum').textContent = String(arcState.focus + 1).padStart(2, '0');
    $('#arcCapT').textContent = CAPS[lang][f.dataset.cap] || '';
  }
  function setupArc() {
    const pin = $('.arcsec__pin'), arc = $('#arc'), n = arcFigs.length;
    const FS = 1.5;                     // scale of the photo in focus
    let R = 800, step = 14, range = 0, trig = null;
    $('#arcCap span').textContent = '/ ' + String(n).padStart(2, '0');

    // each photo holds in focus for a while, then the arc turns to the next one
    function targetAt(p) {
      const t = p * (n - 1), i = Math.min(Math.floor(t), n - 1), f = t - i, h = .22;
      let g = f < h ? 0 : f > 1 - h ? 1 : (f - h) / (1 - 2 * h);
      g = g * g * (3 - 2 * g);
      return range / 2 - (i + g) * step;
    }
    function render(force) {
      arcFigs.forEach((f, i) => {
        const a = (i - (n - 1) / 2) * step + arcState.cur;          // angle from the top, deg
        const k = 0.5 + 0.5 * Math.cos(Math.PI * Math.min(Math.abs(a) / (step * 1.5), 1)); // 1 = in focus
        const r = a * Math.PI / 180;
        const x = R * Math.sin(r), y = -R * Math.cos(r) - 18 * k;
        const ry = Math.max(-26, Math.min(26, -a * .9)) * (1 - k);
        f.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${(a * (1 - .85 * k)).toFixed(2)}deg) perspective(900px) rotateY(${ry.toFixed(2)}deg) scale(${(1 + (FS - 1) * k).toFixed(3)})`;
        const fade = Math.min(1, Math.max(0, (78 - Math.abs(a)) / 22));
        f.style.zIndex = String(400 + Math.round(k * 100) - Math.round(Math.abs(a) * 2));
        f.style.setProperty('--dim', (0.62 * (1 - k)).toFixed(3));
        f.style.opacity = fade.toFixed(3);
        f.style.visibility = fade > 0 ? 'visible' : 'hidden';
      });
      const idx = Math.max(0, Math.min(n - 1, Math.round((n - 1) / 2 - arcState.cur / step)));
      if (idx !== arcState.focus || force) {
        arcFigs[arcState.focus]?.classList.remove('is-focus');
        arcState.focus = idx;
        arcFigs[idx].classList.add('is-focus');
        updateArcCap();
      }
    }
    function layout() {
      const vw = innerWidth, vh = Math.max(innerHeight, 600);
      const cw = Math.round(Math.max(118, Math.min(vw * (MOBILE ? .34 : .13), vh * .21, 230)));
      const ch = cw * 4 / 3;
      R = MOBILE ? Math.max(vw * 1.3, 500) : Math.min(Math.max(vw * .5, 640), 1000);
      step = (cw * 1.12 / R) * 180 / Math.PI;
      range = step * (n - 1);
      pin.style.setProperty('--cw', cw + 'px');
      const capH = $('.arcsec__c').offsetHeight;                   // caption + title + text under the photo
      const top = Math.max(vh * .05, (vh - (ch * FS + 26 + capH)) / 2);
      const cy = top + ch * FS / 2;                                // centre of the photo in focus
      arc.style.top = (cy + R) + 'px';
      pin.style.setProperty('--cap-top', Math.round(cy + ch * FS / 2 + 26) + 'px');
      arcState.target = targetAt(trig ? trig.progress : 0);
      arcState.cur = arcState.target;
      render(true);
    }
    layout();
    addEventListener('resize', layout);
    if (REDUCED) return;
    trig = ScrollTrigger.create({
      trigger: pin, start: 'top top', end: () => '+=' + Math.round(innerHeight * (MOBILE ? 2.2 : 2.6)),
      pin: true, anticipatePin: 1, refreshPriority: 1,
      onUpdate: st => { arcState.target = targetAt(st.progress); }
    });
    gsap.ticker.add(() => {
      const d = arcState.target - arcState.cur;
      if (Math.abs(d) < 0.004) return;
      arcState.cur += d * (MOBILE ? .2 : .11);
      render();
    });
    gsap.from('.arcsec__c>*', { y: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: .1,
      scrollTrigger: { trigger: '.arcsec', start: 'top 60%' } });
  }

  /* ---------------- needs ---------------- */
  const profile = { needs: new Set(), pay: null };
  $$('.need').forEach(b => b.onclick = () => {
    const k = b.dataset.need;
    profile.needs.has(k) ? profile.needs.delete(k) : profile.needs.add(k);
    b.classList.toggle('is-on', profile.needs.has(k));
    highlightPlan();
  });
  $$('#payMode button').forEach(b => b.onclick = () => {
    profile.pay = b.dataset.pay;
    $$('#payMode button').forEach(x => x.classList.toggle('is-on', x === b));
    const pre = $('#cPre');
    pre.value = profile.pay === 'full' ? 100 : Math.max(FLOORS[+$('#cFloor').value][2], Math.min(+pre.value, 70));
    calc();
  });
  function highlightPlan() {
    let k = 1;
    if (profile.needs.has('invest') && !profile.needs.has('family')) k = 0;
    else if (profile.needs.has('family')) k = 2;
    $$('.plan').forEach((p, i) => {
      const hot = i === k;
      p.classList.toggle('plan--hot', hot);
      const btn = $('.btn', p);
      btn.classList.toggle('btn--dark', hot); btn.classList.toggle('btn--line', !hot);
    });
  }

  /* ---------------- tower + calculator ---------------- */
  const tower = $('#tower');
  tower.innerHTML = Object.keys(FLOORS).map(Number).sort((a, b) => b - a).map(f => {
    const [usd, , min] = FLOORS[f];
    const w = (min / 70).toFixed(3);
    return `<button class="fl" data-floor="${f}"><span class="fl__n">${f}</span><span class="fl__bar"><i style="--w:${w}"></i><u>${min}%</u></span><span class="fl__p">$${usd}</span></button>`;
  }).join('');
  $$('.fl', tower).forEach(b => b.onclick = () => { $('#cFloor').value = b.dataset.floor; calc(); });
  $$('[data-calc]').forEach(b => b.onclick = () => { $('#cArea').value = b.dataset.calc; calc(); scrollToEl('#price'); });

  function setFill(inp) { inp.style.setProperty('--p', ((inp.value - inp.min) / (inp.max - inp.min) * 100) + '%'); }
  function tween(el, val) {
    const o = { v: +el.dataset.v || 0 }; el.dataset.v = val;
    gsap.to(o, { v: val, duration: .6, ease: 'power3.out', overwrite: true, onUpdate: () => el.textContent = '$' + fmt(o.v) });
  }
  function calc() {
    const fI = $('#cFloor'), aI = $('#cArea'), pI = $('#cPre');
    const floor = +fI.value, area = +aI.value;
    const [usd, som, min] = FLOORS[floor];
    pI.min = min;
    if (+pI.value < min) pI.value = min;
    const pre = +pI.value;
    const term = +($('#cTerm .is-on')?.dataset.term || 12);
    const total = usd * area, preAmt = total * pre / 100, month = pre >= 100 ? 0 : (total - preAmt) / term;
    $('#cFloorV').textContent = floor; $('#cAreaV').textContent = area; $('#cPreV').textContent = pre;
    $('#cPreHint').textContent = pre >= 100 ? T[lang].full : T[lang].minPre(min);
    $('#termRow').classList.toggle('is-off', pre >= 100);
    [fI, aI, pI].forEach(setFill);
    $$('.fl', tower).forEach(b => b.classList.toggle('is-on', +b.dataset.floor === floor));
    tween($('#rTotal'), total); tween($('#rM2'), usd); tween($('#rPre'), preAmt); tween($('#rMonth'), month);
    $('#rTotalS').textContent = `${fmt(som * area)} ${T[lang].som}`;
    const c = { floor, area, total, pre, term, month };
    $('#summary').innerHTML = T[lang].sum(c);
    $('#waBtn').href = 'https://wa.me/992000777761?text=' + encodeURIComponent(T[lang].wa(c));
  }
  ['#cFloor', '#cArea', '#cPre'].forEach(s => $(s).addEventListener('input', calc));
  $$('#cTerm button').forEach(b => b.onclick = () => { $$('#cTerm button').forEach(x => x.classList.toggle('is-on', x === b)); calc(); });

  /* ---------------- boot ---------------- */
  let saved = 'tg';
  try { saved = localStorage.getItem('yb-lang') || 'tg'; } catch (e) {}
  setLang(saved === 'ru' ? 'ru' : 'tg', true);
  fitGiant();
  setupArc();
  setupText(false);
  setupReveals();
  let rz; addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(fitGiant); });
  document.fonts?.ready.then(() => { fitGiant(); ScrollTrigger.refresh(); });

  const heroImg = $('.hero__night');
  const ready = new Promise(r => { if (heroImg.complete) r(); else { heroImg.onload = heroImg.onerror = r; } });
  Promise.race([Promise.all([ready, document.fonts ? document.fonts.ready : 0]), new Promise(r => setTimeout(r, 3500))])
    .then(() => { intro(); ScrollTrigger.refresh(); });
})();
