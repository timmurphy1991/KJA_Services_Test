document.addEventListener('DOMContentLoaded', () => {

/*---FADE-IN/SLIDE-IN---*/

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


/*---VIDEO---*/

  const banner = document.querySelector('.banner-video');
  if (banner) {
    setTimeout(() => banner.classList.add('loaded'), 600);
  }

  window.addEventListener('load', () => {
    const video = document.querySelector('.banner-video-native');
    if (video) video.load();
  });

/*---MOBILE_MENU---*/

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

/*---HEADER_SCROLL---*/

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.banner');

  function updateHeader() {
    if (!header) return;

    header.classList.toggle('scrolled', window.scrollY > 90);

    if (hero) {
      const h = hero.offsetHeight;
      header.classList.toggle('is-overlay', window.scrollY < h - 90);
    }
  }

  updateHeader();
  window.addEventListener('scroll', () => requestAnimationFrame(updateHeader));

/*---CAROUSEL---*/

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

  function setSize() {
    gap = parseFloat(getComputedStyle(slider).gap) || 0;
    slideWidth = slides[0].offsetWidth + gap;
    move(index, false);
  }

  function move(i, animate = true) {
    index = (i + slides.length) % slides.length;

    const offset = Math.round(index * slideWidth);

    slider.style.transition = animate ? "transform .6s ease" : "none";
    slider.style.transform = `translate3d(-${offset}px,0,0)`;

    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
  }

  function start() {
    if (auto) return;
    auto = setInterval(() => move(index + 1), 3000);
  }

  function stop() {
    clearInterval(auto);
    auto = null;
  }

  function pause() {
    stop();
    clearTimeout(resume);
    resume = setTimeout(start, 6000);
  }

  function inView() {
    const r = slider.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
      start();
      window.removeEventListener('scroll', inView);
    }
  }

  window.addEventListener('scroll', inView);
  inView();

  next?.addEventListener('click', () => {
    move(index + 1);
    pause();
  });

  prev?.addEventListener('click', () => {
    move(index - 1);
    pause();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setSize, 100);
  });

  setSize();
  move(0, false);

});