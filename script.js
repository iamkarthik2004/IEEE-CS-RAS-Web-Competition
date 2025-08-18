// ========= Smooth Scroll =========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========= Active Nav Highlight =========
window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 100; // offset
  document.querySelectorAll('.nav-dock a').forEach(link => {
    let section = document.querySelector(link.getAttribute('href'));
    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// ========= Wayfire Click Effect =========
function createWayfireEffect(e) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const effect = document.createElement('span');
  effect.className = 'wayfire';
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;

  // Optional: randomize color
  const colors = ['#ff4d4d', '#4dff4d', '#4d4dff', '#ff4dff', '#4dffff', '#ffff4d'];
  effect.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random()*colors.length)]} 0%, rgba(255,255,255,0) 70%)`;

  button.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 600); // remove after animation
}

// Attach Wayfire effect to all buttons, hero buttons, and nav icons
document.querySelectorAll('button, .btn, .nav-dock .icon').forEach(btn => {
  btn.addEventListener('click', createWayfireEffect);
});


/* ===== Parallax (add-only) ===== */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // What to parallax and how fast (tweak speeds if you want)
  const parallaxMap = [
    { selector: '.hero .overlay', speed: 0.30 },     // hero text
    { selector: '.hero video', speed: 0.12 },        // hero video (slow)
    { selector: '#about .section-title', speed: 0.18 },
    { selector: '.society-logos', speed: 0.22 },
    { selector: '#events .section-title', speed: 0.18 },
    { selector: '.events-grid', speed: 0.26 },
    { selector: '#team .section-title', speed: 0.18 },
    { selector: '.team-grid', speed: 0.22 },
    { selector: '#contact .section-title', speed: 0.18 },
    { selector: '.contact-grid', speed: 0.22 }
  ];

  // If an element has a background image (like your .hero fallback gif),
  // we can parallax the background position as well.
  const parallaxBackgrounds = [
    { selector: '.hero', speed: 0.10 } // gentle bg shift for gif background
  ];

  const items = [];
  parallaxMap.forEach(({ selector, speed }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('parallax-item');
      items.push({ el, speed, type: 'fg' });
    });
  });

  const bgItems = [];
  parallaxBackgrounds.forEach(({ selector, speed }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('parallax-bg');
      bgItems.push({ el, speed, type: 'bg' });
    });
  });

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY || window.pageYOffset;

      // foreground translate (elements move at different speeds)
      for (const { el, speed } of items) {
        // offset relative to viewport center for a nicer feel
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2 + scrollY;
        const delta = (scrollY - mid) * speed * -0.15;
        el.style.transform = `translateY(${delta.toFixed(2)}px)`;
      }

      // background parallax (background-position)
      for (const { el, speed } of bgItems) {
        const y = Math.round(scrollY * speed);
        el.style.backgroundPosition = `center ${y}px`;
      }

      ticking = false;
    });
  }

  // run once + bind
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();
