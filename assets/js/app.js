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
    heroChip: 'г. Вахдат, проспект Сомониён', heroMeta: '16 этажей · 2 блока · 182 квартиры', day: 'День', night: 'Ночь',
    aLabel: 'Проект', aTitle: 'Комфортная жизнь. Всё необходимое рядом.',
    aText: 'Комплекс находится в Вахдате, на проспекте Сомониён, напротив Колледжа статистики. При выборе квартиры важен не только сам дом, но и то, насколько удобно в нём жить.',
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
    c3d: 'Закрытый двор, игровое оборудование, скамейки и качели.', c4t: 'Парковка',
    c4d: 'Подземная и наземная. Балконы с тыльной стороны дома.', f1: 'блока', f2: 'подъезда', f3: 'лифта', f4: 'парковка',
    gLabel: 'Реальные фото', gTitle: 'Подъезды и лифты', gText: 'Эти фото сделаны в самом доме и в офисе продаж.',
    sLabel: 'Безопасность', sTitle: 'Безопасность и автономность',
    sText: 'Комфорт должен сохраняться и в непредвиденных ситуациях.',
    z1: 'Камеры видеонаблюдения', z2: 'Система безопасности', z3: 'Солнечные панели', z4: 'Генератор', z5: 'Запас воды',
    z6: 'Городская вода и своя скважина', z7: 'трансформатора',
    z8: 'При отключении света работают отдельные лифты, освещение подъездов и водоснабжение.',
    qLabel: 'Качество строительства', qTitle: 'Строительство с вниманием к деталям',
    q1: 'этажей', q2: 'рядов панорамных окон', q3: 'марка цемента', q4: 'квартиры всего',
    q5: 'Арматура по заявленным стандартам', q6: 'Лифты в обоих подъездах', q7: 'Техническую документацию можно посмотреть в офисе продаж', q8: 'Ход строительства',
    fLabel: 'Квартиры', fTitle: 'От однокомнатной до трёхкомнатной', fText: 'Площадь квартир примерно от 50 до 90 м². Цена зависит от этажа.',
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
    tg: ['16 ошёна', '2 блок', '182 квартира', '4 лифт', 'Маркази савдо', 'Парковкаи зеризаминӣ', 'Панелҳои офтобӣ', 'Камераҳо 24/7', 'Захираи об 40 т'],
    ru: ['16 этажей', '2 блока', '182 квартиры', '4 лифта', 'Торговый центр', 'Подземная парковка', 'Солнечные панели', 'Камеры 24/7', 'Запас воды 40 т']
  };
  const T = {
    tg: { som: 'сомонӣ', full: 'Пардохти пурра', minPre: m => `Барои ин ошёна аз ${m}%`,
      sum: c => `<b>${c.floor}-ум ошёна · ${c.area} м² · $${fmt(c.total)}</b><br>${c.pre >= 100 ? 'Пардохти пурра' : `Пешпардохт ${c.pre}% · ${c.term} моҳ × $${fmt(c.month)}`}`,
      wa: c => `Салом! Ба ЖК «Юсуф Бунёдкор» шавқ дорам: ${c.floor}-ум ошёна, ${c.area} м², тахминан $${fmt(c.total)}. ${c.pre >= 100 ? 'Пардохти пурра.' : `Пешпардохт ${c.pre}%, рассрочка ${c.term} моҳ.`}` },
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
        const m = MARQUEE[l]; el.innerHTML = [...m, ...m].map(s => `<span>${s}</span>`).join(''); return;
      }
      if (el.dataset.tg === undefined) el.dataset.tg = el.textContent;
      el.textContent = l === 'ru' && RU[k] ? RU[k] : el.dataset.tg;
      if (el.classList.contains('split') || el.classList.contains('fill')) splitWords(el);
    });
    window.YBMap?.relabel();
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
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    document.body.classList.remove('mnav-open');
    scrollToEl(a.getAttribute('href') === '#top' ? document.body : a.getAttribute('href'));
  });
  $('#burger').onclick = () => document.body.classList.toggle('mnav-open');

  /* ---------------- nav: hide on scroll down ---------------- */
  let lastY = 0;
  const nav = $('#nav');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => {
    const y = self.scroll();
    nav.classList.toggle('is-hidden', y > 300 && y > lastY && !document.body.classList.contains('mnav-open'));
    lastY = y;
  } });
  $$('.nav__links a').forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => a.classList.toggle('is-on', s.isActive) });
  });

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
      .from('.nav', { y: -30, autoAlpha: 0, duration: .9, ease: 'expo.out' }, .6)
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
      gsap.set(words, { opacity: .18 });
      const tw = gsap.to(words, { opacity: 1, ease: 'none', stagger: .1, scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: true } });
      textTriggers.push(tw.scrollTrigger);
    });
  }

  function setupReveals() {
    gsap.set('[data-r]', { y: 46, autoAlpha: 0 });
    ScrollTrigger.batch('[data-r]', {
      start: 'top 90%', once: true,
      onEnter: els => gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', stagger: .08, overwrite: true })
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

  /* ---------------- arc gallery ---------------- */
  function setupArc() {
    const arc = $('#arc'), figs = $$('figure', arc);
    const R = MOBILE ? 560 : Math.min(innerWidth * 0.62, 820);
    const step = MOBILE ? 15 : 12.5;
    arc.style.setProperty('--R', R + 'px');
    arc.style.top = `calc(${MOBILE ? 26 : 24}% + ${R}px)`;
    const span = step * (figs.length - 1);
    figs.forEach((f, i) => {
      f.style.transformOrigin = '0 0';
      f.style.transform = `rotate(${(-span / 2 + i * step).toFixed(2)}deg) translate(-50%,-50%) translateY(${-R}px)`;
    });
    if (REDUCED) return;
    gsap.fromTo(arc, { rotation: span * 0.32 }, { rotation: -span * 0.32, ease: 'none',
      scrollTrigger: { trigger: '.arcsec__pin', start: 'top top', end: '+=130%', scrub: MOBILE ? true : 0.6, pin: true, anticipatePin: 1 } });
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
    const w = (0.42 + (usd - 570) / 110 * 0.58).toFixed(3);
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
  setupText(false);
  setupReveals();
  setupArc();

  const heroImg = $('.hero__night');
  const ready = new Promise(r => { if (heroImg.complete) r(); else { heroImg.onload = heroImg.onerror = r; } });
  Promise.race([Promise.all([ready, document.fonts ? document.fonts.ready : 0]), new Promise(r => setTimeout(r, 3500))])
    .then(() => { intro(); ScrollTrigger.refresh(); });
})();
