/* ==========================================================
   tamjid0x01 — portfolio interactions
   ========================================================== */
(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- PRELOADER ---------------- */
  const preloader = $('#preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('hidden'), 700);
  });
  // Safety: never let preloader block the page
  setTimeout(() => preloader && preloader.classList.add('hidden'), 3500);

  /* ---------------- BLOCKCHAIN CHAIN BACKGROUND ---------------- */
  const canvas = $('#bg-net');
  let ctx, particles = [];
  if (canvas) {
    ctx = canvas.getContext('2d');
    let w, h, raf, t = 0;

    const HASH_CH = '0123456789abcdef';
    const randHash = (len) => {
      let s = '';
      for (let i = 0; i < len; i++) s += HASH_CH[Math.floor(Math.random() * HASH_CH.length)];
      return s;
    };

    // ---- chain blocks ----
    const BLOCK_W = 172, BLOCK_H = 92;
    const blocks = [];
    for (let i = 0; i < 18; i++) {
      blocks.push({
        n: 1024 + Math.floor(Math.random() * 6000),
        hash: randHash(10),
        prev: randHash(10),
        tx: 128 + Math.floor(Math.random() * 3800),
        time: String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' + String(Math.floor(Math.random() * 60)).padStart(2, '0'),
      });
    }

    // ---- floating emission particles ----
    const seedParticles = () => {
      const count = Math.max(14, Math.min(40, Math.floor(w / 48)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        green: Math.random() > 0.55,
      }));
    };
    seedParticles();

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      seedParticles();
    };
    resize();
    window.addEventListener('resize', resize);

    const drawParticles = () => {
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.green ? 'rgba(0,255,157,.5)' : 'rgba(0,229,255,.5)';
        ctx.fill();
      });
    };

    const mono = "'JetBrains Mono', monospace";

    const roundRectPath = (x, y, ww, hh, r) => {
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, ww, hh, r);
      else ctx.rect(x, y, ww, hh);
    };

    const drawBlock = (x, y, b) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,.55)';
      ctx.fillStyle = 'rgba(0,229,255,.04)';
      roundRectPath(x, y, BLOCK_W, BLOCK_H, 12);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(0,229,255,.10)';
      ctx.fillRect(x, y, BLOCK_W, 20);
      ctx.fillStyle = 'rgba(0,255,157,.8)';
      ctx.font = '700 11px ' + mono;
      ctx.textAlign = 'center';
      ctx.fillText('BLOCK #' + b.n, x + BLOCK_W / 2, y + 14);
      ctx.fillStyle = 'rgba(0,229,255,.85)';
      ctx.font = '10px ' + mono;
      ctx.textAlign = 'left';
      ctx.fillText(b.hash, x + 12, y + 39);
      ctx.fillStyle = 'rgba(120,140,165,.75)';
      ctx.fillText('prev ' + b.prev.slice(0, 6) + '…', x + 12, y + 55);
      ctx.fillText('tx ' + b.tx + '  ·  ' + b.time, x + 12, y + 71);
      ctx.restore();
    };

    const drawLink = (x1, y1, x2, y2) => {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      ctx.save();
      ctx.strokeStyle = 'rgba(0,229,255,.5)';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,255,157,.5)';
      for (let k = -1; k <= 1; k++) {
        ctx.save();
        ctx.translate(mx + k * 15, my);
        ctx.rotate(0.5);
        ctx.scale(1, 1.45);
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    const drawRow = (yBase, alphaMul, phase, start) => {
      const spacing = 226;
      const amp = 30;
      const off = (t * 11 + phase) % spacing;
      ctx.save();
      ctx.globalAlpha = 0.16 * alphaMul;
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[(i + start) % blocks.length];
        const x = i * spacing - off;
        if (x < -BLOCK_W - 60 || x > w + 60) continue;
        const y = yBase + Math.sin(i * 0.5 + t * 0.045) * amp;
        if (y < -BLOCK_H || y > h + BLOCK_H) continue;
        if (i > 0) {
          const xp = i * spacing - spacing - off;
          const yp = yBase + Math.sin((i - 1) * 0.5 + t * 0.045) * amp;
          drawLink(xp + BLOCK_W, yp, x, y);
        }
        drawBlock(x, y, b);
      }
      ctx.restore();
    };

    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      drawParticles();
      drawRow(h * 0.40, 0.55, 0, 0);
      drawRow(h * 0.72, 0.45, 90, 6);
      drawRow(h * 1.02, 0.30, 180, 12);
      raf = requestAnimationFrame(frame);
    };

    if (!reduceMotion) frame();
    else { drawParticles(); drawRow(h * 0.40, 0.55, 0, 0); drawRow(h * 0.72, 0.45, 90, 6); }
  }

  /* ---------------- TYPED TEXT EFFECT ---------------- */
  const typedEl = $('#typed');
  const typedSm = $('#typedSm');

  const roles = [
    'Smart Contract Auditor',
    'Blockchain Security Researcher (DLT)',
    'Web3 Bug Hunter',
    'DeFi Security Analyst',
    'Solidity Security Specialist'
  ];
  const terminalCmds = [
    'sudo audit --all-protocols',
    'forge test --match-contract Exploit',
    'cast call 0xSECURE ...',
    'slither . --find-all-issues',
    'hack --for good                         '
  ];

  function typeLoop(el, list, speed, hold) {
    let li = 0, ci = 0, deleting = false;
    (function step() {
      if (!el) return;
      const word = list[li % list.length];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) {
          deleting = true;
          setTimeout(step, hold);
          return;
        }
        setTimeout(step, speed);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          li++;
          setTimeout(step, 380);
          return;
        }
        setTimeout(step, speed * 0.5);
      }
    })();
  }
  if (!reduceMotion) {
    typeLoop(typedEl, roles, 52, 1800);
    typeLoop(typedSm, terminalCmds, 45, 1500);
  } else {
    if (typedEl) typedEl.textContent = '# Smart Contract Auditor';
    if (typedSm) typedSm.textContent = 'cast call 0xSECURE ...';
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  const revealEls = $$('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));

  /* ---------------- ANIMATED COUNTERS ---------------- */
  const counters = $$('.stat-num[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1500;
      const start = performance.now();
      (function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      })(performance.now());
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => countIO.observe(el));

  /* ---------------- SKILL BARS ---------------- */
  const bars = $$('.bar-fill[data-w]');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const bar = e.target;
        bar.style.width = bar.dataset.w + '%';
        barIO.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach((bar) => barIO.observe(bar));

  /* ---------------- NAVBAR ---------------- */
  const nav = $('#nav');
  const toTop = $('#toTop');
  const navToggle = $('#navToggle');
  const navLinks = $('#navLinks');
  const links = $$('.nav-links a');

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (toTop) toTop.classList.toggle('visible', y > 600);

    // active section highlight
    const sections = $$('section[id]');
    let current = 'home';
    sections.forEach((s) => {
      if (y >= s.offsetTop - 140) current = s.id;
    });
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    links.forEach((a) => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  if (toTop) {
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();