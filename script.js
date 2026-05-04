/* ============================================================
   BARBER PRIME CLUB — script.js
   ============================================================ */

const WA_NUMBER = '5511996185751';

/* ---- State ---- */
const state = { barber: '', service: '', price: '' };

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
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseFloat(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

/* Stagger cards within their grids */
document.querySelectorAll('.services-grid, .barbers-grid, .diff-grid').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 90;
  });
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   SERVICE SELECTION
   ============================================================ */
function selectService(name, price) {
  state.service = name;
  state.price   = price;

  /* Highlight cards */
  document.querySelectorAll('.svc-card').forEach(card => {
    const selected = card.dataset.service === name;
    card.classList.toggle('selected', selected);
    const btn = card.querySelector('.svc-btn');
    if (btn) {
      btn.textContent = selected ? '✓ Selecionado' : 'Selecionar';
      btn.classList.toggle('active', selected);
    }
  });

  /* Sync dropdown */
  const sel = document.getElementById('serviceSelect');
  for (const opt of sel.options) {
    if (opt.value.startsWith(name + '|')) { sel.value = opt.value; break; }
  }

  updatePreview();
  smoothScrollTo('#booking');
}

/* ============================================================
   BARBER SELECTION
   ============================================================ */
function selectBarber(name) {
  state.barber = name;

  /* Highlight cards */
  document.querySelectorAll('.barber-card').forEach(card => {
    const selected = card.dataset.barber === name;
    card.classList.toggle('selected', selected);
    const btn = card.querySelector('.barber-btn');
    if (btn) {
      btn.innerHTML = selected
        ? '<i class="fas fa-check"></i> Selecionado'
        : '<i class="fas fa-user-check"></i> Selecionar barbeiro';
      btn.classList.toggle('active', selected);
    }
  });

  /* Sync dropdown */
  document.getElementById('barberSelect').value = name;

  updatePreview();
  smoothScrollTo('#booking');
}

/* ============================================================
   BOOKING DROPDOWNS
   ============================================================ */
function onBarberChange(value) {
  state.barber = value;
  syncBarberCards(value);
  updatePreview();
}

function onServiceChange(value) {
  if (value) {
    const [name, price] = value.split('|');
    state.service = name;
    state.price   = price;
  } else {
    state.service = '';
    state.price   = '';
  }
  syncServiceCards(state.service);
  updatePreview();
}

function syncBarberCards(selected) {
  document.querySelectorAll('.barber-card').forEach(card => {
    const match = card.dataset.barber === selected;
    card.classList.toggle('selected', match);
    const btn = card.querySelector('.barber-btn');
    if (btn) {
      btn.innerHTML = match
        ? '<i class="fas fa-check"></i> Selecionado'
        : '<i class="fas fa-user-check"></i> Selecionar barbeiro';
      btn.classList.toggle('active', match);
    }
  });
}

function syncServiceCards(selected) {
  document.querySelectorAll('.svc-card').forEach(card => {
    const match = card.dataset.service === selected;
    card.classList.toggle('selected', match);
    const btn = card.querySelector('.svc-btn');
    if (btn) {
      btn.textContent = match ? '✓ Selecionado' : 'Selecionar';
      btn.classList.toggle('active', match);
    }
  });
}

/* ============================================================
   BOOKING PREVIEW
   ============================================================ */
function updatePreview() {
  const el = document.getElementById('bookingPreview');
  if (!el) return;

  if (state.barber && state.service) {
    el.classList.add('filled');
    el.innerHTML = `
      <div style="line-height:1.9;width:100%">
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--text3);width:64px;flex-shrink:0">Barbeiro</span>
          <strong style="color:var(--text)">${state.barber}</strong>
        </div>
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--text3);width:64px;flex-shrink:0">Serviço</span>
          <strong style="color:var(--text)">${state.service}</strong>
        </div>
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="font-size:.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--text3);width:64px;flex-shrink:0">Valor</span>
          <strong style="color:var(--accent);font-size:1.1rem">${state.price}</strong>
        </div>
      </div>`;
  } else {
    el.classList.remove('filled');
    if (state.barber) {
      el.innerHTML = `<div class="bk-empty"><i class="fas fa-user-check"></i><span>Barbeiro: <strong>${state.barber}</strong>. Agora selecione o serviço.</span></div>`;
    } else if (state.service) {
      el.innerHTML = `<div class="bk-empty"><i class="fas fa-cut"></i><span>Serviço: <strong>${state.service}</strong>. Agora selecione o barbeiro.</span></div>`;
    } else {
      el.innerHTML = `<div class="bk-empty"><i class="fas fa-calendar-check"></i><span>Preencha os campos acima para ver o resumo do seu agendamento.</span></div>`;
    }
  }
}

/* ============================================================
   WHATSAPP — gera mensagem e abre
   ============================================================ */
function openWhatsApp() {
  if (!state.barber || !state.service) {
    showToast('Selecione um barbeiro e um serviço antes de agendar.');
    return;
  }

  const msg =
    `Olá, vim pelo site da BARBER PRIME CLUB.\n` +
    `Gostaria de agendar um horário.\n\n` +
    `Barbeiro escolhido: ${state.barber}\n` +
    `Serviço escolhido: ${state.service}\n` +
    `Valor: ${state.price}\n\n` +
    `Aguardo disponibilidade.`;

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
    max-width:300px;
  `;
  toast.querySelector('i').style.color = 'var(--accent)';

  if (!document.querySelector('#toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

/* ============================================================
   SMOOTH SCROLL HELPER
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
    cx = W / 2;
    cy = H / 2;
    innerR = Math.min(wrap.offsetWidth, wrap.offsetHeight) * 0.44;
    outerR = Math.min(W, H) * 0.48;
  }

  function makeParticle() {
    const gold  = Math.random() > 0.28;
    const color = gold ? '#FFB300' : '#ffffff';
    const r     = rand(innerR, outerR);
    return {
      angle  : rand(0, Math.PI * 2),
      r,
      baseR  : r,
      speed  : rand(0.00025, 0.0009) * (Math.random() > 0.5 ? 1 : -1),
      size   : rand(0.9, 2.6),
      alpha  : rand(0.25, 0.85),
      aDir   : Math.random() > 0.5 ? 1 : -1,
      aSpeed : rand(0.004, 0.011),
      aMin   : rand(0.08, 0.3),
      aMax   : rand(0.55, 1.0),
      color,
      wobble : rand(0, Math.PI * 2),
      wobbleS: rand(0.004, 0.014),
      wobbleA: rand(2, 10),
    };
  }

  function boot() {
    isMobile = window.innerWidth <= 768;
    resize();
    particles.length = 0;
    const count = isMobile ? 28 : 62;
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
        /* halo difuso — skipped on mobile (shadowBlur is expensive) */
        ctx.save();
        ctx.globalAlpha = p.alpha * 0.35;
        ctx.shadowBlur  = p.size * 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      /* ponto central */
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (!isMobile) {
        ctx.shadowBlur  = p.size * 5;
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
  updatePreview();
});
