document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     SIMPLE FADE / SLIDE IN
  ====================== */

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.slide-in, .fade-in, .banner-overlay')
    .forEach(el => observer.observe(el));


  /* ======================
     BANNER VIDEO LOAD
  ====================== */

  const banner = document.querySelector('.banner-video');
  if (banner) {
    setTimeout(() => banner.classList.add('loaded'), 600);
  }

  window.addEventListener('load', () => {
    const video = document.querySelector('.banner-video-native');
    if (video) video.load();
  });


  /* ======================
     MOBILE MENU
  ====================== */

  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('active');
      mobileMenu?.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  document.querySelectorAll('.mobile-dropdown').forEach(drop => {
    const title = drop.querySelector('.mobile-title');
    title?.addEventListener('click', () => {
      document.querySelectorAll('.mobile-dropdown')
        .forEach(d => d !== drop && d.classList.remove('active'));
      drop.classList.toggle('active');
    });
  });


  /* ======================
     HEADER SCROLL
  ====================== */

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.banner');

  function updateHeader() {
    if (!header) return;

    header.classList.toggle('scrolled', window.scrollY > 80);

    if (hero) {
      const h = hero.offsetHeight;
      header.classList.toggle('is-overlay', window.scrollY < h - 80);
    }
  }

  updateHeader();
  window.addEventListener('scroll', () => requestAnimationFrame(updateHeader));


  /* ======================
     CAROUSEL (CLEAN)
  ====================== */

  const slider = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.slide');
  const next = document.querySelector('.next');
  const prev = document.querySelector('.prev');

  if (!slider || !slides.length) return;

  let index = 0;
  let slideWidth = 0;
  let gap = 0;

  let auto = null;
  let resume = null;

  /* SIZE */
  function setSize() {
    gap = parseFloat(getComputedStyle(slider).gap) || 0;
    slideWidth = slides[0].offsetWidth + gap;
    move(index, false);
  }

  /* MOVE */
  function move(i, animate = true) {
    index = (i + slides.length) % slides.length;

    const offset = Math.round(index * slideWidth);

    slider.style.transition = animate ? "transform .6s ease" : "none";
    slider.style.transform = `translate3d(-${offset}px,0,0)`;

    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
  }

  /* AUTOPLAY */
  function start() {
    if (auto) return;
    auto = setInterval(() => move(index + 1), 3500);
  }

  function stop() {
    clearInterval(auto);
    auto = null;
  }

  function pause() {
    stop();
    clearTimeout(resume);
    resume = setTimeout(start, 5000);
  }

  /* START WHEN VISIBLE */
  function inView() {
    const r = slider.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.8 && r.bottom > 0) {
      start();
      window.removeEventListener('scroll', inView);
    }
  }

  window.addEventListener('scroll', inView);
  inView();

  /* BUTTONS */
  next?.addEventListener('click', () => {
    move(index + 1);
    pause();
  });

  prev?.addEventListener('click', () => {
    move(index - 1);
    pause();
  });

  /* RESIZE (FIXED) */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSize, 100);
  });

  /* INIT */
  setSize();
  move(0, false);

});
