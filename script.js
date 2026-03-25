document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     PREVENT MOBILE MENU FLASH (JS SAFETY)
  ====================== */

  const mobileMenuInit = document.querySelector('.mobile-menu');
  if (mobileMenuInit) {
    mobileMenuInit.style.transform = 'translateX(-100%)';
  }


  /* ======================
     INTERSECTION OBSERVER (ALL ANIMATIONS)
  ====================== */

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.slide-in, .fade-in, .banner-overlay')
    .forEach(el => observer.observe(el));


  /* ======================
     BANNER VIDEO FADE-IN
  ====================== */

  const bannerVideo = document.querySelector('.banner-video');
  if (bannerVideo) {
    setTimeout(() => {
      bannerVideo.classList.add('loaded');
    }, 600);
  }


  /* ======================
     VIDEO LOAD
  ====================== */

  window.addEventListener('load', () => {
    const video = document.querySelector('.banner-video-native');
    if (video) video.load();
  });


  /* ======================
     MOBILE MENU
  ====================== */

  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function closeMobileMenu() {
    toggle?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  mobileDropdowns.forEach(drop => {
    const title = drop.querySelector('.mobile-title');
    if (!title) return;

    title.addEventListener('click', () => {
      mobileDropdowns.forEach(d => {
        if (d !== drop) d.classList.remove('active');
      });
      drop.classList.toggle('active');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) closeMobileMenu();
  });


  /* ======================
     HEADER SCROLL (THROTTLED)
  ====================== */

  const header = document.querySelector('.site-header');
  const banner = document.querySelector('.banner');

  function updateHeaderState() {
    if (!header) return;

    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (banner) {
      const bannerHeight = banner.offsetHeight;
      if (window.scrollY < bannerHeight - 80) {
        header.classList.add('is-overlay');
      } else {
        header.classList.remove('is-overlay');
      }
    }
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeaderState();
        ticking = false;
      });
      ticking = true;
    }
  }

  updateHeaderState();
  window.addEventListener('scroll', onScroll);


  /* ======================
     CAROUSEL (BUTTON ONLY)
  ====================== */

  const slider = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.slide');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  if (slider && slides.length > 0) {

    let index = 0;
    let slideWidth = 0;
    let gap = 0;

    let autoTimer = null;
    let resumeTimer = null;

    let hasStarted = false;
    let prevTranslate = 0;

    /* WIDTH */
    function setWidth() {
      const style = getComputedStyle(slider);
      gap = parseFloat(style.gap) || 0;
      slideWidth = slides[0].getBoundingClientRect().width + gap;
      moveTo(index, false);
    }

    /* MOVE */
    function moveTo(i, animate = true) {
      index = (i + slides.length) % slides.length;

      const offset = index * slideWidth;
      prevTranslate = -offset;

      slider.style.transition = animate
        ? "transform 0.6s cubic-bezier(.22,.61,.36,1)"
        : "none";

      slider.style.transform = `translate3d(${prevTranslate}px,0,0)`;

      slides.forEach(s => s.classList.remove('active'));
      slides[index].classList.add('active');
    }

    /* AUTOPLAY */
    function startAuto() {
      if (autoTimer) return;

      autoTimer = setInterval(() => {
        moveTo(index + 1);
      }, 3500);
    }

    function stopAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
    }

    function pauseAndResume() {
      stopAuto();
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(startAuto, 5000);
    }

    /* START WHEN IN VIEW */
    function checkInView() {
      if (hasStarted) return;

      const rect = slider.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const visible = rect.top < windowHeight * 0.8 && rect.bottom > 0;

      if (visible) {
        hasStarted = true;
        startAuto();
        window.removeEventListener('scroll', checkInView);
      }
    }

    window.addEventListener('scroll', checkInView);
    checkInView();

    /* BUTTONS */
    nextBtn?.addEventListener('click', () => {
      moveTo(index + 1);
      pauseAndResume();
    });

    prevBtn?.addEventListener('click', () => {
      moveTo(index - 1);
      pauseAndResume();
    });

    /* INIT */
    setWidth();
    moveTo(0, false);

    window.addEventListener('resize', setWidth);
  }

});
