/* ЖК «Юсуф Бунёдкор» — presentation engine */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const MOBILE = matchMedia('(max-width:900px), (pointer:coarse)').matches;
  const REDUCED = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const D = REDUCED ? 0.01 : MOBILE ? 0.9 : 1.25;

  const slides = $$('.slide');
  const N = slides.length;
  let cur = 0, busy = false, lang = 'tg';

  /* ---------------- price data (from price list) ---------------- */
  const FLOORS = {
    5: [680, 6320, 70], 6: [670, 6230, 70], 7: [660, 6130, 60], 8: [650, 6040, 60],
    9: [640, 5950, 50], 10: [630, 5850, 50], 11: [620, 5760, 50], 12: [610, 5670, 40],
    13: [600, 5580, 40], 14: [590, 5480, 30], 15: [580, 5400, 30], 16: [570, 5300, 20]
  };

  /* ---------------- i18n ---------------- */
  const RU = {
    hint: 'Скролл или клавиши ← →', menuTitle: 'Содержание',
    heroEyebrow: 'Жилой комплекс · г. Вахдат', heroTitle: 'Юсуф<br><em>Бунёдкор</em>',
    heroLead: 'Комфортная жизнь. Всё необходимое — рядом с вами.',
    floors: 'этажей', blocks: 'блока', flats: 'квартиры', start: 'Начать презентацию', toPrices: 'Цены',
    addr1: 'г. Вахдат, ул. Сомониён', addr2: 'Напротив Колледжа статистики', day: 'День', night: 'Ночь',
    needsEyebrow: 'Знакомство', needsTitle: 'Что для вас <em>важнее</em><br>всего?',
    needsSub: 'Выберите — и презентация подстроится под вас.',
    needFamily: 'Для семейной жизни', needInvest: 'Для инвестиций', needArea: 'Площадь и планировка', needPrice: 'Цена и условия оплаты',
    payQ: 'Способ оплаты:', payFull: 'Полностью', payInst: 'Рассрочка',
    locEyebrow: 'Главное преимущество', locTitle: 'Всё<br><em>рядом</em> с вами',
    locSub: 'Меньше времени на дорогу — больше на жизнь.',
    pSchool: 'Средняя школа', pLyceum: 'Гимназия-лицей «Балъами»', pKinder: 'Детский сад «Лола»', pBehind: 'за домом',
    pSport: 'Стадион и спортсекции', pFront: 'напротив',
    tPharm: 'Аптеки', tHosp: 'Больницы', tBank: 'Банки', tShop: 'Магазины', tMosque: 'Соборная мечеть', tMarket: 'Рынок',
    street: 'ул. Сомониён', rSchool: 'Школа', rLyceum: 'Лицей', rKinder: 'Детсад', rSport: 'Стадион',
    cxEyebrow: 'Внутренняя инфраструктура', cxTitle: 'Не просто квартира —<br><em>среда для жизни</em>',
    cxShops: 'Магазины', cxShopsD: 'на первом и втором этажах', cxMall: 'Торговый центр', cxMallD: 'второй этаж · эскалатор',
    cxYard: 'Детская площадка', cxYardD: 'закрытый двор', cxBlocks: 'блока и подъезда', cxLifts: 'лифта',
    cxPark: 'подземная и наземная парковка',
    realEyebrow: 'Реальность, а не только рендер', realTitle: 'Подъезды<br>и <em>лифты</em>',
    realSub: 'Мрамор, натуральное дерево и тёплый свет — эти фото сделаны в самом доме.', drag: 'Листайте ↔',
    gLobby: 'Лифтовый холл', gCorr: 'Коридор этажа', gLift: 'Кабина лифта', gDoor: 'Дверь квартиры', gMall: 'Торговый центр',
    safeEyebrow: 'Безопасность и автономность', safeTitle: 'Комфорт — даже<br>в <em>непредвиденных</em> ситуациях',
    sCam: 'Камеры видеонаблюдения', sSecB: 'Защита', sSec: 'Система безопасности', sSolarB: 'Солнце', sSolar: 'Солнечные панели',
    sGenB: 'Резерв', sGen: 'Генератор', sWater: 'Запас воды', sWellB: '2 источника', sWell: 'Городская вода и собственная скважина',
    sTrans: 'Трансформатора', safeNote: 'При отключении света работают отдельные лифты, освещение подъездов и водоснабжение.',
    qTag: 'Панорамные окна', qEyebrow: 'Качество и характеристики', qTitle: 'Строительство с вниманием<br>к <em>деталям</em>',
    qFloors: 'этажей', qWin: 'рядов панорамных окон', qCem: 'марка цемента', qFlats: 'квартиры всего',
    qArm: 'Арматура по заявленным стандартам', qLifts: 'Лифты в обоих подъездах', qSite: 'Ход строительства · реальные фото',
    aptEyebrow: 'Планировки', aptTitle: 'От однокомнатной<br>до <em>трёхкомнатной</em>',
    r1: '1-комнатная', r2: '2-комнатная', r3: '3-комнатная', from: 'от',
    r1d: 'Для одиноких и молодых. Экономичный выбор.', r2d: 'Для молодых семей с 1–2 детьми.', r3d: 'Для больших семей. Отдельные просторные комнаты.',
    convert: '2-комнатную можно превратить в полноценную 3-комнатную — даже с окном на кухне.',
    floor: 'Этаж', minPreHead: 'мин. первый взнос', mallShort: 'Торговый центр', parkShort: 'Паркинг',
    priceEyebrow: 'Условия покупки', priceTitle: 'Рассчитайте<br>свою <em>квартиру</em>',
    cFloor: 'Этаж', cArea: 'Площадь', cPre: 'Первый взнос', cTerm: 'Рассрочка', m6: '6 мес', m12: '12 мес', m18: '18 мес',
    rTotal: 'Общая стоимость', rM2: 'Цена за 1 м²', rPre: 'Первый взнос', rMonth: 'В месяц',
    fine: 'Цена зависит от этажа. Расчёт ориентировочный — точную сумму определим в офисе продаж.',
    ctEyebrow: 'Следующий шаг', ctTitle: 'Приходите<br><em>в офис продаж</em>',
    ctSub: 'Вместе подберём подходящую квартиру и точно рассчитаем условия покупки.', yourCalc: 'Ваш расчёт',
    wa: 'Написать в WhatsApp', ctAddr: 'г. Вахдат, ул. Сомониён', ctAddr2: 'перекрёсток Файзобод, возле школы №1',
    openMap: 'Открыть карту →', foot: 'Изображения являются визуализацией'
  };
  const SERVICES = {
    tg: ['Либос', 'Пойафзол', 'Сартарошхона', 'Салони зебоӣ', 'Кафе', 'Балконҳо аз тарафи қафои бино'],
    ru: ['Одежда', 'Обувь', 'Парикмахерская', 'Салон красоты', 'Кафе', 'Балконы с тыльной стороны дома']
  };
  const T = {
    tg: { floorW: 'ошёна', full: 'Пардохти пурра', minPre: m => `Ҳадди ақал барои ин ошёна — ${m}%`, needs: n => `${n} интихоб`,
      inst: 'Рассрочка', fullS: 'Пурра', som: 'сомонӣ', mo: 'моҳ',
      sum: c => `${c.floor}-ум ошёна · ${c.area} м² · $${fmt(c.total)}<br>${c.pre === 100 ? 'Пардохти пурра' : `Пешпардохт ${c.pre}% · ${c.term} моҳ × $${fmt(c.month)}`}`,
      wa: c => `Салом! Ман ба ЖК «Юсуф Бунёдкор» шавқ дорам: ${c.floor}-ум ошёна, ${c.area} м², тахминан $${fmt(c.total)}. ${c.pre === 100 ? 'Пардохти пурра.' : `Пешпардохт ${c.pre}%, рассрочка ${c.term} моҳ.`}` },
    ru: { floorW: 'этаж', full: 'Полная оплата', minPre: m => `Минимум для этого этажа — ${m}%`, needs: n => `Выбрано: ${n}`,
      inst: 'Рассрочка', fullS: 'Полностью', som: 'сомони', mo: 'мес',
      sum: c => `${c.floor} этаж · ${c.area} м² · $${fmt(c.total)}<br>${c.pre === 100 ? 'Полная оплата' : `Взнос ${c.pre}% · ${c.term} мес × $${fmt(c.month)}`}`,
      wa: c => `Здравствуйте! Меня интересует ЖК «Юсуф Бунёдкор»: ${c.floor} этаж, ${c.area} м², примерно $${fmt(c.total)}. ${c.pre === 100 ? 'Полная оплата.' : `Первый взнос ${c.pre}%, рассрочка ${c.term} мес.`}` }
  };
  const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/,/g, ' ');

  function setLang(l) {
    lang = l;
    document.documentElement.lang = l === 'ru' ? 'ru' : 'tg';
    $$('[data-lang]').forEach(b => b.classList.toggle('is-on', b.dataset.lang === l));
    $$('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (k === 'cxServices') {
        const list = SERVICES[l];
        el.innerHTML = [...list, ...list].map(s => `<span>${s}</span>`).join('');
        return;
      }
      if (el.dataset.tg === undefined) el.dataset.tg = el.classList.contains('split') ? (el.dataset.raw || el.innerHTML) : el.innerHTML;
      el.innerHTML = l === 'ru' && RU[k] ? RU[k] : el.dataset.tg;
      if (el.classList.contains('split')) { el.dataset.raw = el.innerHTML; split(el); }
    });
    buildRail(); buildMenu(); setTopTitle(false); updateProfile(); calc();
    window.YBMap?.relabel();
    try { localStorage.setItem('yb-lang', l); } catch (e) {}
  }

  /* ---------------- split headings into words ---------------- */
  function split(el) {
    if (!el.dataset.raw) el.dataset.raw = el.innerHTML;
    const walk = node => {
      [...node.childNodes].forEach(c => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/([ \t\n\r]+)/).forEach(p => {
            if (!p) return;
            if (/^[ \t\n\r]+$/.test(p)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
            w.append(i); frag.append(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    };
    walk(el);
  }
  $$('.split').forEach(split);

  /* ---------------- lazy images (only near slides) ---------------- */
  // every non-hero image is declared with data-src; mobile gets lighter "-m" versions for non-background images
  function loadSlide(i) {
    const s = slides[i]; if (!s || s.dataset.loaded) return;
    s.dataset.loaded = 1;
    $$('img[data-src]', s).forEach(img => {
      let src = img.dataset.src;
      if (MOBILE && !img.classList.contains('bg__img') && !src.endsWith('-m.webp')) src = src.replace('.webp', '-m.webp');
      img.decoding = 'async';
      img.src = src;
      img.removeAttribute('data-src');
    });
  }

  /* ---------------- chrome: rail / menu / title ---------------- */
  const titleOf = s => lang === 'ru' ? s.dataset.titleRu : s.dataset.title;
  const pad = n => String(n).padStart(2, '0');

  function buildRail() {
    $('#rail').innerHTML = slides.map((s, i) =>
      `<button data-go="${i}" class="${i === cur ? 'is-on' : ''}"><i></i>${pad(i + 1)}<span>${titleOf(s)}</span></button>`).join('');
  }
  function buildMenu() {
    $('#menuGrid').innerHTML = slides.map((s, i) =>
      `<button class="mcard ${i === cur ? 'is-on' : ''}" data-go="${i}" style="transition-delay:${i * 0.035}s">
        <img src="../assets/img/${s.dataset.thumb}-t.webp" alt="" loading="lazy"><small>${pad(i + 1)}</small><span>${titleOf(s)}</span></button>`).join('');
  }
  function setTopTitle(animate = true) {
    const t = $('#topTitle'), n = $('#topNum');
    const apply = () => { t.textContent = titleOf(slides[cur]); n.textContent = pad(cur + 1); };
    if (!animate || REDUCED) return apply();
    gsap.to([t, n], { yPercent: -110, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => {
      apply(); gsap.fromTo([t, n], { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
    } });
  }
  function updateChrome() {
    $$('#rail button').forEach((b, i) => b.classList.toggle('is-on', i === cur));
    $$('.mcard').forEach((b, i) => b.classList.toggle('is-on', i === cur));
    const c = $('#cntCur');
    gsap.fromTo(c, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, ease: 'expo.out', onStart: () => c.textContent = pad(cur + 1) });
    $('#progressBar').style.transform = `scaleX(${(cur + 1) / N})`;
    $('#prevBtn').disabled = cur === 0;
    $('#nextBtn').disabled = cur === N - 1;
    setTopTitle();
    history.replaceState(null, '', '#' + (cur + 1));
  }
  $('#cntAll').textContent = pad(N);

  /* ---------------- reveal & counters ---------------- */
  function hideContent(s) {
    gsap.set($$('.split .wi', s), { yPercent: 115 });
    gsap.set($$('[data-a]', s), { y: 40, opacity: 0 });
  }
  function reveal(s, delay = 0) {
    gsap.to($$('.split .wi', s), { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: .04, delay });
    gsap.to($$('[data-a]', s), { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: .055, delay: delay + .18 });
    $$('[data-count]', s).forEach(el => {
      const o = { v: 0 }, to = +el.dataset.count;
      gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', delay: delay + .3, onUpdate: () => el.textContent = Math.round(o.v) });
    });
  }

  /* ---------------- navigation ---------------- */
  function go(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === cur || busy) return;
    busy = true;
    closeMenu();
    const from = slides[cur], to = slides[i], dir = i > cur ? 1 : -1;
    loadSlide(i); loadSlide(i + 1); loadSlide(i - 1);
    cur = i;
    updateChrome();

    hideContent(to);
    to.classList.remove('is-in');
    $('.slide__scroll', to).scrollTop = 0;
    from.classList.add('is-leaving');
    from.classList.remove('is-active');
    to.classList.add('is-active');

    const fromBg = $('.bg', from), toBg = $('.bg', to), fromBody = $('.slide__scroll', from);
    const tl = gsap.timeline({ onComplete: () => {
      from.classList.remove('is-leaving', 'is-in');
      gsap.set([from, fromBody, fromBg, to], { clearProps: 'clipPath,opacity,y,scale,yPercent' });
      busy = false;
    } });
    tl.fromTo(to, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: D, ease: 'expo.inOut' }, 0);
    if (toBg) tl.fromTo(toBg, { scale: 1.22, yPercent: dir * 6 }, { scale: 1, yPercent: 0, duration: D * 1.4, ease: 'expo.out' }, D * 0.25);
    tl.to(fromBody, { y: -dir * 90, opacity: 0, duration: D * 0.7, ease: 'power3.in' }, 0);
    if (fromBg) tl.to(fromBg, { scale: 1.08, yPercent: -dir * 5, duration: D, ease: 'expo.inOut' }, 0);
    tl.add(() => { to.classList.add('is-in'); reveal(to); }, D * 0.5);
    onEnter(i);
  }
  const next = () => go(cur + 1), prev = () => go(cur - 1);

  function onEnter(i) {
    window.YBMap?.setVisible(slides[i].classList.contains('s-loc'));
    if (slides[i].classList.contains('s-apt')) highlightApt();
  }

  // clicks
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(+g.dataset.go); return; }
    if (e.target.closest('[data-next]')) next();
  });
  addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n) go(n - 1); });
  $('#nextBtn').onclick = next;
  $('#prevBtn').onclick = prev;

  // keyboard
  document.addEventListener('keydown', e => {
    if (e.target.matches('input')) return;
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(N - 1);
    else if (e.key === 'Escape') closeMenu();
    else if (e.key.toLowerCase() === 'm') toggleMenu();
    else if (e.key.toLowerCase() === 'f') toggleFs();
  });

  // wheel — native scroll inside a slide first, then page to next slide
  const canScroll = (el, dir) => el && el.scrollHeight > el.clientHeight + 2 &&
    (dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2);
  let wheelLock = 0, wheelAcc = 0, wheelT;
  addEventListener('wheel', e => {
    if (document.body.classList.contains('menu-open')) return;
    const dy = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const sc = e.target.closest('.slide__scroll');
    if (canScroll(sc, Math.sign(e.deltaY))) return;
    e.preventDefault();
    const now = Date.now();
    if (busy || now < wheelLock) return;
    wheelAcc += dy; clearTimeout(wheelT); wheelT = setTimeout(() => wheelAcc = 0, 180);
    if (Math.abs(wheelAcc) > 40) {
      wheelAcc > 0 ? next() : prev();
      wheelAcc = 0; wheelLock = now + D * 1000 + 350;
    }
  }, { passive: false });

  // touch swipe — respects inner scroll edges
  let ts = null;
  addEventListener('touchstart', e => {
    if (e.target.closest('[data-noswipe], .menu, input')) { ts = null; return; }
    const t = e.touches[0], sc = e.target.closest('.slide__scroll');
    ts = { x: t.clientX, y: t.clientY, sc, down: !canScroll(sc, 1), up: !canScroll(sc, -1), t: Date.now() };
  }, { passive: true });
  addEventListener('touchend', e => {
    if (!ts) return;
    const t = e.changedTouches[0], dx = ts.x - t.clientX, dy = ts.y - t.clientY;
    const sc = ts.sc;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.2) {
      if (dy > 0 && ts.down && !canScroll(sc, 1)) next();
      else if (dy < 0 && ts.up && !canScroll(sc, -1)) prev();
    }
    ts = null;
  }, { passive: true });

  /* ---------------- menu / fullscreen / lang ---------------- */
  function toggleMenu() { document.body.classList.toggle('menu-open'); }
  function closeMenu() { document.body.classList.remove('menu-open'); }
  $('#menuBtn').onclick = toggleMenu;
  function toggleFs() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }
  $('#fsBtn').onclick = toggleFs;
  $$('[data-lang]').forEach(b => b.onclick = () => setLang(b.dataset.lang));

  /* ---------------- hero day / night ---------------- */
  $('#dayNight').onclick = () => $('.s-hero').classList.toggle('is-day');

  /* ---------------- needs (client profile) ---------------- */
  const profile = { needs: new Set(), pay: null };
  $$('.need').forEach(b => b.onclick = () => {
    const k = b.dataset.need;
    profile.needs.has(k) ? profile.needs.delete(k) : profile.needs.add(k);
    b.classList.toggle('is-on', profile.needs.has(k));
    gsap.fromTo(b, { scale: .97 }, { scale: 1, duration: .6, ease: 'elastic.out(1,.5)' });
    updateProfile();
  });
  $$('#payMode button').forEach(b => b.onclick = () => {
    profile.pay = b.dataset.pay;
    $$('#payMode button').forEach(x => x.classList.toggle('is-on', x === b));
    const pre = $('#cPre');
    pre.value = profile.pay === 'full' ? 100 : Math.max(FLOORS[+$('#cFloor').value][2], Math.min(+pre.value, 70));
    calc(); updateProfile();
  });
  function updateProfile() {
    const n = profile.needs.size + (profile.pay ? 1 : 0);
    const chip = $('#profileChip');
    chip.hidden = n === 0;
    const parts = [];
    if (profile.needs.size) parts.push(T[lang].needs(profile.needs.size));
    if (profile.pay) parts.push(profile.pay === 'full' ? T[lang].fullS : T[lang].inst);
    $('#profileTxt').textContent = parts.join(' · ');
  }
  function highlightApt() {
    const apts = $$('.apt');
    let k = 2;
    if (profile.needs.has('invest') && !profile.needs.has('family')) k = 0;
    apts.forEach((a, i) => a.classList.toggle('apt--hl', i === k));
  }

  /* ---------------- location: list ↔ radar ---------------- */
  $$('.places li').forEach(li => {
    const dot = $(`.pt[data-dot="${li.dataset.dot}"]`);
    li.onmouseenter = () => { li.classList.add('is-hl'); dot?.classList.add('is-hl'); };
    li.onmouseleave = () => { li.classList.remove('is-hl'); dot?.classList.remove('is-hl'); };
  });

  /* ---------------- tower + calculator ---------------- */
  const tower = $('#tower');
  tower.innerHTML = Object.keys(FLOORS).map(Number).sort((a, b) => b - a).map(f => {
    const [usd, , min] = FLOORS[f];
    const w = (0.45 + (usd - 570) / 110 * 0.55).toFixed(3);
    return `<button class="fl" data-floor="${f}"><span class="fl__n">${f}</span><span class="fl__bar"><i style="--w:${w}"></i><u>${min}%</u></span><span class="fl__p">$${usd}</span></button>`;
  }).join('');
  $$('.fl', tower).forEach(b => b.onclick = () => { $('#cFloor').value = b.dataset.floor; calc(); });

  let lastCalc = null;
  function setFill(inp) {
    const p = (inp.value - inp.min) / (inp.max - inp.min) * 100;
    inp.style.setProperty('--p', p + '%');
  }
  function tween(el, val, prefix = '$') {
    const o = { v: +el.dataset.v || 0 };
    el.dataset.v = val;
    gsap.to(o, { v: val, duration: .6, ease: 'power3.out', overwrite: true, onUpdate: () => el.textContent = prefix + fmt(o.v) });
  }
  function calc() {
    const fI = $('#cFloor'), aI = $('#cArea'), pI = $('#cPre');
    const floor = +fI.value, area = +aI.value;
    const [usd, som, min] = FLOORS[floor];
    pI.min = min;
    if (+pI.value < min) pI.value = min;
    const pre = +pI.value;
    const term = +($('#cTerm .is-on')?.dataset.term || 12);
    const total = usd * area, totalS = som * area;
    const preAmt = total * pre / 100, month = pre >= 100 ? 0 : (total - preAmt) / term;

    $('#cFloorV').textContent = floor;
    $('#cAreaV').textContent = area;
    $('#cPreV').textContent = pre;
    $('#cPreHint').textContent = pre >= 100 ? T[lang].full : T[lang].minPre(min);
    $('#termRow').classList.toggle('is-off', pre >= 100);
    [fI, aI, pI].forEach(setFill);
    $$('.fl', tower).forEach(b => b.classList.toggle('is-on', +b.dataset.floor === floor));

    tween($('#rTotal'), total);
    $('#rTotalS').textContent = `${fmt(totalS)} ${T[lang].som}`;
    tween($('#rM2'), usd);
    tween($('#rPre'), preAmt);
    tween($('#rMonth'), month);

    lastCalc = { floor, area, total, pre, term, month };
    $('#summaryV').innerHTML = T[lang].sum(lastCalc);
    $('#waBtn').href = 'https://wa.me/992000777761?text=' + encodeURIComponent(T[lang].wa(lastCalc));
  }
  ['#cFloor', '#cArea', '#cPre'].forEach(s => $(s).addEventListener('input', calc));
  $$('#cTerm button').forEach(b => b.onclick = () => { $$('#cTerm button').forEach(x => x.classList.toggle('is-on', x === b)); calc(); });

  /* ---------------- gallery drag ---------------- */
  (() => {
    const gal = $('#gallery'), track = $('#galTrack'), items = $$('.gal', track);
    let x = 0, minX = 0;
    const setX = gsap.quickSetter(track, 'x', 'px');
    const bounds = () => { minX = Math.min(0, gal.clientWidth - track.scrollWidth); };
    const parallax = () => {
      if (MOBILE) return;
      const gw = gal.getBoundingClientRect();
      items.forEach(it => {
        const r = it.getBoundingClientRect();
        const p = ((r.left + r.width / 2) - (gw.left + gw.width / 2)) / gw.width;
        it.querySelector('img').style.transform = `translateX(${(-p * 6).toFixed(2)}%)`;
      });
    };
    let tw;
    const moveTo = v => {
      bounds();
      v = Math.max(minX, Math.min(0, v));
      const o = { v: x };
      tw?.kill();
      tw = gsap.to(o, { v, duration: 1, ease: 'expo.out', onUpdate: () => { x = o.v; setX(x); parallax(); } });
    };
    let down = false, sx = 0, sy = 0, ox = 0, vx = 0, lx = 0, lt = 0, axis = null;
    gal.addEventListener('pointerdown', e => {
      down = true; axis = null; sx = lx = e.clientX; sy = e.clientY; ox = x; vx = 0; lt = performance.now();
      bounds(); tw?.kill(); gal.classList.add('is-drag');
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis !== 'x') return;
      const now = performance.now();
      vx = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now;
      let v = ox + dx;
      if (v > 0) v *= .35; if (v < minX) v = minX + (v - minX) * .35;
      x = v; setX(x); parallax();
    });
    const up = () => { if (!down) return; down = false; gal.classList.remove('is-drag'); moveTo(x + vx * 320); };
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
    $$('[data-gal]').forEach(b => b.onclick = () => moveTo(x - +b.dataset.gal * (items[0].offsetWidth + 18)));
    addEventListener('resize', () => moveTo(x));
  })();

  /* ---------------- mouse parallax + cursor (desktop only) ---------------- */
  if (!MOBILE && !REDUCED) {
    const pxs = new Map();
    addEventListener('mousemove', e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      const bg = $('.bg[data-parallax]', slides[cur]);
      if (bg && !busy) {
        if (!pxs.has(bg)) pxs.set(bg, [gsap.quickTo(bg, 'x', { duration: 1.4, ease: 'power3' }), gsap.quickTo(bg, 'y', { duration: 1.4, ease: 'power3' })]);
        const [qx, qy] = pxs.get(bg); qx(-nx * 22); qy(-ny * 14);
      }
    });
    const cur$ = $('#cursor');
    const cx = gsap.quickTo(cur$, 'x', { duration: .45, ease: 'power3' }), cy = gsap.quickTo(cur$, 'y', { duration: .45, ease: 'power3' });
    addEventListener('mousemove', e => { cx(e.clientX); cy(e.clientY); cur$.classList.add('is-on'); });
    document.addEventListener('mouseleave', () => cur$.classList.remove('is-on'));
    document.addEventListener('mouseover', e => cur$.classList.toggle('is-hover', !!e.target.closest('button, a, .need, .tile, .gal, .fl, input')));
  }

  /* ---------------- boot ---------------- */
  let start = Math.max(0, Math.min(N - 1, (parseInt(location.hash.slice(1), 10) || 1) - 1));
  try { const l = localStorage.getItem('yb-lang'); if (l === 'ru') setLang('ru'); } catch (e) {}
  cur = start;
  slides.forEach(s => hideContent(s));
  slides[cur].classList.add('is-active');
  loadSlide(cur); loadSlide(cur + 1); loadSlide(cur - 1);
  buildRail(); buildMenu(); updateChrome(); calc();
  window.YBMap?.setVisible(slides[cur].classList.contains('s-loc'));

  // preload: wait for the current slide's images (max 6s)
  const imgs = $$('img', slides[cur]).filter(i => i.src);
  let done = 0;
  const bar = $('#loaderBar'), pct = $('#loaderPct');
  const tick = () => { done++; const p = Math.round(done / Math.max(1, imgs.length) * 100); bar.style.width = p + '%'; pct.textContent = p; };
  const ready = Promise.all(imgs.map(i => i.complete ? (tick(), 0) : new Promise(r => { i.onload = i.onerror = () => { tick(); r(); }; })));
  const minTime = new Promise(r => setTimeout(r, REDUCED ? 0 : 1400));
  Promise.race([Promise.all([ready, minTime, document.fonts?.ready]), new Promise(r => setTimeout(r, 6000))]).then(() => {
    bar.style.width = '100%'; pct.textContent = '100';
    const s = slides[cur];
    gsap.timeline()
      .to('#loader', { yPercent: -100, duration: 1.1, ease: 'expo.inOut', delay: .15 })
      .set('#loader', { display: 'none' })
      .fromTo($('.bg', s), { scale: 1.25 }, { scale: 1, duration: 2.2, ease: 'expo.out' }, .35)
      .from('.top, .bottom, .rail', { opacity: 0, y: (i) => i === 0 ? -20 : 20, duration: 1, ease: 'expo.out', stagger: .08 }, .8)
      .add(() => { s.classList.add('is-in'); reveal(s); }, .6);
    // warm the rest of the deck in the background once idle
    const idle = window.requestIdleCallback || (f => setTimeout(f, 1500));
    idle(() => slides.forEach((_, i) => setTimeout(() => loadSlide(i), i * (MOBILE ? 700 : 250))));
  });
})();
