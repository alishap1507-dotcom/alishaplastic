// ==========================================================================
// Main Site Scripts - Alisha Plastics
// ==========================================================================

/* ---------- Footer year (automatic) ---------- */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// /* ---------- Footer Owner Link (Login / Admin Panel) ---------- */
// const ownerLink = document.getElementById('owner-login-link');
// if (ownerLink && typeof auth !== 'undefined' && auth) {
//   auth.onAuthStateChanged((user) => {
//     if (user && typeof ADMIN_EMAIL !== 'undefined' && user.email === ADMIN_EMAIL) {
//       ownerLink.textContent = 'Admin Panel';
//     } else {
//       ownerLink.textContent = 'Login';
//     }
//   });
// }

/* ---------- Mobile menu ---------- */
const menu = document.getElementById('menu');
const burger = document.getElementById('burger');
if (burger && menu) {
  burger.onclick = () => menu.classList.toggle('open');
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => menu.classList.remove('open'))
  );
}

/* ---------- Hero slider (auto every 4 sec) ---------- */
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
if (slides.length && dotsBox) {
  let cur = 0, timer;
  dotsBox.innerHTML = '';
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.onclick = () => { show(i); restart(); };
    dotsBox.appendChild(b);
  });

  function show(i) {
    cur = i;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    dotsBox.querySelectorAll('button').forEach((d, k) => d.classList.toggle('on', k === i));
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => show((cur + 1) % slides.length), 4000);
  }

  show(0);
  restart();
}
