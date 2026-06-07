/* ═══════════════════════════════════════════
   BALI — ISLAND OF GODS  |  script.js
   ═══════════════════════════════════════════ */

'use strict';

/* ── Footer year ── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════
   NAVBAR — scroll effect + active link
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════════
   HAMBURGER MENU
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close on link click */
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* Close on outside click */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ═══════════════════════════════════════════
   SCROLL REVEAL — Intersection Observer
═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════
   ACTIVE NAV LINK — Intersection Observer
═══════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id], footer[id]');
const allLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(link => link.classList.remove('active-nav'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active-nav');
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════ */
const form        = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    /* Simple client-side validation */
    const name  = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    if (!name || !email) return;

    /* Simulate async send */
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send My Enquiry';
      btn.disabled = false;
      formSuccess.classList.add('show');

      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  });
}

/* ═══════════════════════════════════════════
   PETAL / BLOSSOM CANVAS ANIMATION
═══════════════════════════════════════════ */
(function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const GOLD_TONES = [
    'rgba(201,168,76,.50)',
    'rgba(201,168,76,.30)',
    'rgba(224,190,114,.42)',
    'rgba(253,246,236,.22)',
    'rgba(180,148,60,.38)',
  ];

  const COUNT = window.innerWidth < 768 ? 38 : 68;

  const petals = Array.from({ length: COUNT }, () => spawnPetal(true));

  function spawnPetal(random) {
    return {
      x:         random ? Math.random() * W : Math.random() * W,
      y:         random ? Math.random() * H : -12,
      vx:        (Math.random() - 0.5) * 0.55,
      vy:        Math.random() * 0.75 + 0.35,
      size:      Math.random() * 3.5 + 1.8,
      angle:     Math.random() * Math.PI * 2,
      spin:      (Math.random() - 0.5) * 0.055,
      sway:      Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.007 + 0.003,
      color:     GOLD_TONES[Math.floor(Math.random() * GOLD_TONES.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    petals.forEach((p, i) => {
      p.sway += p.swaySpeed;
      p.x    += p.vx + Math.sin(p.sway) * 0.38;
      p.y    += p.vy;
      p.angle += p.spin;

      /* Reset when off screen */
      if (p.y > H + 14) { petals[i] = spawnPetal(false); return; }
      if (p.x >  W + 14) p.x = -14;
      if (p.x < -14)    p.x =  W + 14;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ═══════════════════════════════════════════
   STAT COUNTER ANIMATION
═══════════════════════════════════════════ */
function animateCount(el, target, suffix, isFloat) {
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
    const val      = target * ease;
    el.textContent = (isFloat ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const badgeNum = document.querySelector('.badge-num');
if (badgeNum) {
  const badgeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target, 20000, '+', false);
        badgeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  badgeObserver.observe(badgeNum);
}

/* ═══════════════════════════════════════════
   SMOOTH SCROLL — anchors (belt + suspenders,
   CSS scroll-behavior handles most cases)
═══════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h') || '72', 10);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
