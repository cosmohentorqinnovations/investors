/* ============================================================
   COSMOHENTORQ — Investor Platform Script
   ============================================================ */

(function () {
  'use strict';

  /* ---- QR INTRO ---- */
  const qrIntro = document.getElementById('qrIntro');
  const qrStatus = document.getElementById('qrStatus');
  if (qrIntro) {
    setTimeout(() => {
      if (qrStatus) { qrStatus.textContent = 'Verified'; qrStatus.classList.add('verified'); }
      const svg = qrIntro.querySelector('.qr-svg');
      if (svg) svg.classList.add('qr-verified');
    }, 1400);
    setTimeout(() => {
      qrIntro.classList.add('qr-done');
      setTimeout(() => { qrIntro.style.display = 'none'; }, 700);
    }, 2000);
  }

  /* ---- CURSOR ---- */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');

  document.addEventListener('mousemove', e => {
    const x = e.clientX, y = e.clientY;
    if (cursor)   { cursor.style.left   = x + 'px'; cursor.style.top   = y + 'px'; }
    if (follower) { follower.style.left = x + 'px'; follower.style.top = y + 'px'; }
  }, { passive: true });

  function addHoverCursor(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => { cursor?.classList.add('hover'); follower?.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor?.classList.remove('hover'); follower?.classList.remove('hover'); });
    });
  }
  addHoverCursor('a, button, .faq-question, .curr-btn, .prod-btn, .back-to-top, .report-btn');

  /* ---- PARTICLES — throttled to 20fps, pauses on blur ---- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4 || isMobile;
    const COUNT = isLowEnd ? 20 : 40;
    const FRAME_MS = 1000 / 20;
    let w, h, particles = [], raf, lastFrame = 0;

    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function mkP() {
      return {
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        dx: (Math.random() - 0.5) * 0.18,
        dy: (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.45 + 0.08,
        color: Math.random() < 0.94 ? '255,255,255' : '0,212,255'
      };
    }
    for (let i = 0; i < COUNT; i++) particles.push(mkP());

    function drawParticles(now) {
      raf = requestAnimationFrame(drawParticles);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < -2) p.x = w + 2; else if (p.x > w + 2) p.x = -2;
        if (p.y < -2) p.y = h + 2; else if (p.y > h + 2) p.y = -2;
      }
    }
    raf = requestAnimationFrame(drawParticles);

    const pause  = () => cancelAnimationFrame(raf);
    const resume = () => { lastFrame = 0; raf = requestAnimationFrame(drawParticles); };
    document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());
    window.addEventListener('blur',  pause,  { passive: true });
    window.addEventListener('focus', resume, { passive: true });
  }

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 60);
    backToTop?.classList.toggle('visible', y > 400);
    updateActiveNav();
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  toggle?.addEventListener('click', () => { toggle.classList.toggle('open'); navLinks?.classList.toggle('open'); });
  navLinks?.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { toggle?.classList.remove('open'); navLinks.classList.remove('open'); }));

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(sec => {
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
    });
  }

  /* ---- SCROLL REVEAL ---- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay || 0));
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

  /* ---- HERO MOUSE GLOW ---- */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const r = heroSection.getBoundingClientRect();
      heroSection.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      heroSection.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* ---- FAQ ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-answer').style.maxHeight = item.querySelector('.faq-answer').scrollHeight + 'px';
      }
    });
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ====================================================
     MARKET CHART
     ==================================================== */
  function drawMarketChart() {
    const svg = document.getElementById('marketChart');
    if (!svg) return;

    const W = 820, H = 260;
    const PT = 30, PB = 40, PL = 50, PR = 110;
    const cW = W - PL - PR, cH = H - PT - PB;

    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const globalAI = [0.9, 1.3, 2.0, 3.2, 4.9, 7.2, 10.8];  // $B India AI market
    const cosmoARR = [0, 0, 0.03, 0.15, 0.5, 1.5, 4.0];      // ₹Cr (base case)

    const maxG = Math.max(...globalAI);
    const maxC = Math.max(...cosmoARR);

    const xScale = (i) => PL + (i / (years.length - 1)) * cW;
    const yScaleG = (v) => PT + cH - (v / maxG) * cH;
    const yScaleC = (v) => PT + cH - (v / maxC) * cH;

    let out = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" overflow="visible">`;

    // Grid
    for (let i = 0; i <= 4; i++) {
      const y = PT + (i / 4) * cH;
      out += `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
    }

    // Paths
    function makePath(data, scale) {
      return data.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${scale(v).toFixed(1)}`).join(' ');
    }

    // India AI market — solid cyan
    out += `<path d="${makePath(globalAI, yScaleG)}" fill="none" stroke="#00d4ff" stroke-width="2" stroke-linejoin="round"/>`;

    // Cosmohentorq ARR — dashed white
    out += `<path d="${makePath(cosmoARR, yScaleC)}" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" stroke-dasharray="5 3" stroke-linejoin="round"/>`;

    // Dots + labels — India AI (labels only at 2024 and 2030, well-separated)
    globalAI.forEach((v, i) => {
      const x = xScale(i), y = yScaleG(v);
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#00d4ff"/>`;
      if (i === 0) {
        // First point: label below-right
        out += `<text x="${(x + 7).toFixed(1)}" y="${(y + 14).toFixed(1)}" fill="rgba(0,212,255,0.8)" font-size="9" font-family="Inter,sans-serif" text-anchor="start">$${v}B</text>`;
      } else if (i === years.length - 1) {
        // Last point: label above the dot, shifted right into padding
        out += `<text x="${(x + 7).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="rgba(0,212,255,0.85)" font-size="9" font-family="Inter,sans-serif" text-anchor="start">$${v}B</text>`;
      }
    });

    // Dots + labels — Cosmo ARR (label only at last point, placed below India AI label)
    cosmoARR.forEach((v, i) => {
      if (v === 0) return;
      const x = xScale(i), y = yScaleC(v);
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="rgba(255,255,255,0.5)"/>`;
      if (i === years.length - 1) {
        // Place label below the India AI label so they don't collide
        out += `<text x="${(x + 7).toFixed(1)}" y="${(y + 16).toFixed(1)}" fill="rgba(255,255,255,0.45)" font-size="9" font-family="Inter,sans-serif" text-anchor="start">₹${v}Cr</text>`;
      }
    });

    // X axis labels
    years.forEach((yr, i) => {
      out += `<text x="${xScale(i).toFixed(1)}" y="${H - 6}" fill="rgba(255,255,255,0.3)" font-size="10" font-family="Inter,sans-serif" text-anchor="middle">${yr}</text>`;
    });

    // Axis labels
    out += `<text x="${PL - 8}" y="${PT + cH / 2}" fill="rgba(0,212,255,0.5)" font-size="8" font-family="Inter,sans-serif" text-anchor="middle" transform="rotate(-90,${PL-8},${PT + cH/2})">India AI $B</text>`;
    out += `<text x="${W - PR + 60}" y="${PT + cH / 2}" fill="rgba(255,255,255,0.25)" font-size="8" font-family="Inter,sans-serif" text-anchor="middle" transform="rotate(90,${W-PR+60},${PT + cH/2})">COSMO ₹Cr</text>`;

    out += '</svg>';
    svg.outerHTML = out;
  }
  drawMarketChart();

  /* ====================================================
     CURRENCY & FORM CONTROLS
     ==================================================== */
  const FX = { INR: 1, USD: 83, EUR: 90, GBP: 105, JPY: 0.55, AED: 22.6, AUD: 54, CAD: 61, SGD: 62 };
  const FX_SYM = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'د', AUD: 'A$', CAD: 'C$', SGD: 'S$' };
  let selectedCurrency = 'INR';

  document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCurrency = btn.dataset.curr;
      const label = document.getElementById('currLabel');
      if (label) label.textContent = selectedCurrency;
    });
  });

  document.querySelectorAll('.prod-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });

  /* ====================================================
     SIMULATION — LOADING ANIMATION
     ==================================================== */
  const LOADING_STEPS = [
    'Analyzing market conditions...',
    'Modeling company growth scenarios...',
    'Calculating capital deployment...',
    'Running probability analysis...',
    'Compiling investor report...'
  ];

  function runLoadingSequence(callback) {
    const form    = document.querySelector('.explorer-form');
    const loading = document.getElementById('simLoading');
    const results = document.getElementById('simResults');
    const stepEl  = document.getElementById('simLoadingStep');
    const barEl   = document.getElementById('simLoadingBar');

    if (results) results.style.display = 'none';
    if (form) form.style.display = 'none';
    if (loading) loading.style.display = 'flex';
    if (barEl) barEl.style.width = '0%';

    let i = 0;
    const totalDuration = 3200;
    const stepDuration = totalDuration / LOADING_STEPS.length;

    function nextStep() {
      if (i >= LOADING_STEPS.length) {
        setTimeout(() => {
          if (loading) loading.style.display = 'none';
          callback();
        }, 300);
        return;
      }
      if (stepEl) { stepEl.style.opacity = '0'; setTimeout(() => { stepEl.textContent = LOADING_STEPS[i]; stepEl.style.opacity = '1'; }, 200); }
      if (barEl) { setTimeout(() => { barEl.style.width = ((i + 1) / LOADING_STEPS.length * 100) + '%'; }, 100); }
      i++;
      setTimeout(nextStep, stepDuration);
    }
    nextStep();
  }

  /* ====================================================
     SIMULATION ENGINE — Investor Return Focused
     ==================================================== */

  // Return multipliers on invested capital at each year milestone
  // These represent estimated value of investor's stake at that point in time
  // Assumes a liquidity event occurs at the stated timeline — not guaranteed
  const RETURN_SCENARIOS = {
    exceptional: {
      name: 'Exceptional Return',
      prob: 10,
      probLabel: '10% probability',
      mult:  { 0:1, 1:1, 2:1.3, 3:2, 5:5, 7:12, 10:22, 15:38 },
      returnLabel: '15x–40x — Major outcome',
      breakeven: 'Year 3–4 (on exit event)',
      liquidity: '10–15 years (IPO or major acquisition)',
      caveat: 'Company becomes the dominant AI platform for Indian enterprises and expands globally. Capital locked in for 10–15 years minimum.',
      highlight: false, isFail: false
    },
    growth: {
      name: 'Moderate Growth',
      prob: 30,
      probLabel: '30% probability',
      mult:  { 0:1, 1:0.9, 2:0.95, 3:1.2, 4:1.6, 5:2.2, 7:3.5, 10:5, 15:7 },
      returnLabel: '3x–6x — Meaningful return',
      breakeven: 'Year 5–6 (on exit event)',
      liquidity: '8–12 years (strategic acquisition or secondary)',
      caveat: 'Company achieves product-market fit, grows revenue, attracts institutional investors. Returns 3–6x on a successful exit. Capital locked in for 8–12 years.',
      highlight: true, isFail: false
    },
    survive: {
      name: 'Survive / Partial Return',
      prob: 35,
      probLabel: '35% probability',
      mult:  { 0:1, 1:0.9, 2:0.85, 3:0.9, 5:1.1, 7:1.3, 10:1.6, 15:1.8 },
      returnLabel: '0.8x–1.8x — Low return',
      breakeven: 'Year 6–8 (partial recovery)',
      liquidity: '7–10 years (if any exit event)',
      caveat: 'Company survives, grows slowly, but does not achieve a major exit. Capital may partially recover over a long period.',
      highlight: false, isFail: false
    },
    fail: {
      name: 'Total Loss',
      prob: 25,
      probLabel: '25% probability',
      mult:  { 0:1, 1:0.65, 2:0.30, 3:0.05, 4:0, 5:0, 7:0, 10:0, 15:0 },
      returnLabel: '0x — Write-off',
      breakeven: 'Never',
      liquidity: '3–5 years (write-off)',
      caveat: 'Company fails to generate commercial revenue and shuts down. Capital is not recoverable. This is a real risk in early-stage investing.',
      highlight: false, isFail: true
    }
  };

  function getReturnMult(scenario, yr) {
    const m = scenario.mult;
    const keys = Object.keys(m).map(Number).sort((a, b) => a - b);
    if (yr <= 0) return m[0] || 1;
    if (yr >= keys[keys.length - 1]) return m[keys[keys.length - 1]];
    for (let i = 0; i < keys.length - 1; i++) {
      if (yr >= keys[i] && yr <= keys[i + 1]) {
        const t = (yr - keys[i]) / (keys[i + 1] - keys[i]);
        return m[keys[i]] + t * (m[keys[i + 1]] - m[keys[i]]);
      }
    }
    return 0;
  }

  function fmtINR(amt) {
    if (amt <= 0) return '₹0';
    if (amt >= 10000000) return '₹' + (amt / 10000000).toFixed(1) + 'Cr';
    if (amt >= 100000)   return '₹' + (amt / 100000).toFixed(1) + 'L';
    if (amt >= 1000)     return '₹' + (amt / 1000).toFixed(1) + 'K';
    return '₹' + Math.round(amt).toLocaleString('en-IN');
  }

  const CAP_DEPLOY = [
    { label: 'Product R&D',           pct: 35 },
    { label: 'Team & Talent',         pct: 30 },
    { label: 'AI Infra & Compute',    pct: 15 },
    { label: 'Sales & GTM',           pct: 15 },
    { label: 'Legal & Operations',    pct: 5  }
  ];

  /* ---- UTILITY: CAGR & BREAKEVEN ---- */
  function calcCAGR(amountINR, returnAmt, years) {
    if (!returnAmt || returnAmt <= 0 || years <= 0) return null;
    return (Math.pow(returnAmt / amountINR, 1 / years) - 1) * 100;
  }

  function fmtCAGR(cagr) {
    if (cagr === null) return '—';
    if (cagr < -90) return '−100%';
    return (cagr >= 0 ? '+' : '') + cagr.toFixed(1) + '% p.a.';
  }

  function calcBreakevenYear(amountINR) {
    for (let yr = 0; yr <= 15; yr += 0.5) {
      const ev = Object.values(activeScenarios()).reduce((acc, sc) => {
        return acc + (sc.prob / 100) * getReturnMult(sc, yr) * amountINR;
      }, 0);
      if (ev >= amountINR) return yr;
    }
    return null;
  }

  /* ---- SENSITIVITY / GROWTH FACTOR ---- */
  let sensitivityGF = 1.0;

  function computeGrowthFactor() {
    const arpu  = parseFloat(document.getElementById('sliderARPU')?.value  || 150000);
    const cust  = parseFloat(document.getElementById('sliderCust')?.value  || 8);
    const churn = parseFloat(document.getElementById('sliderChurn')?.value || 15);
    const arpuBase = 150000, custBase = 8, churnBase = 15;
    const gfARPU  = arpu / arpuBase;
    const gfCust  = cust / custBase;
    const gfChurn = churnBase / churn;  // lower churn = higher factor
    const gf = (gfARPU * gfCust * gfChurn);
    return Math.max(0.2, Math.min(3.0, gf));
  }

  function activeScenarios() {
    if (sensitivityGF === 1.0) return RETURN_SCENARIOS;
    const adj = {};
    Object.entries(RETURN_SCENARIOS).forEach(([key, sc]) => {
      if (sc.isFail) { adj[key] = sc; return; }
      const newMult = {};
      Object.entries(sc.mult).forEach(([yr, m]) => {
        newMult[yr] = m > 1 ? 1 + (m - 1) * sensitivityGF : m;
      });
      adj[key] = { ...sc, mult: newMult };
    });
    return adj;
  }

  /* ---- LOCALSTORAGE SAVE / LOAD ---- */
  function saveFormToStorage() {
    try {
      localStorage.setItem('cosmo_sim_form', JSON.stringify({
        name:     document.getElementById('inv_name')?.value || '',
        country:  document.getElementById('inv_country')?.value || '',
        email:    document.getElementById('inv_email')?.value || '',
        phone:    document.getElementById('inv_phone')?.value || '',
        amtRaw:   document.getElementById('inv_amount')?.value || '',
        horizon:  document.getElementById('inv_horizon')?.value || '3',
        currency: selectedCurrency
      }));
    } catch(e) {}
  }

  function loadFormFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem('cosmo_sim_form') || '{}');
      if (!saved.name) return;
      if (saved.name)    document.getElementById('inv_name').value    = saved.name;
      if (saved.country) document.getElementById('inv_country').value = saved.country;
      if (saved.email)   document.getElementById('inv_email').value   = saved.email;
      if (saved.phone)   document.getElementById('inv_phone').value   = saved.phone;
      if (saved.amtRaw)  document.getElementById('inv_amount').value  = saved.amtRaw;
      if (saved.horizon) document.getElementById('inv_horizon').value = saved.horizon;
      if (saved.currency) {
        selectedCurrency = saved.currency;
        document.querySelectorAll('.curr-btn').forEach(b => b.classList.toggle('active', b.dataset.curr === saved.currency));
        const label = document.getElementById('currLabel');
        if (label) label.textContent = saved.currency;
      }
      const notice = document.getElementById('formSavedNotice');
      if (notice) notice.style.display = 'flex';
    } catch(e) {}
  }

  /* ---- YEAR-BY-YEAR TABLE ---- */
  function buildYoyTable(amountINR, horizon) {
    const scenarios = activeScenarios();
    const maxYr = Math.min(horizon, 15);
    const step = maxYr <= 5 ? 1 : maxYr <= 10 ? 1 : 2;
    const years = [];
    for (let y = 0; y <= maxYr; y += step) years.push(y);
    if (years[years.length - 1] !== maxYr) years.push(maxYr);

    let html = `<table class="yoy-table">
      <thead><tr>
        <th>Year</th>
        <th class="yoy-exceptional">Exceptional (10%)</th>
        <th class="yoy-growth">Growth (30%)</th>
        <th class="yoy-survive">Survive (35%)</th>
        <th class="yoy-fail">Total Loss (25%)</th>
        <th>Expected Value</th>
      </tr></thead><tbody>`;

    years.forEach(yr => {
      const exc = getReturnMult(scenarios.exceptional, yr) * amountINR;
      const grw = getReturnMult(scenarios.growth,      yr) * amountINR;
      const srv = getReturnMult(scenarios.survive,     yr) * amountINR;
      const fai = getReturnMult(scenarios.fail,        yr) * amountINR;
      const ev  = Object.values(scenarios).reduce((acc, sc) => acc + (sc.prob / 100) * getReturnMult(sc, yr) * amountINR, 0);
      const isHorizon = yr === maxYr;
      html += `<tr class="${isHorizon ? 'yoy-highlight' : ''}">
        <td>Yr ${yr}</td>
        <td class="yoy-exceptional">${fmtINR(exc)}</td>
        <td class="yoy-growth">${fmtINR(grw)}</td>
        <td class="yoy-survive">${fmtINR(srv)}</td>
        <td class="yoy-fail">${fai <= 0 ? '₹0' : fmtINR(fai)}</td>
        <td>${fmtINR(ev)}</td>
      </tr>`;
    });

    html += `</tbody></table><p class="yoy-note">All values are estimated portfolio value at that year — assumes a liquidity event exists at that point. Not guaranteed.</p>`;
    return html;
  }

  let lastSimData = null;

  function runSimulation() {
    const name    = document.getElementById('inv_name')?.value.trim() || 'Unnamed';
    const country = document.getElementById('inv_country')?.value || 'India';
    const amtRaw  = parseFloat(document.getElementById('inv_amount')?.value || 0);
    const horizon = parseInt(document.getElementById('inv_horizon')?.value || 3);
    const email   = document.getElementById('inv_email')?.value.trim() || '';
    const phone   = document.getElementById('inv_phone')?.value.trim() || '';

    if (!amtRaw || amtRaw <= 0) { alert('Please enter an amount to simulate.'); return; }

    sensitivityGF = computeGrowthFactor();

    const amountINR  = amtRaw * FX[selectedCurrency];
    const focusAreas = [...document.querySelectorAll('.prod-btn.active')].map(b => b.dataset.prod).join(', ') || 'General';
    const simRef     = 'COSMO-' + Date.now().toString(36).toUpperCase();
    const simDate    = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    lastSimData = { name, country, email, phone, amtRaw, selectedCurrency, amountINR, horizon, focusAreas, simRef, simDate, gf: sensitivityGF };

    saveFormToStorage();
    runLoadingSequence(() => renderSimResults(lastSimData));
  }

  function renderSimResults(d) {
    const results = document.getElementById('simResults');
    if (!results) return;

    const scenarios = activeScenarios();

    document.getElementById('simRef').textContent = d.simRef;
    document.getElementById('simDate').textContent = 'Generated: ' + d.simDate;

    // Capital summary
    const capSum = document.getElementById('capSummary');
    const amtDisplay = FX_SYM[d.selectedCurrency] + d.amtRaw.toLocaleString();
    const inrDisplay = d.selectedCurrency !== 'INR' ? ` (≈ ${fmtINR(d.amountINR)} INR)` : '';
    // Expected value: weighted sum across active scenarios
    const ev = Object.values(scenarios).reduce((acc, sc) => {
      return acc + (sc.prob / 100) * getReturnMult(sc, d.horizon) * d.amountINR;
    }, 0);
    const evMult = (ev / d.amountINR).toFixed(2);
    const gfNote = d.gf && d.gf !== 1.0 ? ` · Sensitivity GF: ${d.gf.toFixed(2)}×` : '';
    if (capSum) {
      capSum.innerHTML = `
        <div class="cap-sum-row">
          <div class="cap-sum-item">
            <div class="cap-sum-label">Your Capital</div>
            <div class="cap-sum-val">${amtDisplay}${inrDisplay}</div>
          </div>
          <div class="cap-sum-item">
            <div class="cap-sum-label">Time Horizon</div>
            <div class="cap-sum-val">${d.horizon} Year${d.horizon > 1 ? 's' : ''}</div>
          </div>
          <div class="cap-sum-item">
            <div class="cap-sum-label">Profit Probability</div>
            <div class="cap-sum-val cap-sum-ev">40% (10% exceptional + 30% growth)</div>
          </div>
          <div class="cap-sum-item">
            <div class="cap-sum-label">Statistical Expected Value</div>
            <div class="cap-sum-val cap-sum-ev">${fmtINR(ev)} <span class="ev-mult">${evMult}x over ${d.horizon}yr${gfNote}</span></div>
          </div>
        </div>
        <p class="cap-sum-note">Four scenarios are modelled below — from exceptional returns to total loss. A 25% chance of total loss is real. A 40% chance of meaningful profit is also real. These are educational estimates, not guarantees.</p>
      `;
    }

    // Breakeven indicator
    const beEl = document.getElementById('breakevenStrip');
    if (beEl) {
      const beYr = calcBreakevenYear(d.amountINR);
      if (beYr !== null) {
        beEl.innerHTML = `<div class="breakeven-strip">
          <div class="breakeven-dot"></div>
          <div class="breakeven-text">Statistical weighted breakeven: <strong>Year ${beYr.toFixed(1)}</strong> — the year when the probability-weighted expected value crosses your original capital. This does not mean every scenario has broken even by then.</div>
        </div>`;
      } else {
        beEl.innerHTML = `<div class="breakeven-strip">
          <div class="breakeven-dot" style="background:rgba(255,255,255,0.3);"></div>
          <div class="breakeven-text">Statistical weighted breakeven: <strong>beyond Year 15</strong> in current assumptions. This reflects the weight of the 25% total-loss scenario on the expected value.</div>
        </div>`;
      }
    }

    // Risk distribution bar — fully driven from RETURN_SCENARIOS
    const riskDist = document.getElementById('riskDist');
    if (riskDist) {
      const segClasses = { exceptional: 'risk-best', growth: 'risk-grow', survive: 'risk-slow', fail: 'risk-fail' };
      const segs = Object.entries(RETURN_SCENARIOS).map(([key, sc]) =>
        `<div class="risk-seg ${segClasses[key]}" style="width:${sc.prob}%" title="${sc.prob}% — ${sc.name}"></div>`
      ).join('');
      const labels = Object.entries(RETURN_SCENARIOS).map(([key, sc]) =>
        `<span class="rbl rbl-${key.replace('exceptional','best').replace('growth','grow').replace('survive','slow').replace('fail','fail')}">${sc.prob}% ${sc.name}</span>`
      ).join('');
      const profitPct = Object.values(RETURN_SCENARIOS).filter(s => !s.isFail && s.name !== 'Survive / Partial Return').reduce((a, s) => a + s.prob, 0);
      riskDist.innerHTML = `
        <h4>Probability Distribution</h4>
        <p class="cap-subtitle">Scenario probabilities used in this simulation. Based on early-stage deeptech startup benchmarks.</p>
        <div class="risk-bar-wrap">
          <div class="risk-bar">${segs}</div>
          <div class="risk-bar-labels">${labels}</div>
        </div>
        <p class="risk-note">${profitPct}% probability of meaningful profit. ${RETURN_SCENARIOS.fail.prob}% probability of total loss. These are modelled estimates — not a prediction specific to Cosmohentorq.</p>
      `;
    }

    // Scenarios (investor returns)
    const grid = document.getElementById('scenariosGrid');
    if (grid) {
      grid.innerHTML = Object.entries(scenarios).map(([key, sc]) => {
        const returnAmt = getReturnMult(sc, d.horizon) * d.amountINR;
        const gain = returnAmt - d.amountINR;
        const gainLabel = sc.isFail ? 'Loss: ' + fmtINR(d.amountINR) + ' (full)'
                        : gain >= 0 ? 'Gain: +' + fmtINR(gain)
                        :             'Loss: ' + fmtINR(Math.abs(gain));
        const multAtHorizon = getReturnMult(sc, d.horizon).toFixed(2);
        const cagr = sc.isFail ? null : calcCAGR(d.amountINR, returnAmt, d.horizon);
        const cagrStr = sc.isFail ? '−100% p.a.' : fmtCAGR(cagr);
        const cagrClass = (cagr !== null && cagr < 0) ? 'cagr-neg' : '';
        return `<div class="scenario-card glass-card ${sc.highlight ? 'sc-best' : ''} ${sc.isFail ? 'sc-fail' : ''}">
          <div class="sc-header">
            <span class="sc-name">${sc.name}</span>
            <span class="sc-prob ${sc.isFail ? 'sc-prob-fail' : ''}">${sc.probLabel}</span>
          </div>
          <div class="sc-body">
            <div class="sc-metric sc-metric-main">
              <span class="sc-metric-label">You could receive</span>
              <span class="sc-metric-val sc-val-main">${sc.isFail ? '₹0' : fmtINR(returnAmt)}</span>
            </div>
            <div class="sc-metric">
              <span class="sc-metric-label">On ${fmtINR(d.amountINR)} invested</span>
              <span class="sc-metric-val ${gain >= 0 && !sc.isFail ? 'sc-val-gain' : 'sc-val-loss'}">${gainLabel}</span>
            </div>
            <div class="sc-metric">
              <span class="sc-metric-label">Return multiple</span>
              <span class="sc-metric-val">${sc.isFail ? '0x' : multAtHorizon + 'x'}</span>
            </div>
            <div class="sc-metric">
              <span class="sc-metric-label">Break-even point</span>
              <span class="sc-metric-val">${sc.breakeven}</span>
            </div>
            <div class="sc-metric">
              <span class="sc-metric-label">When you get money back</span>
              <span class="sc-metric-val">${sc.liquidity}</span>
            </div>
            <div class="sc-cagr-row">
              <span class="sc-cagr-label">Implied CAGR over ${d.horizon}yr</span>
              <span class="sc-cagr-val ${cagrClass}">${cagrStr}</span>
            </div>
          </div>
          <p class="sc-caveat">${sc.caveat}</p>
        </div>`;
      }).join('');
    }

    // Chart (Monte Carlo)
    drawSimChart(d.amountINR, d.horizon);
    buildSimLegend(d.amountINR, d.horizon);

    // Year-by-year table (hidden, toggled by button)
    const yoyWrap = document.getElementById('yoyTableWrap');
    if (yoyWrap) yoyWrap.innerHTML = buildYoyTable(d.amountINR, d.horizon);

    // Comparison table
    const cmpEl = document.getElementById('altCompareRows');
    if (cmpEl) {
      const yr = d.horizon;
      const amt = d.amountINR;
      const fd       = amt * Math.pow(1.07, yr);
      const nifty    = amt * Math.pow(1.13, yr);
      const ppf      = amt * Math.pow(1.071, yr);
      const cosmoBase = getReturnMult(scenarios.growth, yr) * amt;
      const cosmoEV   = ev;
      // Post-tax on cosmoBase growth case (20% LTCG on unlisted, if yr >= 2)
      const gain = cosmoBase - amt;
      const cosmoPostTax = yr >= 2 && gain > 0 ? cosmoBase - gain * 0.20 : cosmoBase;
      const rows = [
        { name: 'Fixed Deposit (7% p.a.)',        val: fd,           note: 'Guaranteed return. DICGC insured up to ₹5L.', guaranteed: true,  extra: '' },
        { name: 'PPF (7.1% p.a.)',                val: ppf,          note: '15-year lock-in. Tax-free. Government-backed.', guaranteed: true, extra: '' },
        { name: 'Nifty 50 Index Fund (13% est.)', val: nifty,        note: 'Market risk. Historical average. Not guaranteed.', guaranteed: false, extra: '' },
        { name: 'Cosmohentorq — Growth Case (30%)', val: cosmoBase,  note: 'Only if company achieves growth scenario AND exit event occurs. Illiquid.', guaranteed: false, extra: '' },
        { name: 'Cosmohentorq — Growth (post 20% LTCG)', val: cosmoPostTax, note: `After ${yr >= 2 ? '20% Long-Term Capital Gains tax on unlisted shares (applicable in India, with indexation)' : 'holding period too short for LTCG'}.`, guaranteed: false, extra: 'posttax' },
        { name: 'Cosmohentorq — Statistical EV',  val: cosmoEV,      note: 'Weighted average across all 4 scenarios including 25% total loss. Not a prediction.', guaranteed: false, extra: '' }
      ];
      cmpEl.innerHTML = rows.map((r, i) => `
        <div class="cmp-row ${i < 2 ? 'cmp-safe' : ''} ${r.extra === 'posttax' ? 'cmp-posttax' : ''}">
          <div class="cmp-name">${r.name} ${r.guaranteed ? '<span class="cmp-tag-safe">Guaranteed</span>' : ''} ${r.extra === 'posttax' ? '<span class="cmp-tag-tax">Post-tax</span>' : ''}</div>
          <div class="cmp-val">${fmtINR(r.val)}</div>
          <div class="cmp-note">${r.note}</div>
        </div>
      `).join('');
    }

    // Dilution toggle setup
    const dilCheck = document.getElementById('dilutionToggle');
    const dilRes   = document.getElementById('dilutionResult');
    if (dilCheck && dilRes) {
      const updateDilution = () => {
        if (!dilCheck.checked) { dilRes.style.display = 'none'; return; }
        // Series A: 20% dilution, Series B: 15% dilution on already-diluted stake
        const effectiveStake = (1 - 0.20) * (1 - 0.15); // 68% of original
        const growthRet   = getReturnMult(scenarios.growth, d.horizon) * d.amountINR;
        const excRet      = getReturnMult(scenarios.exceptional, d.horizon) * d.amountINR;
        const adjGrowth   = d.amountINR + (growthRet - d.amountINR) * effectiveStake;
        const adjExc      = d.amountINR + (excRet - d.amountINR) * effectiveStake;
        dilRes.style.display = '';
        dilRes.innerHTML = `
          <strong>After two future funding rounds (Series A 20% + Series B 15%):</strong><br>
          Your stake dilutes to <strong>${(effectiveStake * 100).toFixed(0)}%</strong> of its original size.<br>
          Gains are reduced proportionally — you still own your original investment, but your share of upside shrinks.<br>
          <table class="dilution-table" style="margin-top:12px;">
            <tr><td>Growth case (undiluted)</td><td>${fmtINR(growthRet)}</td></tr>
            <tr><td>Growth case (post-dilution)</td><td>${fmtINR(adjGrowth)}</td></tr>
            <tr><td>Exceptional (undiluted)</td><td>${fmtINR(excRet)}</td></tr>
            <tr><td>Exceptional (post-dilution)</td><td>${fmtINR(adjExc)}</td></tr>
          </table>
          <p style="font-size:0.72rem; color:var(--text-muted); margin-top:8px; font-style:italic;">Anti-dilution provisions may protect early investors in some structures. This is a simplified model — seek legal advice.</p>
        `;
      };
      dilCheck.addEventListener('change', updateDilution);
      updateDilution();
    }

    // Capital deployment
    const capEl = document.getElementById('capDeployBars');
    if (capEl) {
      capEl.innerHTML = CAP_DEPLOY.map(c => {
        const amt = d.amountINR * c.pct / 100;
        return `<div class="cap-bar-row">
          <span class="cap-bar-label">${c.label}</span>
          <div class="cap-bar-track"><div class="cap-bar-fill" style="width:${c.pct}%"></div></div>
          <span class="cap-bar-amt">${c.pct}% · ${fmtINR(amt)}</span>
        </div>`;
      }).join('');
    }

    results.style.display = 'flex';
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ====================================================
     SIM CHART — Monte Carlo fan + 4 scenario lines
     ==================================================== */
  function drawSimChart(amountINR, horizon) {
    const svgEl = document.getElementById('simChart');
    if (!svgEl) return;

    const W = 820, H = 240;
    const PT = 20, PB = 36, PL = 72, PR = 110;
    const cW = W - PL - PR, cH = H - PT - PB;
    const maxYr = Math.min(horizon, 15);
    const step = maxYr <= 5 ? 1 : 2;
    const years = [];
    for (let y = 0; y <= maxYr; y += step) years.push(y);
    if (years[years.length - 1] !== maxYr) years.push(maxYr);

    const scenarios = activeScenarios();
    const lines = [
      { sc: scenarios.exceptional, stroke: 'rgba(255,255,255,0.7)',  dash: '2 2',  key: 'exceptional' },
      { sc: scenarios.growth,      stroke: 'rgba(255,255,255,0.95)', dash: '',     key: 'growth'      },
      { sc: scenarios.survive,     stroke: 'rgba(255,255,255,0.35)', dash: '5 3',  key: 'survive'     },
      { sc: scenarios.fail,        stroke: 'rgba(255,255,255,0.15)', dash: '3 3',  key: 'fail'        }
    ];

    const maxVal = Math.max(...lines.map(l => getReturnMult(l.sc, maxYr) * amountINR), amountINR);
    const xScale = yr => PL + (yr / maxYr) * cW;
    const yScale = v  => PT + cH - Math.min(Math.max(v, 0) / maxVal, 1) * cH;

    // Seeded pseudo-random (reproducible chart)
    let seed = 42;
    const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

    let out = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" overflow="visible">`;

    // Grid + Y labels
    for (let i = 0; i <= 4; i++) {
      const yp = PT + (i / 4) * cH;
      const val = maxVal * (1 - i / 4);
      out += `<line x1="${PL}" y1="${yp.toFixed(1)}" x2="${W - PR}" y2="${yp.toFixed(1)}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
      out += `<text x="${PL - 6}" y="${(yp + 4).toFixed(1)}" fill="rgba(255,255,255,0.22)" font-size="9" font-family="Inter,sans-serif" text-anchor="end">${fmtINR(val)}</text>`;
    }

    // Monte Carlo fan — 200 paths, 50 per scenario
    lines.forEach(line => {
      const noiseLevel = line.key === 'fail' ? 0.2 : 0.35;
      for (let p = 0; p < 50; p++) {
        const noiseSeed = rng();
        const pts = years.map((yr, i) => {
          const base = getReturnMult(line.sc, yr) * amountINR;
          const noise = 1 + (rng() - 0.5) * 2 * noiseLevel * (yr / maxYr);
          const val = Math.max(0, base * noise);
          return `${i === 0 ? 'M' : 'L'}${xScale(yr).toFixed(1)},${yScale(val).toFixed(1)}`;
        }).join(' ');
        const alphaBase = line.key === 'growth' ? 0.06 : line.key === 'exceptional' ? 0.05 : 0.04;
        out += `<path d="${pts}" fill="none" stroke="${line.stroke}" stroke-width="1" opacity="${alphaBase}" stroke-linejoin="round"/>`;
      }
    });

    // Baseline
    const baseY = yScale(amountINR);
    out += `<line x1="${PL}" y1="${baseY.toFixed(1)}" x2="${W - PR}" y2="${baseY.toFixed(1)}" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="6 4"/>`;
    out += `<text x="${(W - PR + 6).toFixed(1)}" y="${(baseY + 4).toFixed(1)}" fill="rgba(255,255,255,0.3)" font-size="8" font-family="Inter,sans-serif" text-anchor="start">Capital</text>`;

    // Main scenario lines
    const endYOffsets = { fail: 0, survive: 14, growth: -10, exceptional: -24 };
    lines.forEach(line => {
      const pts = years.map((yr, i) => {
        const val = getReturnMult(line.sc, yr) * amountINR;
        return `${i === 0 ? 'M' : 'L'}${xScale(yr).toFixed(1)},${yScale(val).toFixed(1)}`;
      }).join(' ');
      out += `<path d="${pts}" fill="none" stroke="${line.stroke}" stroke-width="2" stroke-dasharray="${line.dash}" stroke-linejoin="round"/>`;

      const lastX = xScale(maxYr);
      const lastVal = getReturnMult(line.sc, maxYr) * amountINR;
      const lastY = yScale(lastVal);
      const yOff = endYOffsets[line.key] || 0;
      out += `<circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="3" fill="${line.stroke}"/>`;
      out += `<text x="${(lastX + 8).toFixed(1)}" y="${(lastY + 4 + yOff).toFixed(1)}" fill="${line.stroke}" font-size="9" font-family="Inter,sans-serif" text-anchor="start">${fmtINR(lastVal)}</text>`;
    });

    // X axis
    years.forEach(yr => {
      out += `<text x="${xScale(yr).toFixed(1)}" y="${H - 4}" fill="rgba(255,255,255,0.25)" font-size="9" font-family="Inter,sans-serif" text-anchor="middle">Yr ${yr}</text>`;
    });

    out += '</svg>';
    svgEl.outerHTML = out;
  }

  function buildSimLegend(amountINR, horizon) {
    const el = document.getElementById('simChartLegend');
    if (!el) return;
    const scenarios = activeScenarios();
    const items = [
      { sc: scenarios.exceptional, color: 'rgba(255,255,255,0.7)'  },
      { sc: scenarios.growth,      color: 'rgba(255,255,255,0.9)'  },
      { sc: scenarios.survive,     color: 'rgba(255,255,255,0.35)' },
      { sc: scenarios.fail,        color: 'rgba(255,255,255,0.15)' }
    ];
    const cagrParts = items.map(it => {
      const retAmt = getReturnMult(it.sc, horizon) * amountINR;
      const cagr = it.sc.isFail ? null : calcCAGR(amountINR, retAmt, horizon);
      const cagrStr = it.sc.isFail ? '−100%' : fmtCAGR(cagr);
      return `<div class="sim-legend-item"><div class="sim-legend-dot" style="background:${it.color}"></div>${it.sc.name} — ${fmtINR(retAmt)} · CAGR ${cagrStr}</div>`;
    });
    el.innerHTML = cagrParts.join('');
  }

  /* ====================================================
     RUN BUTTON
     ==================================================== */
  document.getElementById('runSimBtn')?.addEventListener('click', runSimulation);

  /* ====================================================
     REPORT: PDF — DARK INVESTOR NOTE
     ==================================================== */
  document.getElementById('pdfBtn')?.addEventListener('click', () => {
    if (!lastSimData) return;
    const d = lastSimData;
    const amtDisplay = FX_SYM[d.selectedCurrency] + d.amtRaw.toLocaleString();

    const html = `
      <div class="pr-header">
        <div class="pr-watermark">Cosmohentorq Innovations Pvt. Ltd. · DIPP166809 · STM83197</div>
        <div class="pr-company">COSMOHENTORQ INNOVATIONS</div>
        <div class="pr-doc-type">Investor Simulation Note — Confidential &amp; Non-Binding</div>
        <div class="pr-meta">Reference: ${d.simRef} · Generated: ${d.simDate}</div>
      </div>

      <div class="pr-section-title">Enquirer</div>
      <div class="pr-row"><span>Name</span><span>${d.name}</span></div>
      <div class="pr-row"><span>Country</span><span>${d.country}</span></div>

      <div class="pr-section-title">Your Capital</div>
      <div class="pr-row"><span>Amount</span><span class="pr-accent">${amtDisplay} (${d.selectedCurrency})</span></div>
      <div class="pr-row"><span>In INR</span><span>${fmtINR(d.amountINR)}</span></div>
      <div class="pr-row"><span>Time Horizon</span><span>${d.horizon} Year${d.horizon > 1 ? 's' : ''}</span></div>

      <div class="pr-section-title">What You Could Receive — Yr ${d.horizon}</div>
      <div class="pr-scenarios">
        ${Object.entries(RETURN_SCENARIOS).map(([k, sc]) => {
          const ret = getReturnMult(sc, d.horizon) * d.amountINR;
          return `<div class="pr-scenario-card">
            <div class="pr-sc-name">${sc.name}</div>
            <div class="pr-sc-val">${sc.isFail ? '₹0' : fmtINR(ret)}</div>
            <div class="pr-sc-sub">${sc.prob}% probability</div>
          </div>`;
        }).join('')}
      </div>

      <div class="pr-section-title">Risk Summary</div>
      <div class="pr-row"><span>Probability of ANY loss</span><span>60% (25% total + 35% partial)</span></div>
      <div class="pr-row"><span>Probability of total loss</span><span>25%</span></div>
      <div class="pr-row"><span>Break-even (base case)</span><span>Year 5–6 (if exit occurs)</span></div>
      <div class="pr-row"><span>Capital locked for</span><span>8–15 years minimum</span></div>

      <div class="pr-section-title">Key Risks</div>
      <ul class="pr-risks">
        <li>No commercial revenue to date. Pre-revenue, early-stage company.</li>
        <li>25% statistical probability of total capital loss based on sector data.</li>
        <li>Capital illiquid for 8–15 years — no secondary market currently.</li>
        <li>Competition from OpenAI, Google, Microsoft in enterprise AI.</li>
        <li>Single-founder concentration risk.</li>
        <li>All figures are illustrative. Not financial advice.</li>
      </ul>

      <div class="pr-footer">
        <div>FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. NOT INVESTMENT ADVICE. NOT A BINDING OFFER. Seek independent professional financial and legal advice before any decision.</div>
        <div class="pr-contacts">
          <span>+91 8754883872</span>
          <span>apex@cosmohentorq.com</span>
          <span>labs@cosmohentorq.com</span>
        </div>
      </div>
    `;

    const printEl = document.getElementById('printReport');
    const contentEl = document.getElementById('printContent');
    if (printEl && contentEl) {
      contentEl.innerHTML = html;
      printEl.style.display = 'block';
      setTimeout(() => { window.print(); }, 100);
      setTimeout(() => { printEl.style.display = 'none'; }, 2000);
    }
  });

  /* ====================================================
     REPORT: WhatsApp
     ==================================================== */
  document.getElementById('waBtn')?.addEventListener('click', () => {
    if (!lastSimData) return;
    const d = lastSimData;
    const amtDisplay = FX_SYM[d.selectedCurrency] + d.amtRaw.toLocaleString();
    const growthRet = fmtINR(getReturnMult(RETURN_SCENARIOS.growth, d.horizon) * d.amountINR);
    const text = encodeURIComponent(
      `Hi Cosmohentorq,\n\nI ran a simulation on your investor platform.\n\nRef: ${d.simRef}\nName: ${d.name}\nCountry: ${d.country}\nAmount: ${amtDisplay}\nHorizon: ${d.horizon} year(s)\n\nSimulation result (base/growth case, Yr${d.horizon}): ${growthRet}\nNote: 25% probability of total loss, 40% probability of meaningful profit.\n\nI'd like to discuss further.`
    );
    window.open(`https://wa.me/918754883872?text=${text}`, '_blank');
  });

  /* ====================================================
     REPORT: Email
     ==================================================== */
  document.getElementById('emailBtn')?.addEventListener('click', () => {
    if (!lastSimData) return;
    const d = lastSimData;
    const amtDisplay = FX_SYM[d.selectedCurrency] + d.amtRaw.toLocaleString();
    const growthRet = fmtINR(getReturnMult(RETURN_SCENARIOS.growth, d.horizon) * d.amountINR);
    const subject = encodeURIComponent(`Investor Inquiry — ${d.simRef} — ${d.name}`);
    const body = encodeURIComponent(
      `Hi,\n\nI ran a simulation on the Cosmohentorq investor platform.\n\nRef: ${d.simRef}\nName: ${d.name}\nCountry: ${d.country}\nAmount: ${amtDisplay} (${d.selectedCurrency})\nHorizon: ${d.horizon} year(s)\n\nBase/growth case return at Yr${d.horizon}: ${growthRet}\nNote: 25% probability of total loss; 40% probability of meaningful profit. Figures are illustrative only.\n\nPlease reach out to discuss.\n\nRegards,\n${d.name}`
    );
    window.open(`mailto:apex@cosmohentorq.com?subject=${subject}&body=${body}`, '_blank');
  });

  /* ====================================================
     REPORT: Executive Summary Modal
     ==================================================== */
  document.getElementById('execBtn')?.addEventListener('click', () => {
    if (!lastSimData) return;
    const d = lastSimData;
    const amtDisplay = FX_SYM[d.selectedCurrency] + d.amtRaw.toLocaleString();
    const scn = activeScenarios();
    const cagrGrowth = calcCAGR(d.amountINR, getReturnMult(scn.growth, d.horizon) * d.amountINR, d.horizon);
    const text = `COSMOHENTORQ INNOVATIONS
Investor Simulation Summary
Reference: ${d.simRef} · ${d.simDate}

YOUR CAPITAL
Amount: ${amtDisplay} (${d.selectedCurrency}) · ${fmtINR(d.amountINR)}
Horizon: ${d.horizon} year(s)${d.gf && d.gf !== 1 ? `\nSensitivity GF: ${d.gf.toFixed(2)}×` : ''}

WHAT YOU COULD RECEIVE AT YEAR ${d.horizon}
Total Loss      (25%): ₹0  — Company fails
Partial Return  (35%): ${fmtINR(getReturnMult(scn.survive, d.horizon) * d.amountINR)}  — Survive, low/partial exit
Moderate Growth (30%): ${fmtINR(getReturnMult(scn.growth, d.horizon) * d.amountINR)}  — 3–6x return · CAGR ${fmtCAGR(cagrGrowth)}
Exceptional     (10%): ${fmtINR(getReturnMult(scn.exceptional, d.horizon) * d.amountINR)}  — 15–40x return

RISK SUMMARY
Probability of any loss: 60% (25% total + 35% partial)
Probability of total loss: 25%
Break-even (growth case): Year 5–6 (if exit occurs)
Capital illiquid for: 8–15 years minimum

CAPITAL DEPLOYMENT
${CAP_DEPLOY.map(c => `  ${c.label.padEnd(22)} ${c.pct}%`).join('\n')}

RISKS
  · 25% statistical probability of total capital loss
  · Pre-revenue — no commercial track record
  · Capital locked for 8–15 years, no secondary market
  · Competition from OpenAI, Google, Microsoft
  · Single-founder concentration risk
  · Future funding rounds will dilute early investors
  · All figures illustrative — not financial advice

CONTACT
  WhatsApp: +91 8754883872
  Email:    apex@cosmohentorq.com / labs@cosmohentorq.com
  Web:      cosmohentorq.com

DISCLAIMER
For informational and educational purposes only. Not investment advice.
Not a binding offer. Seek independent professional advice.`;

    const modal = document.getElementById('execModal');
    const body  = document.getElementById('execModalBody');
    if (modal && body) { body.textContent = text; modal.style.display = 'flex'; }
  });

  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('execModal').style.display = 'none';
  });
  document.getElementById('modalOverlay')?.addEventListener('click', () => {
    document.getElementById('execModal').style.display = 'none';
  });

  document.getElementById('copyExecBtn')?.addEventListener('click', () => {
    const text = document.getElementById('execModalBody')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copyExecBtn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy Text', 2000);
      });
    }
  });

  /* ---- RESET SIMULATION ---- */
  document.getElementById('resetSimBtn')?.addEventListener('click', () => {
    const results = document.getElementById('simResults');
    const form    = document.querySelector('.explorer-form');
    if (results) results.style.display = 'none';
    if (form) {
      form.style.display = '';
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ---- ADVANCED MODE TOGGLE ---- */
  document.getElementById('advModeToggle')?.addEventListener('click', function() {
    this.classList.toggle('active');
    const section = document.getElementById('advModeSection');
    if (section) section.style.display = this.classList.contains('active') ? 'block' : 'none';
  });

  /* ---- SENSITIVITY SLIDERS ---- */
  function updateSliderDisplays() {
    const arpu  = parseFloat(document.getElementById('sliderARPU')?.value  || 150000);
    const cust  = parseFloat(document.getElementById('sliderCust')?.value  || 8);
    const churn = parseFloat(document.getElementById('sliderChurn')?.value || 15);
    const arpuEl  = document.getElementById('sliderARPUVal');
    const custEl  = document.getElementById('sliderCustVal');
    const churnEl = document.getElementById('sliderChurnVal');
    const gfEl    = document.getElementById('gfDisplay');
    if (arpuEl)  arpuEl.textContent  = arpu >= 100000 ? `₹${(arpu/100000).toFixed(1)}L` : `₹${(arpu/1000).toFixed(0)}K`;
    if (custEl)  custEl.textContent  = cust;
    if (churnEl) churnEl.textContent = churn + '%';
    const gf = computeGrowthFactor();
    if (gfEl) gfEl.textContent = gf.toFixed(2) + '×';
  }

  ['sliderARPU', 'sliderCust', 'sliderChurn'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateSliderDisplays);
  });
  updateSliderDisplays();

  /* ---- YEAR-BY-YEAR TABLE TOGGLE ---- */
  document.getElementById('yoyToggleBtn')?.addEventListener('click', function() {
    const wrap = document.getElementById('yoyTableWrap');
    if (!wrap) return;
    const isVisible = wrap.style.display !== 'none';
    wrap.style.display = isVisible ? 'none' : 'block';
    this.textContent = isVisible ? '☰ Show Year-by-Year Table' : '✕ Hide Table';
  });

  /* ---- SHARE SIMULATION ---- */
  document.getElementById('simShareBtn')?.addEventListener('click', function() {
    if (!lastSimData) return;
    const d = lastSimData;
    const params = new URLSearchParams({
      amt: d.amtRaw,
      cur: d.selectedCurrency,
      yr:  d.horizon,
      ref: d.simRef
    });
    const url = `${window.location.origin}${window.location.pathname}#explorer?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      this.textContent = '✓ Link Copied!';
      setTimeout(() => { this.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share Simulation`; }, 2500);
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      prompt('Copy this link:', url);
    });
  });

  /* ---- LOAD SAVED FORM ON PAGE LOAD ---- */
  loadFormFromStorage();

})();
