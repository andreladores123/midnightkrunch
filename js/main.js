(() => {
  const $ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement, body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  if (!fine) body.classList.add('touch');

  // Images: use them if present, otherwise keep the CSS fallback
  $('[data-img]').forEach(el => {
    const img = new Image(), src = el.dataset.img;
    img.onload = () => { el.style.backgroundImage = `url(${src})`; el.style.setProperty('--img', `url(${src})`); el.dataset.loaded = 1; };
    img.src = src;
  });

  // Split title into letters
  const t = $('.split')[0];
  t.innerHTML = [...t.textContent].map((c, i) => c === ' ' ? ' ' : `<span style="animation-delay:${.2 + i * .06}s">${c}</span>`).join('');

  // Lamp follows the cursor
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    x += (tx - x) * .15; y += (ty - y) * .15;
    root.style.setProperty('--mx', x + 'px'); root.style.setProperty('--my', y + 'px');
    requestAnimationFrame(loop);
  })();
  const lt = $('#lampToggle')[0];
  lt.onclick = () => { const off = body.classList.toggle('nolamp'); lt.textContent = 'Lamp: ' + (off ? 'off' : 'on'); lt.setAttribute('aria-pressed', String(!off)); };

  // Spores drift and flee the cursor
  const cv = $('#spores')[0], cx = cv.getContext('2d'); let P = [];
  const size = () => { cv.width = innerWidth; cv.height = innerHeight; P = Array.from({ length: Math.min(90, innerWidth / 14) }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, r: Math.random() * 2 + .6, vx: 0, vy: -Math.random() * .4 - .1 })); };
  size(); addEventListener('resize', size);
  if (!reduce) (function draw() {
    cx.clearRect(0, 0, cv.width, cv.height);
    for (const p of P) {
      const dx = p.x - tx, dy = p.y - ty, d = Math.hypot(dx, dy) || 1;
      if (d < 140) { p.vx += dx / d * .35; p.vy += dy / d * .35; }
      p.vx *= .95; p.x += p.vx + Math.sin(p.y / 50) * .2; p.y += p.vy;
      if (p.y < -5) { p.y = cv.height + 5; p.x = Math.random() * cv.width; }
      cx.fillStyle = `rgba(166,191,110,${.15 + p.r / 5})`;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill();
    }
    requestAnimationFrame(draw);
  })();

  // 3D tilt and glow
  if (fine && !reduce) $('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const b = el.getBoundingClientRect(), px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height;
      el.style.setProperty('--ry', (px - .5) * 14 + 'deg'); el.style.setProperty('--rx', (.5 - py) * 14 + 'deg');
      el.style.setProperty('--px', px * 100 + '%'); el.style.setProperty('--py', py * 100 + '%');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  // Magnetic links and buttons
  if (fine && !reduce) $('.mag, .btn').forEach(el => {
    el.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .25}px,${(e.clientY - b.top - b.height / 2) * .35}px)`; });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });

  // Scroll reveal and progress bar
  $('.lead, h2, .card, .polaroids li, .tools li').forEach(e => e.classList.add('reveal'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $('.reveal').forEach(e => io.observe(e));
  const bar = $('#progress')[0];
  addEventListener('scroll', () => bar.style.width = scrollY / (root.scrollHeight - innerHeight) * 100 + '%', { passive: true });

  // Mobile menu
  const nav = $('.nav')[0], bg = $('.burger')[0];
  bg.onclick = () => bg.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
  $('.nav nav a').forEach(a => a.onclick = () => { nav.classList.remove('open'); bg.setAttribute('aria-expanded', 'false'); });
})();
