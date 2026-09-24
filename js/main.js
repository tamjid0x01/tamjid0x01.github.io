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

  /* ---------------- PARTICLE NETWORK CANVAS ---------------- */
  const canvas = $('#bg-net');
  let ctx, particles = [];
  if (canvas) {
    ctx = canvas.getContext('2d');
    let w, h, raf;
    const count = () => Math.max(26, Math.min(80, Math.floor(window.innerWidth / 22)));

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class P {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.r = Math.random() * 1.6 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.cyan = Math.random() > 0.5;
      }
      move() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.cyan ? 'rgba(0,229,255,.7)' : 'rgba(0,255,157,.7)';
        ctx.fill();
      }
    }

    const seed = () => { particles = Array.from({ length: count() }, () => new P()); };
    seed();

    const LINK_DIST = 130;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => { p.move(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    if (!reduceMotion) tick();
    else { particles.forEach((p) => p.draw()); }
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