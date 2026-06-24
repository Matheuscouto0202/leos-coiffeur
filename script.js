/* ============================================================
   LÉO'S COIFFEUR — script.js
   ============================================================ */

/* ============================================================
   HEADER — scroll effect + active nav
   ============================================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
  highlightNavLink();
}, { passive: true });

function highlightNavLink() {
  const pos = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const active = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', active);
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
const menuToggle = document.getElementById('menuToggle');
const mobileNav  = document.getElementById('mobileNav');

menuToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.mobile-link, .mobile-cta-btn').forEach(el => {
  el.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuToggle.classList.remove('open');
  });
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseFloat(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

/* Stagger cards within grids */
document.querySelectorAll('.services-grid, .barbers-grid, .diff-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 90;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   HERO PARTICLES
   ============================================================ */
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, cx, cy, innerR, outerR, isMobile;
  const particles = [];

  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    const wrap = canvas.parentElement;
    W = canvas.width  = wrap.offsetWidth  + 120;
    H = canvas.height = wrap.offsetHeight + 120;
    cx = W / 2;
    cy = H / 2;
    innerR = Math.min(wrap.offsetWidth, wrap.offsetHeight) * 0.44;
    outerR = Math.min(W, H) * 0.48;
  }

  function makeParticle() {
    const gold  = Math.random() > 0.32;
    const color = gold ? '#C8A96E' : '#f8f4ee';
    const r     = rand(innerR, outerR);
    return {
      angle  : rand(0, Math.PI * 2),
      r,
      baseR  : r,
      speed  : rand(0.00022, 0.0008) * (Math.random() > 0.5 ? 1 : -1),
      size   : rand(0.8, 2.4),
      alpha  : rand(0.2, 0.8),
      aDir   : Math.random() > 0.5 ? 1 : -1,
      aSpeed : rand(0.004, 0.011),
      aMin   : rand(0.07, 0.28),
      aMax   : rand(0.5, 0.95),
      color,
      wobble : rand(0, Math.PI * 2),
      wobbleS: rand(0.004, 0.013),
      wobbleA: rand(2, 9),
    };
  }

  function boot() {
    isMobile = window.innerWidth <= 768;
    resize();
    particles.length = 0;
    const count = isMobile ? 28 : 60;
    for (let i = 0; i < count; i++) particles.push(makeParticle());
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.angle  += p.speed;
      p.wobble += p.wobbleS;
      p.alpha  += p.aSpeed * p.aDir;
      if (p.alpha > p.aMax || p.alpha < p.aMin) p.aDir *= -1;

      const r = p.baseR + Math.sin(p.wobble) * p.wobbleA;
      const x = cx + Math.cos(p.angle) * r;
      const y = cy + Math.sin(p.angle) * r;

      if (!isMobile) {
        ctx.save();
        ctx.globalAlpha = p.alpha * 0.32;
        ctx.shadowBlur  = p.size * 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (!isMobile) {
        ctx.shadowBlur  = p.size * 4;
        ctx.shadowColor = p.color;
      }
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', boot);
  boot();
  tick();
})();

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  highlightNavLink();
});
