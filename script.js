/* ============================================================
   LÉO'S COIFFEUR — script.js
   ============================================================ */

const WA_NUMBER = '5511996185751';

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

document.querySelectorAll('.services-grid, .barbers-grid, .diff-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 90;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   SERVICE MODAL
   ============================================================ */
function openServiceModal() {
  const overlay = document.getElementById('serviceModal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _closeModal() {
  const overlay = document.getElementById('serviceModal');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function closeServiceModal(e) {
  if (e.target === document.getElementById('serviceModal')) _closeModal();
}

function closeServiceModalBtn() {
  _closeModal();
}

function selectServiceFromModal(service, price) {
  document.getElementById('fServiceValue').value = service + '|' + price;
  const btn  = document.getElementById('servicePickerBtn');
  const span = document.getElementById('servicePickerText');
  span.textContent = `${service} — ${price}`;
  btn.classList.add('selected');

  document.querySelectorAll('.sm-card').forEach(c => {
    c.classList.toggle('active', c.dataset.service === service);
  });

  _closeModal();
}

/* Fechar com ESC */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') _closeModal();
});

/* ============================================================
   QUICK BOOK — clique no card pré-seleciona o serviço no form
   ============================================================ */
function quickBook(service, price) {
  selectServiceFromModal(service, price);
  smoothScrollTo('#booking');
}

/* ============================================================
   BOOKING FORM — monta mensagem e abre WhatsApp
   ============================================================ */
function submitBooking(e) {
  e.preventDefault();

  const serviceRaw = document.getElementById('fServiceValue').value;
  const dateVal    = document.getElementById('fDate').value;
  const timeVal    = document.getElementById('fTime').value;
  const name       = document.getElementById('fName').value.trim();
  const phone      = document.getElementById('fPhone').value.trim();

  if (!serviceRaw || !dateVal || !timeVal || !name || !phone) {
    showToast('Preencha todos os campos antes de continuar.');
    return;
  }

  const [serviceName, servicePrice] = serviceRaw.split('|');

  /* Formata data dd/mm/aaaa */
  const [y, m, d] = dateVal.split('-');
  const formattedDate = `${d}/${m}/${y}`;

  /* Formata hora HHhMM */
  const [hh, mm] = timeVal.split(':');
  const formattedTime = `${hh}h${mm}`;

  const msg =
    `Olá! Gostaria de agendar um horário no Léo's Coiffeur.\n\n` +
    `👤 *Nome:* ${name}\n` +
    `📱 *Celular:* ${phone}\n` +
    `✂️ *Serviço:* ${serviceName}\n` +
    `💰 *Valor:* ${servicePrice}\n` +
    `📅 *Data:* ${formattedDate}\n` +
    `🕐 *Horário:* ${formattedTime}\n\n` +
    `Aguardo confirmação!`;

  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message) {
  const existing = document.querySelector('.lp-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'lp-toast';
  toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  toast.style.cssText = `
    position:fixed; bottom:108px; right:28px; z-index:9999;
    background:var(--bgcard); border:1px solid var(--border2);
    color:var(--text); padding:14px 20px; border-radius:var(--radSm);
    font-family:var(--fBody); font-size:.88rem;
    display:flex; align-items:center; gap:10px;
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    animation:toastIn .3s ease;
    max-width:320px;
  `;
  toast.querySelector('i').style.color = 'var(--accent)';

  if (!document.querySelector('#toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

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
    cx = W / 2; cy = H / 2;
    innerR = Math.min(wrap.offsetWidth, wrap.offsetHeight) * 0.44;
    outerR = Math.min(W, H) * 0.48;
  }

  function makeParticle() {
    const gold  = Math.random() > 0.32;
    const color = gold ? '#C8A96E' : '#f8f4ee';
    const r     = rand(innerR, outerR);
    return {
      angle: rand(0, Math.PI * 2), r, baseR: r,
      speed: rand(0.00022, 0.0008) * (Math.random() > 0.5 ? 1 : -1),
      size: rand(0.8, 2.4), alpha: rand(0.2, 0.8),
      aDir: Math.random() > 0.5 ? 1 : -1,
      aSpeed: rand(0.004, 0.011), aMin: rand(0.07, 0.28), aMax: rand(0.5, 0.95),
      color,
      wobble: rand(0, Math.PI * 2), wobbleS: rand(0.004, 0.013), wobbleA: rand(2, 9),
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
      if (!isMobile) { ctx.shadowBlur = p.size * 4; ctx.shadowColor = p.color; }
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

  /* Define data mínima como hoje */
  const fDate = document.getElementById('fDate');
  if (fDate) fDate.min = new Date().toISOString().split('T')[0];
});
