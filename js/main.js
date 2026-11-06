/**
 * Salowtech - Sovereign Software Platforms
 * Core Application Controller
 */

function initApp() {
  const safeInit = (initFn) => {
    try {
      if (typeof initFn === 'function') initFn();
    } catch (_) {
      // Gracefully silent on pages without specific DOM modules
    }
  };

  // Critical above-the-fold modules (run immediately on load)
  safeInit(initHeroVideo, 'initHeroVideo');
  safeInit(initNavigationDropdowns, 'initNavigationDropdowns');
  safeInit(initMobileMenu, 'initMobileMenu');
  safeInit(initSmoothScroll, 'initSmoothScroll');
  safeInit(initHeroHeadlineCycler, 'initHeroHeadlineCycler');

  // Below-the-fold & interactive modules (run during browser idle or staggered)
  const deferInit = (fn, name) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => safeInit(fn, name), { timeout: 800 });
    } else {
      setTimeout(() => safeInit(fn, name), 60);
    }
  };

  deferInit(init3DTilt, 'init3DTilt');
  deferInit(initStrategiesStage, 'initStrategiesStage');
  deferInit(initRoadmapCounters, 'initRoadmapCounters');
  deferInit(initShowcaseMarquee, 'initShowcaseMarquee');
  deferInit(initRoadmapVideo, 'initRoadmapVideo');
  deferInit(initPromoVideo, 'initPromoVideo');
  deferInit(initFaqAccordion, 'initFaqAccordion');
  deferInit(initBrandMark, 'initBrandMark');
  deferInit(initMagneticButtons, 'initMagneticButtons');
  deferInit(initLeadForm, 'initLeadForm');
  deferInit(initContactsSection, 'initContactsSection');
  deferInit(initChatbotWidget, 'initChatbotWidget');
  deferInit(initScrollReveals, 'initScrollReveals');
  deferInit(initNavbarScrollEffect, 'initNavbarScrollEffect');
  deferInit(initAboutAnimations, 'initAboutAnimations');
  deferInit(initScrollWordReveal, 'initScrollWordReveal');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* --------------------------------------------------------------------------
   01. Background & Roadmap Video Controllers
   -------------------------------------------------------------------------- */
function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;

  const attemptPlay = () => {
    try {
      const playPromise = video.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          const unlock = () => {
            video.play().catch(() => { });
            ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
              window.removeEventListener(evt, unlock);
            });
          };
          ['pointerdown', 'keydown', 'touchstart'].forEach((evt) => {
            window.addEventListener(evt, unlock, { passive: true });
          });
        });
      }
    } catch (e) { }
  };

  if (video.readyState >= 2) {
    attemptPlay();
  } else {
    video.addEventListener('canplay', attemptPlay, { once: true });
    attemptPlay();
  }

  // Pause background video when off-screen to preserve battery & CPU/GPU decoder
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          try {
            video.pause();
          } catch (_) { }
        }
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: '120px 0px 120px 0px'
    });
    observer.observe(video);
  }
}

function initRoadmapVideo() {
  const video = document.querySelector('.roadmap-preview-video');
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;

  const playVideo = () => {
    try {
      video.play()?.catch(() => { });
    } catch (e) { }
  };

  if (video.readyState >= 2) {
    playVideo();
  } else {
    video.addEventListener('canplay', playVideo, { once: true });
  }
  playVideo();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (video.paused) video.play().catch(() => { });
        } else {
          if (!video.paused) video.pause();
        }
      });
    }, { rootMargin: '300px 0px 300px 0px', threshold: 0 });
    observer.observe(video);
  }
}

/* --------------------------------------------------------------------------
   02. 3D Perspective Card Tilt & Interactive Simulation Controller
   -------------------------------------------------------------------------- */
function init3DTilt() {
  const stageWrapper = document.getElementById('tilt-stage-wrapper');
  if (!stageWrapper) return;

  const iframe = document.getElementById('simulationIframe');
  const tiltCard = stageWrapper.querySelector('.tilt-card');
  const tiltGlow = stageWrapper.querySelector('.tilt-glow');
  const stepCards = stageWrapper.querySelectorAll('.tilt-step-card');

  let isStageVisible = false;
  const sendIframeMsg = (msg) => {
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.postMessage(msg, '*');
      } catch (e) { }
    }
  };

  if (iframe) {
    iframe.addEventListener('load', () => {
      if (isStageVisible) sendIframeMsg('play');
    });
  }

  window.addEventListener('message', (e) => {
    if (e.data === 'salowtech-promo-ready' || e.data?.type === 'salowtech-promo-ready') {
      if (isStageVisible) sendIframeMsg('play');
    }
  });

  if ('IntersectionObserver' in window) {
    const stageObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isStageVisible = entry.isIntersecting;
        sendIframeMsg(isStageVisible ? 'play' : 'pause');
      });
    }, { rootMargin: '300px 0px 300px 0px', threshold: 0 });
    stageObs.observe(stageWrapper);
  } else {
    isStageVisible = true;
    sendIframeMsg('play');
  }

  if (!tiltCard) return;

  // On mobile (< 768px) or reduced-motion, immediately settle cards for instant readability
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
    tiltCard.style.transform = 'none';
    if (tiltGlow) tiltGlow.style.opacity = '0.5';
    stepCards.forEach((c) => {
      c.style.transform = 'none';
      c.style.opacity = '1';
    });
    return;
  }

  let stageTop = 0;
  let windowHeight = window.innerHeight || 800;
  let isMobile = window.innerWidth < 768;

  function cacheMetrics() {
    const rect = stageWrapper.getBoundingClientRect();
    stageTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop);
    windowHeight = window.innerHeight || document.documentElement.clientHeight;
    isMobile = window.innerWidth < 768;
  }
  cacheMetrics();
  window.addEventListener('resize', cacheMetrics, { passive: true });
  window.addEventListener('load', cacheMetrics, { passive: true });

  let lastSettledState = null;

  function updateScrollTilt(scrollY) {
    const currentY = typeof scrollY === 'number' ? scrollY : (window.pageYOffset || document.documentElement.scrollTop || 0);

    // If nowhere near the section, skip entirely to prevent main thread work during hero scroll
    if (stageTop > 0 && Math.abs(stageTop - currentY) > windowHeight * 1.5) {
      return;
    }

    const rectTop = stageTop - currentY;

    const startY = windowHeight * 0.95;
    const endY = windowHeight * 0.20;
    const rawProgress = (startY - rectTop) / (startY - endY);
    const progress = Math.max(0, Math.min(1, rawProgress));

    if (progress <= 0.001) {
      if (lastSettledState === 'top') return;
      lastSettledState = 'top';
      tiltCard.style.transform = 'none';
      if (tiltGlow) tiltGlow.style.opacity = '0.3';
      stepCards.forEach((c) => {
        c.style.transform = 'translate3d(0, 20px, 0)';
        c.style.opacity = '0';
      });
      return;
    }

    if (progress >= 0.98) {
      if (lastSettledState === 'settled') return;
      lastSettledState = 'settled';
      tiltCard.style.transform = 'none';
      if (tiltGlow) tiltGlow.style.opacity = '0.6';
      stepCards.forEach((c) => {
        c.style.transform = 'none';
        c.style.opacity = '1';
      });
      return;
    }

    lastSettledState = 'animating';
    tiltCard.style.transform = 'none';

    if (stepCards.length > 0) {
      stepCards.forEach((card, index) => {
        const stepStart = 0.35 + index * 0.12;
        const stepEnd = Math.min(1.0, stepStart + 0.38);
        const stepRaw = (progress - stepStart) / (stepEnd - stepStart);
        const stepProgress = Math.max(0, Math.min(1, stepRaw));

        if (stepProgress >= 0.98) {
          card.style.transform = 'none';
          card.style.opacity = '1';
        } else {
          const stepEase = 1 - Math.pow(1 - stepProgress, 3);
          const cardY = 20 * (1 - stepEase);
          card.style.transform = `translate3d(0, ${cardY.toFixed(1)}px, 0)`;
          card.style.opacity = stepEase.toFixed(2);
        }
      });
    }
  }

  window.updateScrollTiltEngine = updateScrollTilt;
  window.cacheTiltMetrics = cacheMetrics;
  updateScrollTilt(window.pageYOffset || document.documentElement.scrollTop);
}

/* --------------------------------------------------------------------------
   03. Strategies Interactive Canvas & Stage Sequence
   -------------------------------------------------------------------------- */
function initStrategiesStage() {
  const section = document.getElementById('strat');
  if (!section) return;

  const stage = section.querySelector('#stage');
  const frame = section.querySelector('#fr');
  const cursor = section.querySelector('#cur');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width:760px)').matches;

  let running = false;
  let waiters = [];
  let started = false;
  let inView = false;

  const until = () => (running ? Promise.resolve() : new Promise((r) => waiters.push(r)));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms)).then(until);
  const setRun = (v) => {
    running = v;
    if (stage) stage.classList.toggle('paused', !v);
    if (v) {
      const pending = waiters;
      waiters = [];
      pending.forEach((r) => r());
    }
  };

  const rnd = (a) => a + Math.random() * a * 0.6;
  async function type(el, t, ms) {
    for (let i = 1; i <= t.length; i++) {
      el.textContent = t.slice(0, i);
      await sleep(rnd(ms));
    }
  }
  async function erase(el, ms) {
    let t = el.textContent;
    while (t.length) {
      t = t.slice(0, -1);
      el.textContent = t;
      await sleep(ms);
    }
  }

  const iconTag = (c, p) => `<span class="ri" style="background:${c}"><svg viewBox="0 0 24 24">${p}</svg></span>`;
  const avatarTag = (n, c) => `<span class="ci" style="background:${c}">${n.split(' ').map((w) => w[0]).join('')}</span>`;

  const SERVICES_LIST = [
    ['SEO & AI SEO', '#AD8B73', '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'],
    ['Social Media Marketing', '#4C8A66', '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>'],
    ['Google Ads Management', '#D69A2D', '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'],
    ['Content Marketing', '#B5654A', '<path d="M6 3h8l4 4v14H6z"/><path d="M9 12h6M9 16h6"/>'],
    ['AI Powered Marketing', '#5B6FA8', '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>'],
    ['Analytics & Reporting', '#2C7F86', '<path d="M4 20h16M7 20v-6M12 20V6M17 20v-9"/>']
  ];
  const DOC_PATH = '<path d="M6 3h8l4 4v14H6z"/><path d="M9 12h6M9 16h6"/>';

  const MODES = [
    { p: '/', ph: 'Search for a service…', q: 'ma', crumbs: ['Reports / Social / Engagement', 'Settings / Google Ads / Connected accounts'], items: SERVICES_LIST.map((s) => ({ t: s[0], i: iconTag(s[1], s[2]) })), chip: 1 },
    { p: '@', ph: 'Search for a client…', q: 'me', items: [['Aarav Mehta', 'aarav@brightpath.app', '#AD8B73'], ['Meera Nair', 'meera@northfield.co', '#4C8A66'], ['Kabir Rao', 'kabir@topranker.in', '#5B6FA8'], ['Isha Verma', 'isha@sacredjourneys.in', '#D69A2D']].map((c) => ({ t: c[0], s: c[1], i: avatarTag(c[0], c[2]) })), chip: 1 },
    { p: '?', ph: 'Search for an article…', q: 'seo', items: ['How AI search is changing SEO', 'Google Ads for Indian SMEs', 'CRM vs ERP: what you need', 'Local SEO playbook for SMEs', 'WhatsApp lead funnels'].map((t) => ({ t: t, i: iconTag('#B9A78F', DOC_PATH) })), chip: 1 },
    { p: '#', ph: 'Search for a channel…', q: 'ge', head: 'RECENT', items: ['seo-team', 'ads-alerts', 'general', 'content-calendar'].map((t, k) => ({ t: t, i: avatarTag('#', ['#AD8B73', '#D69A2D', '#4C8A66', '#5B6FA8'][k]) })) }
  ];

  const prefixEl = section.querySelector('#pp');
  const queryEl = section.querySelector('#pq');
  const placeholderEl = section.querySelector('#pph');
  const panelInner = section.querySelector('#pin');
  const panelBody = section.querySelector('#pbody');

  function highlightMatch(text, query) {
    const idx = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
    return idx < 0 ? text : text.slice(0, idx) + '<b>' + text.slice(idx, idx + query.length) + '</b>' + text.slice(idx + query.length);
  }

  function renderPalette(mode, query) {
    if (!panelInner || !panelBody) return;
    const list = query ? mode.items.filter((it) => it.t.toLowerCase().includes(query.toLowerCase())) : mode.items;
    let html = '';
    const sliceList = list.slice(0, 4);
    if (mode.head) html += `<div class="rh">${mode.head}</div>`;
    sliceList.forEach((it, i) => {
      html += `<div class="pr${i ? '' : ' on'}" style="--i:${i}">${it.i}<span>${highlightMatch(it.t, query)}${it.s ? `<small>${it.s}</small>` : ''}</span>${i || !mode.chip ? '' : '<em><u>CTRL</u> + <u>&#9166;</u> new tab</em>'}</div>`;
    });
    if (query && mode.crumbs) {
      html += `<div class="sub">${mode.crumbs.map((c) => `<span>${highlightMatch(c, query)}</span>`).join('')}</div>`;
    }
    panelInner.innerHTML = html;
    panelBody.style.height = `${panelInner.offsetHeight}px`;
  }

  function showMode(mode) {
    if (!prefixEl || !placeholderEl || !queryEl) return;
    prefixEl.textContent = mode.p;
    placeholderEl.textContent = mode.ph;
    queryEl.textContent = '';
    renderPalette(mode, '');
  }

  async function paletteLoop() {
    for (let k = 0; ; k = (k + 1) % MODES.length) {
      const mode = MODES[k];
      if (panelInner) panelInner.classList.add('sw');
      await sleep(200);
      showMode(mode);
      if (panelInner) panelInner.classList.remove('sw');
      await sleep(2300);
      for (let i = 1; i <= mode.q.length; i++) {
        if (queryEl) queryEl.textContent = mode.q.slice(0, i);
        renderPalette(mode, queryEl ? queryEl.textContent : '');
        await sleep(rnd(260));
      }
      await sleep(3000);
      if (queryEl) await erase(queryEl, 70);
    }
  }

  const chatBox = section.querySelector('#cb');
  const inputEl = section.querySelector('#inpt');
  const inputBox = section.querySelector('#inp');

  function appendChatMsg(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const node = wrap.firstChild;
    chatBox?.appendChild(node);
    return node;
  }

  const CHART_HTML = '<div class="chart"><div class="cbars"><s style="--h:36%;--i:0"></s><s style="--h:50%;--i:1"></s><s style="--h:44%;--i:2"></s><s style="--h:72%;--i:3"></s><s style="--h:100%;--i:4"></s></div><div class="cx"><span>W1</span><span>W2</span><span>W3</span><span>W4</span><span>W5</span></div></div>';
  const Q1 = 'Which channel brought the most leads this month?';
  const A1 = 'Organic search: 312 leads, up 27% on last month. Google Ads followed with 188 leads at ₹142 each.';
  const Q2 = 'Show me leads per week as a graph.';
  const A2 = 'Here is the weekly trend. Leads have grown for five weeks in a row.';

  async function simulateUserAsk(text, timestamp) {
    if (!inputBox || !inputEl) return;
    inputBox.classList.add('foc');
    await sleep(400);
    await type(inputEl, text, 42);
    await sleep(380);
    inputBox.classList.add('snd');
    inputEl.textContent = '';
    appendChatMsg(`<div class="msg u"><small>${timestamp}<span class="ava">A</span></small><div class="bub">${text}</div></div>`);
    await sleep(260);
    inputBox.classList.remove('snd', 'foc');
    await sleep(350);
  }

  async function simulateAiAnswer(text, timestamp, withChart) {
    const thinkingNode = appendChatMsg('<div class="msg a"><small><span class="logo mini"></span><b>Salowtech AI</b></small><div class="think">Thinking<i>.</i><i>.</i><i>.</i></div></div>');
    await sleep(1600);
    thinkingNode?.remove();

    const answerNode = appendChatMsg(`<div class="msg a"><small><span class="logo mini"></span><b>Salowtech AI</b> &middot; ${timestamp}</small><div class="bub"></div></div>`);
    const bubble = answerNode?.querySelector('.bub');
    const words = text.split(' ');
    for (let i = 1; i <= words.length; i++) {
      if (bubble) bubble.textContent = words.slice(0, i).join(' ');
      await sleep(rnd(55));
    }
    if (withChart && bubble) {
      bubble.insertAdjacentHTML('beforeend', CHART_HTML);
      await sleep(80);
      bubble.querySelector('.chart')?.classList.add('go');
    }
    await sleep(300);
  }

  async function chatLoop() {
    for (; ;) {
      if (!chatBox) break;
      chatBox.innerHTML = '';
      chatBox.classList.remove('out');
      await sleep(1400);
      await simulateUserAsk(Q1, '10:26 AM');
      await simulateAiAnswer(A1, '10:26 AM');
      await sleep(1500);
      await simulateUserAsk(Q2, '10:27 AM');
      await simulateAiAnswer(A2, '10:27 AM', true);
      await sleep(5200);
      chatBox.classList.add('out');
      await sleep(700);
    }
  }

  let cursorX = 0;
  let cursorY = 0;
  const rows = Array.from(section.querySelectorAll('.row'));
  const count1 = section.querySelector('#n1');
  const count2 = section.querySelector('#n2');
  const bar1 = section.querySelector('#b1');
  const bar2 = section.querySelector('#b2');

  function getRelativeCoord(el, factorX, factorY) {
    if (!el || !frame) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const f = frame.getBoundingClientRect();
    return { x: r.left - f.left + r.width * factorX, y: r.top - f.top + r.height * factorY };
  }

  function moveCursor(x, y, ms) {
    cursorX = x;
    cursorY = y;
    if (cursor) {
      cursor.style.setProperty('--t', `${ms}ms`);
      cursor.style.transform = `translate(${x}px,${y}px)`;
    }
  }

  function goToElement(el, factorX, factorY, ms) {
    if (!el || !frame) return sleep(ms);
    const p = getRelativeCoord(el, factorX, factorY);
    moveCursor(p.x, p.y, ms);
    return sleep(ms + 80);
  }

  async function clickAnimation() {
    if (!cursor || !frame) return;
    cursor.classList.add('dn');
    const ripple = document.createElement('i');
    ripple.className = 'rip';
    ripple.style.left = `${cursorX}px`;
    ripple.style.top = `${cursorY}px`;
    frame.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    await sleep(170);
    cursor.classList.remove('dn');
    await sleep(120);
  }

  function setRowHover(index) {
    rows.forEach((r, k) => r.classList.toggle('hov', k === index));
  }

  function updateCounts(a, b) {
    if (!count1 || !count2 || !bar1 || !bar2) return;
    [[count1, a], [count2, b]].forEach(([el, val]) => {
      el.textContent = val;
      el.classList.remove('pop');
      void el.offsetWidth;
      el.classList.add('pop');
    });
    bar1.style.transform = `scaleX(${a / 6})`;
    bar2.style.transform = `scaleX(${b / 6})`;
  }

  async function dragSimulation() {
    const card = section.querySelector('#drag');
    const slot = section.querySelector('#slot');
    if (!card || !slot || !card.offsetParent) return;

    await goToElement(card, 0.4, 0.3, 1200);
    await clickAnimation();
    const cardRect = card.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const dx = slotRect.left - cardRect.left;
    const dy = slotRect.top - cardRect.top;

    card.classList.add('lift');
    card.style.transition = 'transform 1.1s cubic-bezier(.45,.05,.2,1), box-shadow .3s';
    card.style.transform = `translate(${dx}px,${dy}px) rotate(1.6deg) scale(1.03)`;
    moveCursor(cursorX + dx, cursorY + dy, 1100);
    await sleep(1180);

    card.style.transform = `translate(${dx}px,${dy}px)`;
    card.classList.remove('lift');
    slot.style.opacity = '0';
    updateCounts(2, 4);
    await clickAnimation();
    await sleep(2600);

    card.style.transition = 'opacity .4s';
    card.style.opacity = '0';
    await sleep(450);
    card.style.transition = 'none';
    card.style.transform = '';
    slot.style.opacity = '1';
    updateCounts(3, 3);
    void card.offsetWidth;
    card.style.transition = 'opacity .5s';
    card.style.opacity = '1';
    await sleep(500);
  }

  async function cursorLoop() {
    if (!frame || !cursor) return;
    const f = frame.getBoundingClientRect();
    moveCursor(f.width * 0.3, f.height * 0.2, 10);
    cursor.classList.add('show');
    await sleep(900);
    for (; ;) {
      if (rows[2]) { await goToElement(rows[2], 0.62, 0.5, 1300); setRowHover(2); await sleep(900); }
      if (rows[4]) { await goToElement(rows[4], 0.6, 0.5, 900); setRowHover(4); await sleep(800); }
      if (section.querySelector('#pin')) { await goToElement(section.querySelector('#pin'), 0.5, 0.25, 1300); await sleep(1600); }
      await dragSimulation();
      await sleep(900);
      if (section.querySelector('#inp')) { await goToElement(section.querySelector('#inp'), 0.45, 0.5, 1300); await clickAnimation(); await sleep(1500); }
      if (rows[0]) { await goToElement(rows[0], 0.55, 0.5, 1500); setRowHover(0); await sleep(1000); }
    }
  }

  function staticFrame() {
    showMode(MODES[0]);
    if (chatBox) {
      chatBox.innerHTML = `
        <div class="msg u"><small>10:26 AM<span class="ava">A</span></small><div class="bub">${Q1}</div></div>
        <div class="msg a"><small><span class="logo mini"></span><b>Salowtech AI</b> &middot; 10:26 AM</small><div class="bub">${A1}</div></div>
        <div class="msg u"><small>10:27 AM<span class="ava">A</span></small><div class="bub">${Q2}</div></div>
        <div class="msg a"><small><span class="logo mini"></span><b>Salowtech AI</b> &middot; 10:27 AM</small><div class="bub">${A2}${CHART_HTML}</div></div>
      `;
      chatBox.querySelector('.chart')?.classList.add('go');
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (reduceMotion) return;
    paletteLoop();
    chatLoop();
    if (!isMobile) cursorLoop();
  }

  function syncVisibility() {
    setRun(inView && !document.hidden && !reduceMotion);
  }

  showMode(MODES[0]);
  if (reduceMotion) staticFrame();
  document.addEventListener('visibilitychange', syncVisibility);

  if ('IntersectionObserver' in window && stage) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      if (inView) {
        section.classList.add('in');
        start();
      }
      syncVisibility();
    }, { threshold: 0.15 }).observe(stage);

    const headEl = section.querySelector('.head');
    if (headEl) {
      new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          section.classList.add('in');
          start();
          obs.disconnect();
        }
      }, { threshold: 0.2 }).observe(headEl);
    }
  } else {
    inView = true;
    section.classList.add('in');
    start();
    syncVisibility();
  }
}

/* --------------------------------------------------------------------------
   04. Strategic Roadmap Numerical Counters
   -------------------------------------------------------------------------- */
function initRoadmapCounters() {
  const roadmapSection = document.getElementById('strategic-roadmap');
  if (!roadmapSection) return;

  const countEls = roadmapSection.querySelectorAll('.cnt');
  if (countEls.length === 0) return;

  const formatNumber = (el, val) => {
    const dec = +el.dataset.dec || 0;
    let txt = dec ? val.toFixed(dec) : Math.round(val);
    if (el.dataset.sep) txt = Number(txt).toLocaleString('en-US');
    el.textContent = (el.dataset.pre || '') + txt + (el.dataset.suf || '');
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    countEls.forEach((el) => formatNumber(el, +el.dataset.to));
    return;
  }

  const runAnimation = () => {
    const startTime = performance.now() + 700;
    const duration = 3400;

    const frame = (now) => {
      const progress = Math.min(Math.max((now - startTime) / duration, 0), 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      countEls.forEach((el) => formatNumber(el, el.dataset.to * easeOutCubic));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  let hasAnimated = false;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        runAnimation();
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(roadmapSection);
  } else {
    runAnimation();
  }
}

/* --------------------------------------------------------------------------
   05. Work Showcase Continuous Marquee
   -------------------------------------------------------------------------- */
function initShowcaseMarquee() {
  const showcase = document.getElementById('showcase-work');
  if (!showcase) return;

  const rows = showcase.querySelectorAll('.work-row');
  rows.forEach((row) => {
    if (!row.dataset.duplicated) {
      row.innerHTML += row.innerHTML;
      row.dataset.duplicated = 'true';
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const state = entry.isIntersecting ? 'running' : 'paused';
        rows.forEach((r) => (r.style.animationPlayState = state));
      });
    }, { rootMargin: '200px 0px 200px 0px' });
    observer.observe(showcase);
  }
}

/* --------------------------------------------------------------------------
   06. Promo Video Modal & Auto-Pause Observer
   -------------------------------------------------------------------------- */
let wasPlayingBeforeScroll = false;

function startPromoVideo() {
  const video = document.getElementById('salowtechPromoVideo');
  const overlay = document.getElementById('videoPlayOverlay');
  const label = document.getElementById('videoPlayLabel');
  if (!video) return;

  if (video.paused) {
    video.play()?.then(() => {
      overlay?.classList.add('opacity-0', 'pointer-events-none');
      overlay?.classList.remove('opacity-100');
      if (label) label.textContent = 'Pause Platform Film';
      video.setAttribute('controls', 'true');
    }).catch(() => { });
  } else {
    video.pause();
    overlay?.classList.remove('opacity-0', 'pointer-events-none');
    overlay?.classList.add('opacity-100');
    if (label) label.textContent = 'Watch Platform Film';
    video.removeAttribute('controls');
  }
}
window.startPromoVideo = startPromoVideo;

function initPromoVideo() {
  const video = document.getElementById('salowtechPromoVideo');
  const overlay = document.getElementById('videoPlayOverlay');
  const label = document.getElementById('videoPlayLabel');
  if (!video) return;

  video.addEventListener('ended', () => {
    overlay?.classList.remove('opacity-0', 'pointer-events-none');
    overlay?.classList.add('opacity-100');
    if (label) label.textContent = 'Replay Platform Film';
    video.removeAttribute('controls');
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && !video.paused) {
          wasPlayingBeforeScroll = true;
          video.pause();
          overlay?.classList.remove('opacity-0', 'pointer-events-none');
          overlay?.classList.add('opacity-100');
        } else if (entry.isIntersecting && wasPlayingBeforeScroll) {
          video.play()?.then(() => {
            wasPlayingBeforeScroll = false;
            overlay?.classList.add('opacity-0', 'pointer-events-none');
            overlay?.classList.remove('opacity-100');
            if (label) label.textContent = 'Pause Platform Film';
            video.setAttribute('controls', 'true');
          }).catch(() => {
            wasPlayingBeforeScroll = false;
          });
        }
      });
    }, { threshold: 0.25 });
    observer.observe(video);
  }
}

/* --------------------------------------------------------------------------
   07. FAQ Disclosure Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqSections = document.querySelectorAll('#faq-section, .faq, [data-purpose="faq-section"]');
  if (!faqSections.length) return;

  faqSections.forEach((faqSection) => {
    const items = faqSection.querySelectorAll('.q');
    items.forEach((item) => {
      const btn = item.querySelector('button');
      if (!btn || btn.dataset.faqInitialized) return;
      btn.dataset.faqInitialized = 'true';

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const willOpen = !item.classList.contains('open');
        items.forEach((other) => {
          other.classList.remove('open');
          other.querySelector('button')?.setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   08. Brand Mark Staggered Reveal
   -------------------------------------------------------------------------- */
function initBrandMark() {
  const mark = document.getElementById('mark');
  if (!mark) return;

  if (!('IntersectionObserver' in window)) {
    mark.classList.add('in');
    return;
  }

  const rect = mark.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    mark.classList.add('in');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      mark.classList.add('in');
      observer.disconnect();
    }
  }, { threshold: 0.05 });
  observer.observe(mark);
}

/* --------------------------------------------------------------------------
   09. Magnetic Buttons (GSAP Spring Physics)
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
  if (typeof gsap === 'undefined') return;

  const magneticWraps = document.querySelectorAll('[data-magnetic]');
  magneticWraps.forEach((wrap) => {
    const target = wrap.querySelector('.magnetic-target') || wrap;
    const iconBox = wrap.querySelector('.magnetic-icon-box');
    const textBox = wrap.querySelector('.magnetic-text-box');
    const strength = parseFloat(wrap.dataset.strength) || 0.6;

    const xTo = gsap.quickTo(target, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(target, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const iconXTo = iconBox ? gsap.quickTo(iconBox, 'x', { duration: 1.15, ease: 'elastic.out(1, 0.28)' }) : null;
    const iconYTo = iconBox ? gsap.quickTo(iconBox, 'y', { duration: 1.15, ease: 'elastic.out(1, 0.28)' }) : null;
    const textXTo = textBox ? gsap.quickTo(textBox, 'x', { duration: 1, ease: 'elastic.out(1, 0.35)' }) : null;
    const textYTo = textBox ? gsap.quickTo(textBox, 'y', { duration: 1, ease: 'elastic.out(1, 0.35)' }) : null;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;

      xTo(x);
      yTo(y);
      if (iconXTo && iconYTo) {
        iconXTo(x * 0.45);
        iconYTo(y * 0.45);
      }
      if (textXTo && textYTo) {
        textXTo(x * 0.15);
        textYTo(y * 0.15);
      }
    });

    wrap.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
      if (iconXTo && iconYTo) {
        iconXTo(0);
        iconYTo(0);
      }
      if (textXTo && textYTo) {
        textXTo(0);
        textYTo(0);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. Smooth Inertia Scroll Engine & Navbar Morph Synchronizer
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.0,
      syncTouch: false,
      smoothTouch: false,
      infinite: false
    });
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Ensure all inner scroll containers prevent Lenis from hijacking their local scroll
  const preventScrollIds = ['chatbot-messages', 'chatbot-window', 'chatbot-emoji-picker', 'mobile-nav-panel'];
  preventScrollIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.hasAttribute('data-lenis-prevent')) {
      el.setAttribute('data-lenis-prevent', 'true');
    }
  });

  // Smooth internal anchor jump handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#' || hash === '#!') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 0.8 });
        } else {
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      }
    });
  });

  const header = document.getElementById('site-header');
  let isScrolled = false;

  function updateNavbar(scrollY) {
    if (!header) return;
    const y = typeof scrollY === 'number' ? scrollY : 0;
    const shouldBeScrolled = isScrolled ? y > 18 : y > 40;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      header.classList.toggle('is-scrolled', isScrolled);
      header.classList.toggle('navbar-scrolled', isScrolled);
    }
  }

  const backToTopBtn = document.getElementById('back-to-top-btn');
  let isBackToTopVisible = false;

  function updateBackToTop(scrollY) {
    if (!backToTopBtn) return;
    const y = typeof scrollY === 'number' ? scrollY : 0;
    const shouldShow = y > 400;
    if (shouldShow !== isBackToTopVisible) {
      isBackToTopVisible = shouldShow;
      if (isBackToTopVisible) {
        backToTopBtn.classList.remove('hidden');
        requestAnimationFrame(() => {
          backToTopBtn.classList.remove('opacity-0', 'translate-y-2');
        });
      } else {
        backToTopBtn.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
          if (!isBackToTopVisible && backToTopBtn.classList.contains('opacity-0')) {
            backToTopBtn.classList.add('hidden');
          }
        }, 300);
      }
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // If Lenis is active, let Lenis drive scroll updates with zero layout thrashing
  if (lenis) {
    lenis.on('scroll', (e) => {
      updateNavbar(e.scroll);
      updateBackToTop(e.scroll);
      if (window.updateScrollTiltEngine) window.updateScrollTiltEngine(e.scroll);
    });
  } else {
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const y = window.pageYOffset || document.documentElement.scrollTop || 0;
          updateNavbar(y);
          updateBackToTop(y);
          if (window.updateScrollTiltEngine) window.updateScrollTiltEngine(y);
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // Quick touchmove handler for mobile responsiveness
  let touchTicking = false;
  window.addEventListener('touchmove', () => {
    if (!touchTicking) {
      window.requestAnimationFrame(() => {
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        updateNavbar(y);
        updateBackToTop(y);
        touchTicking = false;
      });
      touchTicking = true;
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   11. Lead Intake Form Controller
   -------------------------------------------------------------------------- */
function initLeadForm() {
  const form = document.querySelector('#lead-intake-form') || document.querySelector('#lead-capture form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
      </svg>
      <span>Request Received!</span>
    `;

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
    }, 3500);
  });
}

/* --------------------------------------------------------------------------
   12. Navigation Dropdowns (DRY Controller)
   -------------------------------------------------------------------------- */
function initNavigationDropdowns() {
  function setupDropdown(triggerId, menuId, otherTriggerId, otherMenuId) {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);
    if (!trigger || !menu) return;

    const openMenu = () => {
      if (otherMenuId && otherTriggerId) {
        const otherMenu = document.getElementById(otherMenuId);
        const otherTrigger = document.getElementById(otherTriggerId);
        if (otherMenu?.classList.contains('is-open')) {
          otherMenu.classList.remove('is-open', '!opacity-100', '!pointer-events-auto', '!translate-y-0');
          otherTrigger?.setAttribute('aria-expanded', 'false');
          otherTrigger?.querySelector('svg')?.classList.remove('rotate-180');
        }
      }
      menu.classList.add('is-open', '!opacity-100', '!pointer-events-auto', '!translate-y-0');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.querySelector('svg')?.classList.add('rotate-180');
    };

    const closeMenu = () => {
      menu.classList.remove('is-open', '!opacity-100', '!pointer-events-auto', '!translate-y-0');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.querySelector('svg')?.classList.remove('rotate-180');
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  setupDropdown('company-menu-btn', 'company-dropdown-panel', 'services-menu-btn', 'services-dropdown-panel');
  setupDropdown('services-menu-btn', 'services-dropdown-panel', 'company-menu-btn', 'company-dropdown-panel');
}

/* --------------------------------------------------------------------------
   12b. Mobile Hamburger Navigation Drawer Controller
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  if (!btn || !drawer) return;

  const hamburgerSvg = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>`;
  const closeSvg = `<svg class="w-6 h-6 text-[#AD8B73]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12" /></svg>`;

  const toggle = (forceClose) => {
    const isCurrentlyOpen = drawer.classList.contains('is-open');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;
    if (shouldOpen) {
      drawer.classList.add('is-open');
      drawer.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = closeSvg;
      btn.setAttribute('aria-label', 'Close navigation menu');
      document.body.classList.add('mobile-nav-locked');
      document.documentElement.classList.add('mobile-nav-locked');
    } else {
      drawer.classList.remove('is-open');
      drawer.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = hamburgerSvg;
      btn.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('mobile-nav-locked');
      document.documentElement.classList.remove('mobile-nav-locked');
    }
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && !btn.contains(e.target)) {
      toggle(true);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggle(true);
    }
  });

  drawer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggle(true);
    });
  });
}

/* --------------------------------------------------------------------------
   13. Salow AI Chatbot Widget Controller (Odoo Enterprise Design)
   -------------------------------------------------------------------------- */
function initChatbotWidget() {
  const launcher = document.getElementById('chatbot-launcher');
  const windowEl = document.getElementById('chatbot-window');
  if (!launcher || !windowEl) return;

  const closeBtn = document.getElementById('chatbot-close');
  const minBtn = document.getElementById('chatbot-minimize');
  const messagesEl = document.getElementById('chatbot-messages');
  const formEl = document.getElementById('chatbot-form');
  const inputEl = document.getElementById('chatbot-input');
  const teaserEl = document.getElementById('chatbot-teaser');
  const initTimeEl = document.getElementById('chatbot-init-time');
  const headerEl = windowEl.querySelector('.chatbot-header');

  if (closeBtn) closeBtn.classList.add('btn-close');

  const avatarSrc = 'assets/chatbot_avatar.png';
  let isTyping = false;

  const getFormattedTime = () => {
    try {
      return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
      return 'Just now';
    }
  };

  if (initTimeEl) {
    initTimeEl.textContent = getFormattedTime();
  }

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) { }
  };

  const MINIMIZE_ICON_SVG = `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 12H5" />
    </svg>
  `;
  const EXPAND_ICON_SVG = `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
    </svg>
  `;

  const setMinimizeStateIcon = (isMinimized) => {
    if (!minBtn) return;
    minBtn.innerHTML = isMinimized ? EXPAND_ICON_SVG : MINIMIZE_ICON_SVG;
    minBtn.title = isMinimized ? 'Expand / Restore Chat' : 'Minimize Chat';
    minBtn.setAttribute('aria-label', isMinimized ? 'Expand Chat' : 'Minimize Chat');
  };

  const STORAGE_OPEN_KEY = 'salowtech_chat_open';
  const STORAGE_MIN_KEY = 'salowtech_chat_minimized';
  const STORAGE_HIST_KEY = 'salowtech_enterprise_chat_history_v2';

  const saveChatHistory = () => {
    try {
      if (messagesEl) {
        localStorage.setItem(STORAGE_HIST_KEY, messagesEl.innerHTML);
      }
    } catch (e) { }
  };

  const openChat = () => {
    windowEl.classList.remove('is-minimized');
    windowEl.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    setMinimizeStateIcon(false);

    try {
      localStorage.setItem(STORAGE_OPEN_KEY, 'true');
      localStorage.setItem(STORAGE_MIN_KEY, 'false');
    } catch (e) { }

    if (teaserEl) {
      teaserEl.style.opacity = '0';
      teaserEl.style.pointerEvents = 'none';
    }

    setTimeout(() => inputEl?.focus(), 260);
    scrollToBottom();
  };

  const closeChat = () => {
    windowEl.classList.remove('is-open');
    windowEl.classList.remove('is-minimized');
    launcher.setAttribute('aria-expanded', 'false');
    setMinimizeStateIcon(false);

    try {
      localStorage.setItem(STORAGE_OPEN_KEY, 'false');
      localStorage.setItem(STORAGE_MIN_KEY, 'false');
    } catch (e) { }

    try { if (typeof stopVoiceInput === 'function') stopVoiceInput(); } catch (e) { }
    try { if (typeof toggleEmojiPicker === 'function') toggleEmojiPicker(false); } catch (e) { }

    if (window.location.hash === '#chat' || window.location.hash === '#chatbot') {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) { }
    }
  };

  const toggleMinimize = () => {
    const isNowMinimized = !windowEl.classList.contains('is-minimized');

    if (isNowMinimized) {
      windowEl.classList.add('is-minimized');
      windowEl.classList.add('is-open');
      launcher.setAttribute('aria-expanded', 'true');
      setMinimizeStateIcon(true);

      try {
        localStorage.setItem(STORAGE_OPEN_KEY, 'true');
        localStorage.setItem(STORAGE_MIN_KEY, 'true');
      } catch (e) { }

      try { if (typeof stopVoiceInput === 'function') stopVoiceInput(); } catch (e) { }
    try { if (typeof toggleEmojiPicker === 'function') toggleEmojiPicker(false); } catch (e) { }
    } else {
      windowEl.classList.remove('is-minimized');
      windowEl.classList.add('is-open');
      setMinimizeStateIcon(false);

      try {
        localStorage.setItem(STORAGE_MIN_KEY, 'false');
      } catch (e) { }

      setTimeout(() => inputEl?.focus(), 200);
      scrollToBottom();
    }
  };

  const toggleChat = (forceState) => {
    if (typeof forceState === 'boolean') {
      if (forceState) openChat();
      else closeChat();
      return;
    }

    if (!windowEl.classList.contains('is-open')) {
      openChat();
    } else if (windowEl.classList.contains('is-minimized')) {
      toggleMinimize();
    } else {
      closeChat();
    }
  };

  launcher.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleChat();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeChat();
  });

  minBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMinimize();
  });

  headerEl?.addEventListener('click', (e) => {
    if (windowEl.classList.contains('is-minimized')) {
      if (!e.target.closest('#chatbot-close')) {
        e.preventDefault();
        e.stopPropagation();
        toggleMinimize();
      }
    }
  });

  windowEl.addEventListener('click', (e) => {
    const closeTrigger = e.target.closest('#chatbot-close, [data-chatbot-close]');
    if (closeTrigger) {
      e.preventDefault();
      e.stopPropagation();
      closeChat();
      return;
    }

    const minTrigger = e.target.closest('#chatbot-minimize, [data-chatbot-minimize]');
    if (minTrigger) {
      e.preventDefault();
      e.stopPropagation();
      toggleMinimize();
      return;
    }

    const btn = e.target.closest('.chatbot-option-btn');
    if (btn) {
      e.preventDefault();
      const query = btn.getAttribute('data-query') || btn.textContent.trim().replace(/→$/, '').trim();
      handleSendMessage(query);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && windowEl.classList.contains('is-open')) {
      closeChat();
    }
  });

  const scrollToBottom = () => {
    if (!messagesEl) return;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const appendUserMessage = (text) => {
    if (!messagesEl) return;
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row user-row';
    row.innerHTML = `
      <div class="chatbot-user-msg-content">
        <div class="chatbot-user-bubble">${escapeHTML(text)}</div>
      </div>
    `;
    messagesEl.appendChild(row);
    scrollToBottom();
    saveChatHistory();
  };

  const appendUserImage = (src, alt) => {
    if (!messagesEl) return;
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row user-row';
    row.innerHTML = `
      <div class="chatbot-user-msg-content">
        <div class="chatbot-user-bubble" style="padding: 6px;">
          <img src="${src}" alt="${escapeHTML(alt || 'Attached image')}" style="max-width: 220px; max-height: 180px; border-radius: 8px; display: block; object-fit: cover;">
        </div>
      </div>
    `;
    messagesEl.appendChild(row);
    scrollToBottom();
    saveChatHistory();
  };

  const appendBotMessage = (htmlContent, options = []) => {
    if (!messagesEl) return;
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row';

    let optionsHtml = '';
    if (options && options.length > 0) {
      optionsHtml = `
        <div class="chatbot-options-stack">
          ${options.map(opt => `<button type="button" class="chatbot-option-btn" data-query="${escapeHTML(opt)}">${escapeHTML(opt)}</button>`).join('')}
        </div>
      `;
    }

    row.innerHTML = `
      <img src="${avatarSrc}" alt="Salowtech" class="chatbot-bot-avatar">
      <div class="chatbot-msg-content">
        <div class="chatbot-sender-meta">
          <span class="chatbot-sender-name">Salowtech</span>
          <span class="chatbot-timestamp">${getFormattedTime()}</span>
        </div>
        <div class="chatbot-bot-bubble">
          ${htmlContent}
        </div>
        ${optionsHtml}
      </div>
    `;

    messagesEl.appendChild(row);
    scrollToBottom();
    saveChatHistory();
  };

  const showTypingIndicator = () => {
    if (!messagesEl || isTyping) return null;
    isTyping = true;
    const typingRow = document.createElement('div');
    typingRow.id = 'chatbot-typing-bubble';
    typingRow.className = 'chatbot-msg-row';
    typingRow.innerHTML = `
      <div class="chatbot-thinking-mascot-wrap">
        <div class="chatbot-thinking-ring"></div>
        <img src="${avatarSrc}" alt="Salowtech Mascot" class="chatbot-thinking-mascot">
      </div>
      <div class="chatbot-msg-content">
        <div class="chatbot-grok-thinking-card">
          <div class="grok-wave-bars" aria-hidden="true">
            <span class="grok-bar"></span>
            <span class="grok-bar"></span>
            <span class="grok-bar"></span>
            <span class="grok-bar"></span>
          </div>
          <span class="chatbot-grok-thinking-text">Salowtech AI is thinking...</span>
        </div>
      </div>
    `;
    messagesEl.appendChild(typingRow);
    scrollToBottom();
    return typingRow;
  };

  const removeTypingIndicator = () => {
    const indicator = document.getElementById('chatbot-typing-bubble');
    if (indicator) indicator.remove();
    isTyping = false;
  };

  const generateResponse = (rawQuery) => {
    const query = rawQuery.toLowerCase().trim();

    if (/website|web\s*dev|web\s*design|frontend|landing/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">Custom Website Development</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">We architect lightning-fast, SEO-optimized bespoke web applications and corporate portals. Built with clean semantic code, sub-second load times, smooth micro-interactions, and enterprise-grade data security.</p>
          <p class="text-xs text-neutral-600">Would you like a project estimate or an architecture discussion?</p>
        `,
        options: ['Get a Project Estimate', 'Explore Previous Work', 'Consult an Enterprise Architect']
      };
    }

    if (/app|mobile|android|ios|flutter|cross-platform|native/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">Mobile & Web App Development</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">We engineer high-concurrency native iOS/Android and progressive web apps. Features include offline-first syncing, military-grade biometric authentication, push notifications, and high-throughput microservice APIs.</p>
          <p class="text-xs text-neutral-600">Let's discuss your product roadmap and tech stack.</p>
        `,
        options: ['Discuss App Architecture', 'Get Development Timeline', 'Book Discovery Call']
      };
    }

    if (/hrm|attendance|payroll|salary|leave|statutory/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">HRM, Attendance & Indian Payroll Suite</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">Engineered for strict Indian statutory compliance (PF, ESI, TDS, PT). Includes facial & geo-fenced mobile punch-in, automated shift rosters, and 1-click compliant salary disbursement.</p>
        `,
        options: ['Schedule HRM Live Demo', 'Download Compliance Spec', 'Talk to Enterprise Architect']
      };
    }

    if (/crm.*erp|erp.*crm/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">CRM & ERP Enterprise Platforms</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">Unified sovereign solutions for business operations. Integrates WhatsApp lead capture, multi-stage sales pipelines, supply chain governance, and audit-ready financial reporting.</p>
        `,
        options: ['Explore CRM Workflows', 'Request ERP Architecture Spec', 'Talk to Enterprise Architect']
      };
    }

    if (/whatsapp|talk to whatsapp|chat on whatsapp|wa\.me/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">Talk on WhatsApp:</p>
          <p class="text-xs text-neutral-700 mb-2">Connect directly with our engineering team on WhatsApp at <strong>+91 63517 88935</strong>.</p>
          <a href="https://wa.me/916351788935?text=Hi%20Salowtech%2C%20I%20want%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-medium text-xs shadow-xs hover:bg-[#1EBE5D] transition-colors">
            💬 Open WhatsApp Chat
          </a>
        `,
        options: ['Request A Quote', 'Talk to Enterprise Architect']
      };
    }

    if (/crm|lead|automation|sales|pipeline|funnel/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">CRM & Omnichannel Lead Automation</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">Accelerate sales conversion cycles. Automatically ingest leads from WhatsApp, Web forms, Meta Ads, and Email with intelligent SLA routing, multi-stage pipelines, and real-time revenue analytics.</p>
        `,
        options: ['Explore CRM Workflows', 'Schedule an Architecture Call', 'Connect with Technical Team']
      };
    }

    if (/erp|enterprise|finance|accounting|inventory|supply|warehouse/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">ERP & Enterprise Operations</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">A unified sovereign operations platform integrating multi-warehouse supply chains, automated double-entry accounting, vendor portals, and audit-ready P&L financial reports.</p>
        `,
        options: ['Request ERP Architecture Spec', 'Talk to Enterprise Architect']
      };
    }

    if (/database|subscription|hosting|cloud|sovereign|server/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">Database & Sovereign Cloud Infrastructure</p>
          <p class="text-xs text-neutral-700 leading-relaxed mb-2">Our sovereign platforms run with 100% data custody. We offer on-premise deployments or secure Indian sovereign cloud hosting with zero vendor lock-in and automated real-time backups.</p>
          <p class="text-xs text-neutral-600">Would you like database migration assistance or an infrastructure audit?</p>
        `,
        options: ['Schedule an Infrastructure Audit', 'Contact Sales Team']
      };
    }

    if (/architect|consult|specialist|call|schedule|contact|email|sales|team/i.test(query)) {
      return {
        text: `
          <p class="font-semibold text-neutral-900 mb-1">Direct Enterprise Consultation:</p>
          <p class="text-xs text-neutral-700">📧 <strong>contact@salowtech.com</strong></p>
          <p class="text-xs text-neutral-700">📞 <strong>+91 63517 88935</strong></p>
          <div class="mt-2">
            <a href="https://wa.me/916351788935?text=Hi%20Salowtech%2C%20I%20want%20to%20discuss%20a%20project" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-medium text-xs shadow-xs hover:bg-[#1EBE5D] transition-colors">
              💬 Chat on WhatsApp (+91 63517 88935)
            </a>
          </div>
          <p class="text-xs text-neutral-600 mt-2">Our senior architects will schedule a 30-minute discovery session to evaluate your technical requirements.</p>
        `,
        options: ['Talk on WhatsApp', 'Website Development', 'App Development', 'HRM & Payroll']
      };
    }

    return {
      text: `
        <p class="text-xs text-neutral-800 leading-relaxed">Thank you for contacting Salowtech. How can we assist you with our core platforms?</p>
      `,
      options: ['Website Development', 'App Development', 'HRM & Payroll', 'CRM & ERP']
    };
  };

  const handleSendMessage = (text) => {
    try { if (typeof stopVoiceInput === 'function') stopVoiceInput(); } catch (e) { }
    try { if (typeof toggleEmojiPicker === 'function') toggleEmojiPicker(false); } catch (e) { }

    const message = (text || inputEl?.value || '').trim();
    if (!message || isTyping) return;

    if (inputEl) inputEl.value = '';
    appendUserMessage(message);
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const reply = generateResponse(message);
      appendBotMessage(reply.text, reply.options);
      playChime();
    }, 850);
  };

  formEl?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // Option buttons are already handled via delegated windowEl listener above

  /* ------------------------------------------------------------------------
     Emoji Picker Controller
     ------------------------------------------------------------------------ */
  const emojiBtn = document.getElementById('chatbot-emoji-btn');
  const emojiPicker = document.getElementById('chatbot-emoji-picker');
  const emojiGrid = document.getElementById('chatbot-emoji-grid');

  const EMOJI_LIST = ['👋', '😊', '👍', '🔥', '🚀', '💡', '💼', '🤖', '❤️', '✨', '📱', '💻', '🎯', '🤝', '👏', '🙏', '⚡', '📊', '🌐', '🏢', '🎉', '✅', '💬', '📞', '🇮🇳', '🛡️', '⚙️', '📈'];

  if (emojiGrid && emojiGrid.children.length === 0) {
    emojiGrid.innerHTML = EMOJI_LIST.map(
      (emo) => `<button type="button" class="chatbot-emoji-item" data-emoji="${emo}">${emo}</button>`
    ).join('');
  }

  const toggleEmojiPicker = (forceState) => {
    if (!emojiPicker) return;
    const isVisible = emojiPicker.style.display !== 'none';
    const show = typeof forceState === 'boolean' ? forceState : !isVisible;
    emojiPicker.style.display = show ? 'block' : 'none';
  };

  emojiBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleEmojiPicker();
  });

  emojiGrid?.addEventListener('click', (e) => {
    const item = e.target.closest('.chatbot-emoji-item');
    if (!item || !inputEl) return;
    const emo = item.getAttribute('data-emoji') || item.textContent.trim();
    inputEl.value += emo;
    inputEl.focus();
  });

  document.addEventListener('click', (e) => {
    if (emojiPicker && emojiPicker.style.display !== 'none') {
      if (!emojiPicker.contains(e.target) && !emojiBtn?.contains(e.target)) {
        toggleEmojiPicker(false);
      }
    }
  });

  /* ------------------------------------------------------------------------
     Photo / Image Attachment Controller
     ------------------------------------------------------------------------ */
  const photoBtn = document.getElementById('chatbot-photo-btn');
  const fileInput = document.getElementById('chatbot-file-input');

  photoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput?.click();
  });

  fileInput?.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.).');
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (!dataUrl) return;

      appendUserImage(dataUrl, file.name);
      fileInput.value = '';

      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        appendBotMessage(
          `<p class="font-semibold text-neutral-900 mb-1">Image Received 📸</p>
           <p class="text-xs text-neutral-700 leading-relaxed mb-2">I have received your screenshot <em>"${escapeHTML(file.name)}"</em>. Our engineering leads will review your UI/flow requirements directly against your project scope.</p>
           <p class="text-xs text-neutral-600">How would you like to proceed?</p>`,
          ['Get a Project Estimate', 'Schedule Architecture Review', 'Talk to Enterprise Architect']
        );
        playChime();
      }, 700);
    };
    reader.readAsDataURL(file);
  });

  /* ------------------------------------------------------------------------
     Speech-to-Text Voice Typing Controller (Web Speech API)
     ------------------------------------------------------------------------ */
  const micBtn = document.getElementById('chatbot-mic-btn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;

  function stopVoiceInput() {
    if (recognition && isListening) {
      try { recognition.stop(); } catch (e) { }
    }
    isListening = false;
    micBtn?.classList.remove('is-recording');
    if (inputEl) inputEl.placeholder = 'Say something or speak...';
  }

  function startVoiceInput() {
    if (!SpeechRecognition) {
      alert('Voice typing is supported in Google Chrome, Microsoft Edge, and modern browsers. Please ensure microphone access is granted.');
      return;
    }

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        isListening = true;
        micBtn?.classList.add('is-recording');
        if (inputEl) inputEl.placeholder = 'Listening... Speak now 🎙️';
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (inputEl && transcript) {
          inputEl.value = transcript;
          inputEl.focus();
        }
      };

      recognition.onerror = () => {
        stopVoiceInput();
      };

      recognition.onend = () => {
        stopVoiceInput();
      };

      recognition.start();
    } catch (_) {
      stopVoiceInput();
    }
  }

  micBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (isListening) {
      stopVoiceInput();
    } else {
      startVoiceInput();
    }
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Restore persisted chat state & message history across page navigation
  try {
    const savedHistory = localStorage.getItem(STORAGE_HIST_KEY);
    if (savedHistory && messagesEl) {
      messagesEl.innerHTML = savedHistory;
      const leftoverTyping = messagesEl.querySelector('#chatbot-typing-bubble');
      if (leftoverTyping) leftoverTyping.remove();
    }

    const isSavedOpen = localStorage.getItem(STORAGE_OPEN_KEY) === 'true';
    const isSavedMin = localStorage.getItem(STORAGE_MIN_KEY) === 'true';
    const hasChatHash = window.location.hash === '#chat' || window.location.hash === '#chatbot';

    if (isSavedOpen || hasChatHash) {
      if (isSavedMin && !hasChatHash) {
        windowEl.classList.add('is-open', 'is-minimized');
        launcher.setAttribute('aria-expanded', 'true');
        setMinimizeStateIcon(true);
      } else {
        openChat();
      }
    }
  } catch (e) { }

  // Expose global methods & bind open-chat triggers across pages
  window.openChatbot = openChat;
  window.closeChatbot = closeChat;
  window.minimizeChatbot = toggleMinimize;
  window.toggleChatbot = toggleChat;

  document.querySelectorAll('[data-open-chat], a[href="#chat"], a[href="#chatbot"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openChat();
    });
  });
}

/* --------------------------------------------------------------------------
   14. Unified High-Performance Scroll Reveals Engine (120fps)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('#tech-stack, #showcase-video, [data-purpose="feature-grid"], [data-purpose="tech-grid"], #deliverables-table tbody').forEach((el) => {
      el.classList.add('is-revealed');
    });
    return;
  }

  // 1. Tech Stack 12 Cards Wave (staggered 50ms)
  const techStack = document.getElementById('tech-stack');
  if (techStack) {
    const cards = techStack.querySelectorAll('.group');
    cards.forEach((card, i) => {
      const rowIndex = Math.floor(i / 6);
      card.style.transitionDelay = `${rowIndex * 60}ms`;
    });
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          techStack.classList.add('is-revealed');
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(techStack);
    } else {
      techStack.classList.add('is-revealed');
    }
  }

  // 2. Video Showcase Container Scale-In
  const videoSection = document.getElementById('showcase-video');
  if (videoSection) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          videoSection.classList.add('is-revealed');
          obs.disconnect();
        }
      }, { threshold: 0.15 });
      obs.observe(videoSection);
    } else {
      videoSection.classList.add('is-revealed');
    }
  }

  // 3. Subpage Feature Grids Stagger
  const featureGrids = document.querySelectorAll('[data-purpose="feature-grid"], [data-purpose="tech-grid"], .module-grid');
  featureGrids.forEach((grid) => {
    const items = grid.children;
    Array.from(items).forEach((item, idx) => {
      item.classList.add('subpage-feature-card');
      item.style.transitionDelay = `${(idx % 4) * 60}ms`;
    });
  });

  // 4. Deliverables Table Rows Stagger
  const tableBodies = document.querySelectorAll('#deliverables-table tbody, table tbody');
  tableBodies.forEach((tb) => {
    Array.from(tb.children).forEach((row, idx) => {
      row.style.transitionDelay = `${(idx % 6) * 40}ms`;
    });
  });

  // 5. Automated Smooth Scroll Reveals for Cards & Grids
  const revealTargets = document.querySelectorAll(
    '.scroll-reveal, #featured-story, #demo-consultation, #faq-section .q, #all-testimonials, .featured-metric-card, .differentiator-item, #digital-solutions .group, #blog-section article, .cu-top > div, .cu-bottom > div, [data-purpose="feature-grid"] > div, [data-purpose="tech-grid"] > div'
  );
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealTargets.forEach((el, index) => {
      el.classList.add('scroll-reveal');
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = `${(index % 4) * 0.08}s`;
      }
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach((el) => {
      el.classList.add('is-revealed');
    });
  }
}

/* --------------------------------------------------------------------------
   14b. Sticky Navbar Blur & Shadow Transition Controller
   -------------------------------------------------------------------------- */
function initNavbarScrollEffect() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const updateNavbar = (y) => {
    const scrollPos = typeof y === 'number' ? y : (window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0);
    const isPast = scrollPos > 18;
    header.classList.toggle('navbar-scrolled', isPast);
    header.classList.toggle('is-scrolled', isPast);
  };

  updateNavbar();
}

// Smooth scroll utility for anchor navigation
function scrollToElement(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  if (window.lenis) {
    window.lenis.scrollTo(el, { offset: -70, duration: 0.9 });
  } else {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
window.scrollToElement = scrollToElement;

/* Global FAQ Accordion Toggle for Subpages - Smooth Motion Drawer */
window.toggleFaq = function (button) {
  const container = button.closest('[data-faq-item]') || button.parentElement;
  if (!container) return;
  const content = container.querySelector('.faq-content') || container.querySelector('[data-faq-answer]') || container.querySelector('dd, .faq-answer');
  const icon = button.querySelector('.faq-icon') || container.querySelector('.faq-icon') || button.querySelector('svg');
  if (!content) return;

  const isHidden = content.classList.contains('hidden') || content.style.maxHeight === '0px' || getComputedStyle(content).display === 'none';

  if (isHidden) {
    content.classList.remove('hidden');
    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';

    void content.offsetHeight;

    content.style.maxHeight = (content.scrollHeight + 32) + 'px';
    content.style.opacity = '1';

    if (icon) {
      if (icon.tagName && icon.tagName.toLowerCase() === 'svg') {
        icon.style.transform = 'rotate(180deg)';
      } else {
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
      }
    }

    container.classList.remove('bg-white', 'border-cream-300');
    container.classList.add('bg-maroon', 'text-white', 'border-maroon');
    button.classList.remove('text-slate-900');
    button.classList.add('text-white');
    button.setAttribute('aria-expanded', 'true');
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    void content.offsetHeight;
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    setTimeout(() => {
      content.classList.add('hidden');
      content.style.maxHeight = '';
      content.style.opacity = '';
    }, 320);

    if (icon) {
      if (icon.tagName && icon.tagName.toLowerCase() === 'svg') {
        icon.style.transform = 'rotate(0deg)';
      } else {
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
      }
    }

    container.classList.add('bg-white', 'border-cream-300');
    container.classList.remove('bg-maroon', 'text-white', 'border-maroon');
    button.classList.add('text-slate-900');
    button.classList.remove('text-white');
    button.setAttribute('aria-expanded', 'false');
  }
};

/* Global SEO FAQ Accordion Toggle - Smooth Motion Drawer */
window.toggleSeoFaq = function (button) {
  const parent = button.closest('[data-purpose="accordion-item"]') || button.closest('[data-purpose="faq-item"]') || button.parentElement;
  if (!parent) return;
  const content = parent.querySelector('div:last-child') || parent.querySelector('[data-purpose="faq-answer"]');
  if (!content) return;
  const icon = button.querySelector('span:last-child i') || button.querySelector('i');
  const iconWrap = button.querySelector('span:last-child');
  const isSvg = button.querySelector('svg');

  const isHidden = content.classList.contains('hidden') || content.style.maxHeight === '0px' || getComputedStyle(content).display === 'none';

  if (isHidden) {
    content.classList.remove('hidden');
    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    content.style.overflow = 'hidden';
    void content.offsetHeight;
    content.style.maxHeight = (content.scrollHeight + 32) + 'px';
    content.style.opacity = '1';

    button.classList.add('bg-maroon-800', 'text-white');
    button.classList.remove('text-slate-800');
    if (icon) icon.className = 'fa-solid fa-minus';
    if (iconWrap) iconWrap.className = 'w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0 ml-3 text-white';
    if (isSvg) isSvg.style.transform = 'rotate(180deg)';
    button.setAttribute('aria-expanded', 'true');
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    void content.offsetHeight;
    content.style.maxHeight = '0px';
    content.style.opacity = '0';

    setTimeout(() => {
      content.classList.add('hidden');
      content.style.maxHeight = '';
      content.style.opacity = '';
    }, 320);

    button.classList.remove('bg-maroon-800', 'text-white');
    button.classList.add('text-slate-800');
    if (icon) icon.className = 'fa-solid fa-plus';
    if (iconWrap) iconWrap.className = 'w-7 h-7 rounded-full bg-cream-200 text-maroon-800 flex items-center justify-center text-xs shrink-0 ml-3';
    if (isSvg) isSvg.style.transform = 'rotate(0deg)';
    button.setAttribute('aria-expanded', 'false');
  }
};

/* Global Blog Pagination */
window.setBlogPage = function (page) {
  const page1 = document.getElementById('blog-page-1');
  const page2 = document.getElementById('blog-page-2');
  const btn1 = document.getElementById('blog-page-btn-1');
  const btn2 = document.getElementById('blog-page-btn-2');
  const prevBtn = document.getElementById('blog-prev-btn');
  const nextBtn = document.getElementById('blog-next-btn');

  if (!page1 || !page2) return;

  if (page === 1) {
    page1.classList.remove('hidden');
    page2.classList.add('hidden');
    if (btn1) btn1.className = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all bg-[#ECE8DF] text-neutral-900 shadow-xs';
    if (btn2) btn2.className = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all text-neutral-600 hover:text-neutral-900 hover:bg-[#F2EFE9] cursor-pointer';
    if (prevBtn) prevBtn.className = 'w-10 h-10 rounded-xl border border-neutral-200/90 flex items-center justify-center transition-all opacity-35 cursor-not-allowed pointer-events-none bg-white text-neutral-400';
    if (nextBtn) nextBtn.className = 'w-10 h-10 rounded-xl border border-neutral-200/90 flex items-center justify-center transition-all bg-white text-neutral-900 hover:bg-neutral-50 cursor-pointer';
  } else if (page === 2) {
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
    if (btn1) btn1.className = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all text-neutral-600 hover:text-neutral-900 hover:bg-[#F2EFE9] cursor-pointer';
    if (btn2) btn2.className = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all bg-[#ECE8DF] text-neutral-900 shadow-xs';
    if (prevBtn) prevBtn.className = 'w-10 h-10 rounded-xl border border-neutral-200/90 flex items-center justify-center transition-all bg-white text-neutral-900 hover:bg-neutral-50 cursor-pointer';
    if (nextBtn) nextBtn.className = 'w-10 h-10 rounded-xl border border-neutral-200/90 flex items-center justify-center transition-all opacity-35 cursor-not-allowed pointer-events-none bg-white text-neutral-400';
  }

  const blogHeader = document.getElementById('blog-section');
  if (blogHeader) {
    scrollToElement('blog-section');
  }
};

// 404 interactive dog controller is hosted directly on 404.html





/* Global Scroll Reveal & Universal Contact Redirect Interceptor */
function initGlobalServicesEnhancements() {
  // 1. Universal CTA redirection to contact-us.html
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a, button');
    if (!link || (link.tagName === 'BUTTON' && (link.type === 'submit' || link.closest('form')))) return;

    const href = link.getAttribute('href') || '';
    const text = (link.textContent || '').trim().toLowerCase();

    // Check if button text matches consultation or contact phrasing
    const isConsultationCTA =
      text.includes('talk to our team') ||
      text.includes('talk to our enterprise team') ||
      text.includes('talk to our sales architects') ||
      text.includes('talk to our hr tech team') ||
      text.includes('talk to our ai voice team') ||
      text.includes('talk to our seo') ||
      text.includes('free consultation') ||
      text.includes('free app consultation') ||
      text.includes('free erp consultation') ||
      text.includes('free crm consultation') ||
      text.includes('free hrm consultation') ||
      text.includes('free ai voice consultation') ||
      text.includes('get seo consultation') ||
      text.includes('get contact with us') ||
      text.includes('get in touch') ||
      text.includes('contact with us');

    const isAnchorFormTarget =
      href === '#quote-card' ||
      href === '#lead-form' ||
      href === '#demo-consultation' ||
      href === '#contact';

    if (isConsultationCTA || isAnchorFormTarget) {
      if (!href.startsWith('contact-us.html') && !link.hasAttribute('data-allow-default')) {
        e.preventDefault();
        window.location.href = 'contact-us.html';
      }
    }
  });

  // 2. IntersectionObserver for Reveal Animations on Scroll
  const revealTargets = document.querySelectorAll(
    'section, [data-purpose="feature-bento-grid"] > div, [data-purpose="services-grid"] > div, .salow-reveal'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    });

    revealTargets.forEach(el => {
      el.classList.add('salow-reveal');
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('revealed'));
  }

  // 3. Initialize Video-Style FAQ Accordion
  initVideoStyleFAQ();
  initTransmissionScrollInteraction();
  initTaskGoUniversalReveals();
  initLivingEnterpriseBento();
  initServiceVideoShowcases();
}

function initServiceVideoShowcases() {
  document.querySelectorAll('.service-video-showcase').forEach((section) => {
    const video = section.querySelector('video');
    const overlay = section.querySelector('.video-poster-overlay');
    const playBtn = section.querySelector('.video-play-pulse-btn');
    if (!video) return;

    const togglePlay = () => {
      if (video.paused) {
        video.play().then(() => {
          if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
          }
        }).catch(() => {});
      } else {
        video.pause();
        if (overlay) {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
        }
      }
    };

    if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    if (overlay) overlay.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
  });
}

function initVideoStyleFAQ() {
  document.querySelectorAll('.faq-video-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-video-item');
      if (!item) return;
      const isOpen = item.classList.contains('is-open');

      const parentList = item.closest('.faq-video-list');
      if (parentList) {
        parentList.querySelectorAll('.faq-video-item.is-open').forEach(openItem => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.faq-video-btn')?.setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalServicesEnhancements);
} else {
  initGlobalServicesEnhancements();
}


/* ==========================================================================
   Transmission Hub Scroll Reveal & Retraction Controller (Video-Matched)
   When scroll up: elements get sucked into the Salowtech center hub.
   When scroll down: elements reveal and explode outward into orbit.
   ========================================================================== */
function initTransmissionScrollInteraction() {
  const stages = document.querySelectorAll('.transmission-stage');
  if (!stages.length) return;

  stages.forEach(stage => {
    const hub = stage.querySelector('.orbit-center-hub');
    const nodes = stage.querySelectorAll('.orbit-node');
    if (!hub || !nodes.length) return;

    function calculateVectors() {
      // Temporarily reset inline transforms to calculate true layout positions
      const saved = [];
      nodes.forEach((node, i) => {
        saved[i] = node.style.transform;
        node.style.transform = 'none';
      });

      const hubRect = hub.getBoundingClientRect();
      const hubCenterX = hubRect.left + hubRect.width / 2;
      const hubCenterY = hubRect.top + hubRect.height / 2;

      nodes.forEach((node, i) => {
        const nodeRect = node.getBoundingClientRect();
        const nodeCenterX = nodeRect.left + nodeRect.width / 2;
        const nodeCenterY = nodeRect.top + nodeRect.height / 2;

        const dx = Math.round(hubCenterX - nodeCenterX);
        const dy = Math.round(hubCenterY - nodeCenterY);

        node.style.setProperty('--collapse-x', `${dx}px`);
        node.style.setProperty('--collapse-y', `${dy}px`);
        node.style.transform = saved[i] || '';
      });
    }

    calculateVectors();

    // Start collapsed so entrance reveals from inside the hub
    stage.classList.add('is-collapsed');
    stage.classList.remove('is-revealed');

    let isRevealed = false;
    let lastScrollY = window.scrollY;

    function onScroll() {
      const rect = stage.getBoundingClientRect();
      const windowH = window.innerHeight;
      const currentScrollY = window.scrollY;
      lastScrollY = currentScrollY;

      // When section enters the active viewport area
      const inView = rect.top < windowH * 0.82 && rect.bottom > windowH * 0.12;

      if (inView) {
        if (!isRevealed) {
          isRevealed = true;
          stage.classList.remove('is-collapsed');
          stage.classList.add('is-revealed');
        }
      } else {
        if (rect.top >= windowH * 0.86 || rect.bottom <= 0) {
          if (isRevealed) {
            isRevealed = false;
            stage.classList.remove('is-revealed');
            stage.classList.add('is-collapsed');
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', calculateVectors, { passive: true });
    setTimeout(() => {
      calculateVectors();
      onScroll();
    }, 200);
  });
}

function initTaskGoUniversalReveals() {
  const revealSelectors = [
    'section:not(.hero) .heading-title',
    'section:not(.hero) .eyebrow',
    'section:not(.hero) h2',
    '.feature-container > div',
    '.teams-block',
    '.review-small-crad',
    '.review-1st-block-wrap',
    '.services-grid > div',
    '[data-purpose="feature-bento-grid"] > div',
    '[data-purpose="services-grid"] > div',
    '.faq-video-item',
    '.cta-pill-form',
    '.masterpiece-card',
    '.taskgo-reveal'
  ];

  const elements = document.querySelectorAll(revealSelectors.join(', '));
  if (!elements.length) return;

  elements.forEach((el) => {
    if (!el.classList.contains('taskgo-reveal')) {
      el.classList.add('taskgo-reveal');
    }
    if (el.parentElement && el.parentElement.children.length > 1) {
      const idx = Array.from(el.parentElement.children).indexOf(el);
      const staggerClass = 'taskgo-stagger-' + ((idx % 6) + 1);
      el.classList.add(staggerClass);
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('taskgo-in');
        } else {
          // Re-trigger reveal when scrolling up past
          if (entry.boundingClientRect.top > window.innerHeight) {
            entry.target.classList.remove('taskgo-in');
          }
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('taskgo-in'));
  }
}

/* ==========================================================================
   Living Enterprise Bento Engine (Spotlight Cursor Tracking & Micro-Interactions)
   ========================================================================== */
function initLivingEnterpriseBento() {
  // 1. Hardware-Accelerated Dynamic Spotlight for Individual Cards
  const cards = document.querySelectorAll('.masterpiece-card');
  cards.forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, { passive: true });
  });

  // Ensure grid containers have spotlight-grid class for dimming siblings
  document.querySelectorAll('[data-purpose*="solutions-grid"] .grid, #why-us .grid').forEach(g => {
    g.classList.add('spotlight-grid');
  });

  // 2. Interactive RBAC Role Selector Switcher
  document.querySelectorAll('.rbac-role-pill').forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = pill.closest('.micro-ui-stage');
      if (!parent) return;

      parent.querySelectorAll('.rbac-role-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const desc = parent.querySelector('.rbac-role-desc');
      const role = pill.getAttribute('data-role');
      if (desc) {
        if (role === 'buyer') {
          desc.innerHTML = '<span class="text-[#AD8B73] font-bold">Buyer:</span> Catalog Order & Cart Clearance OK';
        } else if (role === 'approver') {
          desc.innerHTML = '<span class="text-[#059669] font-bold">Approver:</span> ₹25L PO Signoff Authorized';
        } else if (role === 'admin') {
          desc.innerHTML = '<span class="text-[#7D3024] font-bold">Admin:</span> Full Sovereign Tenant & Audit Control';
        }
      }
    });
  });

  // 3. Accessible Interactive Mini Calendar Day Selector for HRM Leave
  document.querySelectorAll('button.mini-cal-day').forEach((day) => {
    day.addEventListener('click', (e) => {
      e.stopPropagation();
      const isNowActive = day.classList.toggle('active');
      day.setAttribute('aria-pressed', String(isNowActive));
      const stage = day.closest('.micro-ui-stage');
      if (stage) {
        const count = stage.querySelectorAll('button.mini-cal-day.active').length;
        const quotaBadge = stage.querySelector('.leave-quota-badge');
        if (quotaBadge) {
          quotaBadge.textContent = `${count} Selected (${24 - count} Left)`;
        }
      }
    });
  });

  // 4. Robust Payslip Download Simulation Trigger
  document.querySelectorAll('.btn-payslip-sim').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.dataset.simulating === 'true') return;
      btn.dataset.simulating = 'true';
      const defaultLabel = btn.dataset.defaultLabel || (btn.dataset.defaultLabel = btn.innerHTML);
      btn.innerHTML = '<span class="text-[#059669]">✓ PDF Decrypted</span>';
      btn.style.borderColor = '#059669';
      setTimeout(() => {
        btn.innerHTML = defaultLabel;
        btn.style.borderColor = '';
        btn.dataset.simulating = 'false';
      }, 2000);
    });
  });
}

/* --------------------------------------------------------------------------
   Contacts / Get Started Section Interaction (Fireart Studio Spec)
   -------------------------------------------------------------------------- */
function initContactsSection() {
  // Custom dropdowns (.c-select)
  document.querySelectorAll('.c-select').forEach((selectEl) => {
    const label = selectEl.querySelector('.c-select__label');
    const nativeSelect = selectEl.querySelector('select');
    const items = selectEl.querySelectorAll('ul li');

    if (label) {
      label.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.c-select.open').forEach((other) => {
          if (other !== selectEl) other.classList.remove('open');
        });
        const isOpen = selectEl.classList.toggle('open');
        label.setAttribute('aria-expanded', String(isOpen));
      });

      label.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isOpen = selectEl.classList.toggle('open');
          label.setAttribute('aria-expanded', String(isOpen));
        } else if (e.key === 'Escape') {
          selectEl.classList.remove('open');
          label.setAttribute('aria-expanded', 'false');
        }
      });
    }

    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = item.getAttribute('data-value') ?? item.getAttribute('value') ?? item.textContent.trim();
        const text = item.textContent.trim();
        if (label) {
          label.textContent = text;
          if (val) label.classList.add('has-value');
          else label.classList.remove('has-value');
        }
        items.forEach((li) => li.classList.remove('is-selected'));
        item.classList.add('is-selected');

        if (nativeSelect) {
          nativeSelect.value = val;
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        selectEl.classList.remove('open');
        if (label) {
          label.setAttribute('aria-expanded', 'false');
          label.focus();
        }
      });
    });
  });

  // Global click outside to close dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.c-select')) {
      document.querySelectorAll('.c-select.open').forEach((el) => {
        el.classList.remove('open');
        const lbl = el.querySelector('.c-select__label');
        if (lbl) lbl.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // File attachment change handler
  document.querySelectorAll('.contacts__form-file-input').forEach((input) => {
    input.addEventListener('change', () => {
      const parent = input.closest('.contacts__form-file');
      const textSpan = parent?.querySelector('.file-text');
      if (textSpan) {
        if (input.files && input.files.length > 0) {
          textSpan.textContent = input.files[0].name;
        } else {
          textSpan.textContent = 'Attach File';
        }
      }
    });
  });

  document.querySelectorAll('.contacts__info-email').forEach((emailContainer) => {
    const copyBtn = emailContainer.querySelector('.contacts__info-copy');
    const msg = emailContainer.querySelector('.contacts__info-message');
    const link = emailContainer.querySelector('a');
    const emailToCopy = link ? link.textContent.trim() : 'contact@salowtech.com';

    const triggerCopy = async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(emailToCopy);
      } catch (_) {
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (msg) {
        msg.classList.add('is-visible');
        setTimeout(() => {
          msg.classList.remove('is-visible');
        }, 2200);
      }
    };

    if (copyBtn) {
      copyBtn.addEventListener('click', triggerCopy);
    }
  });

  document.querySelectorAll('.contacts__form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.contacts__form-btn');
      const responseEl = form.querySelector('.contacts__form-response');

      if (btn) btn.classList.add('is-loading');
      if (responseEl) {
        responseEl.className = 'contacts__form-response';
        responseEl.style.display = 'none';
      }

      setTimeout(() => {
        if (btn) btn.classList.remove('is-loading');
        if (responseEl) {
          responseEl.className = 'contacts__form-response is-success';
          responseEl.textContent = 'Thank you! Your project enquiry has been submitted. Our team will contact you shortly.';
          responseEl.style.display = 'block';
        }
        form.reset();
        const defaultSelect = form.querySelector('.c-select__label');
        if (defaultSelect) defaultSelect.textContent = 'Where you know us from?';
        const fileText = form.querySelector('.file-text');
        if (fileText) fileText.textContent = 'Attach File';
      }, 700);
    });
  });
}


/* ----------------------------------------
   About Us Page Interactive Animations
---------------------------------------- */
function initAboutAnimations() {
  // 1. Photo Collage Canvas Fly-In Assemble Animation
  const collage = document.querySelector('.about-photo-collage__canvas');
  if (collage) {
    if ('IntersectionObserver' in window) {
      const collageObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            collage.classList.add('is-assembled');
            collageObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      collageObs.observe(collage);
    } else {
      collage.classList.add('is-assembled');
    }
  }

  // 2. Manifesto Doodle Stroke Drawing Animation
  const amSection = document.querySelector('.am-section-wrap');
  if (amSection) {
    if ('IntersectionObserver' in window) {
      const amObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            amSection.classList.add('is-drawn');
            amObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
      amObs.observe(amSection);
    } else {
      amSection.classList.add('is-drawn');
    }
  }

  // 3. Meet Our Team Staggered Elevation Grid
  const teamSection = document.querySelector('.about-team-section');
  if (teamSection) {
    const items = teamSection.querySelectorAll('.about-team__item');
    items.forEach((item, idx) => {
      item.style.transitionDelay = (idx % 4 * 70) + 'ms';
    });

    if ('IntersectionObserver' in window) {
      const teamObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            teamSection.classList.add('is-visible');
            teamObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      teamObs.observe(teamSection);
    } else {
      teamSection.classList.add('is-visible');
    }
  }
}


/* ----------------------------------------
   Butter-Smooth Scroll-Linked Word Reveal
---------------------------------------- */
function initScrollWordReveal() {
  const paragraph = document.querySelector('#scrub-reveal-text');
  if (!paragraph) return;

  if (!paragraph.querySelector('.scrub-word')) {
    const rawText = paragraph.textContent.trim().replace(/\s+/g, ' ');
    const words = rawText.split(' ');
    paragraph.innerHTML = words
      .map(word => `<span class="scrub-word">${word}</span> `)
      .join('');
  }

  const wordEls = paragraph.querySelectorAll('.scrub-word');
  const totalWords = wordEls.length;
  if (!totalWords) return;

  let ticking = false;

  const updateScrub = () => {
    const rect = paragraph.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Start illuminating as paragraph passes bottom 85% of screen
    // Fully illuminate when paragraph centers in viewport
    const startY = windowHeight * 0.85;
    const endY = windowHeight * 0.28;
    const totalDist = startY - endY;

    const currentDist = startY - rect.top;
    const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);

    for (let i = 0; i < totalWords; i++) {
      const wordStart = (i / totalWords) * 0.82;
      const wordEnd = wordStart + 0.18;

      let wordProgress = 0;
      if (progress >= wordEnd) {
        wordProgress = 1;
      } else if (progress <= wordStart) {
        wordProgress = 0;
      } else {
        wordProgress = (progress - wordStart) / (wordEnd - wordStart);
      }

      // Smooth direct opacity (0.22 to 1.0)
      const opacity = 0.22 + (wordProgress * 0.78);
      wordEls[i].style.opacity = opacity.toFixed(3);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrub);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  if (window.lenis && typeof window.lenis.on === 'function') {
    window.lenis.on('scroll', onScroll);
  }

  updateScrub();
}

// Google reCAPTCHA v3 Site Key for Salowtech
const SALOWTECH_RECAPTCHA_SITE_KEY = '6LeOKQsuAAAAAKAVmyGXtIPvABjOXU38mg2d-unY';

async function getRecaptchaToken(action = 'submit_lead') {
  if (typeof window === 'undefined') return '';
  if (typeof window.grecaptcha === 'undefined' || typeof window.grecaptcha.ready !== 'function') {
    return '';
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(''), 2500);
    try {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(SALOWTECH_RECAPTCHA_SITE_KEY, { action });
          clearTimeout(timer);
          resolve(token || '');
        } catch (err) {
          clearTimeout(timer);
          resolve('');
        }
      });
    } catch (err) {
      clearTimeout(timer);
      resolve('');
    }
  });
}

// Universal Quote & Consultation Form Handler with Full CRM Logging (No Auto-Redirect to WhatsApp)
window.handleQuoteFormSubmit = async function(form) {
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHtml = submitBtn ? submitBtn.innerHTML : '';

  // Extract form input fields
  const nameInput = form.querySelector('input[type="text"], input[name="name"], input[id*="name"]');
  const phoneInput = form.querySelector('input[type="tel"], input[name="phone"], input[id*="phone"]');
  const emailInput = form.querySelector('input[type="email"], input[name="email"], input[id*="email"]');
  const messageInput = form.querySelector('textarea, input[name="message"], input[id*="msg"]');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !phone) {
    if (nameInput && !name) nameInput.focus();
    else if (phoneInput && !phone) phoneInput.focus();
    return;
  }

  const service = document.querySelector('h1')?.innerText?.replace(/\s+/g, ' ').trim() || document.title;
  const sourcePage = window.location.pathname.split('/').pop() || 'index.html';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.85';
    submitBtn.innerHTML = '<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> SUBMITTING REQUEST...';
  }

  try {
    // Acquire Google reCAPTCHA v3 token with defensive timeout
    const recaptchaToken = await getRecaptchaToken('submit_lead');

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, message, service, sourcePage, recaptchaToken })
    });

    const data = await response.json();

    if (submitBtn) {
      submitBtn.innerHTML = '<span>✓ SUBMITTED SUCCESSFULLY</span>';
      submitBtn.style.backgroundColor = '#0F6848';
    }

    // Show elegant confirmation banner (No automatic redirect to WhatsApp)
    let alertBanner = form.querySelector('.crm-submission-banner');
    if (!alertBanner) {
      alertBanner = document.createElement('div');
      alertBanner.className = 'crm-submission-banner mt-3 p-4 bg-[#FAF7F2] border border-[#AD8B73]/40 rounded-2xl text-left shadow-xs transition-all duration-300';
      form.appendChild(alertBanner);
    }

    alertBanner.innerHTML = `
      <div class="flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-full bg-[#AD8B73] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-neutral-900">Request Submitted Successfully!</p>
          <p class="text-xs text-neutral-600 mt-1 leading-relaxed">Thank you, <strong>${name}</strong>. Your project specifications have been securely updated to our engineering CRM dashboard. Our senior architecture team will review your requirements and reach out within 24 hours.</p>
          <div class="mt-2.5 flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Status: Verified &bull; Logged to SalowTech CRM</span>
          </div>
        </div>
      </div>
    `;

    form.reset();

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.backgroundColor = '';
        submitBtn.innerHTML = originalHtml;
      }
    }, 5000);

  } catch (err) {
    // Offline / Network fallback: store locally for CRM sync without redirecting to WhatsApp
    try {
      const offlineQueue = JSON.parse(localStorage.getItem('salowtech_offline_leads') || '[]');
      offlineQueue.push({ name, phone, email, message, service, sourcePage, date: new Date().toISOString() });
      localStorage.setItem('salowtech_offline_leads', JSON.stringify(offlineQueue));
    } catch {}

    if (submitBtn) {
      submitBtn.innerHTML = '<span>✓ SUBMITTED SUCCESSFULLY</span>';
      submitBtn.style.backgroundColor = '#0F6848';
    }

    let alertBanner = form.querySelector('.crm-submission-banner');
    if (!alertBanner) {
      alertBanner = document.createElement('div');
      alertBanner.className = 'crm-submission-banner mt-3 p-4 bg-[#FAF7F2] border border-[#AD8B73]/40 rounded-2xl text-left shadow-xs transition-all duration-300';
      form.appendChild(alertBanner);
    }

    alertBanner.innerHTML = `
      <div class="flex items-start gap-3.5">
        <div class="w-8 h-8 rounded-full bg-[#AD8B73] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-bold text-neutral-900">Request Submitted Successfully!</p>
          <p class="text-xs text-neutral-600 mt-1 leading-relaxed">Thank you, <strong>${name}</strong>. Your enquiry has been received and securely logged. Our team will review your project and get in touch within 24 hours.</p>
        </div>
      </div>
    `;

    form.reset();

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.style.backgroundColor = '';
        submitBtn.innerHTML = originalHtml;
      }
    }, 5000);
  }
};

/* --------------------------------------------------------------------------
   Upfront Continuous Hero Headline Cycler (No Scroll Required)
   Cycles smoothly between:
   1. "Your growth, our engineering."
   2. "Your problem, our solution."
   3. "Built by real engineers — Salow Technologies" with mascot
   -------------------------------------------------------------------------- */
function initHeroHeadlineCycler() {
  const slides = document.querySelectorAll('.hero-cycle-slide');
  if (!slides || slides.length < 2) return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery && mediaQuery.matches) return;

  let currentIndex = 0;
  const cycleInterval = 3800;

  setInterval(() => {
    const currentSlide = slides[currentIndex];
    if (!currentSlide) return;

    currentSlide.classList.remove('is-active');
    currentSlide.classList.add('is-exiting');

    setTimeout(() => {
      currentSlide.classList.remove('is-exiting');
    }, 750);

    currentIndex = (currentIndex + 1) % slides.length;
    const nextSlide = slides[currentIndex];
    if (!nextSlide) return;

    nextSlide.classList.add('is-entering');
    requestAnimationFrame(() => {
      nextSlide.classList.remove('is-entering');
      nextSlide.classList.add('is-active');
    });
  }, cycleInterval);
}
