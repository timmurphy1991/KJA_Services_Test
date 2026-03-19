document.addEventListener('DOMContentLoaded', () => {

  /*SLIDE-IN*/

  const slideIns = document.querySelectorAll('.slide-in');

  if (slideIns.length) {
    const slideObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            slideObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    slideIns.forEach(el => slideObserver.observe(el));
  }

  /*BANNER_OVERLAY_FADE-IN*/

  const bannerOverlays = document.querySelectorAll('.banner-overlay');

  if (bannerOverlays.length) {
    const bannerObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            bannerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    bannerOverlays.forEach(overlay => bannerObserver.observe(overlay));
  }

  /*FADE-IN*/

  const fadeSections = document.querySelectorAll('.fade-in');

  if (fadeSections.length) {
    const fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    fadeSections.forEach(section => fadeObserver.observe(section));
  }

  /*BANNER_VIDEO_FADE-IN*/

  const bannerVideo = document.querySelector('.banner-video');

  if (bannerVideo) {
    setTimeout(() => {
      bannerVideo.classList.add('loaded');
    }, 600);
  }

  /*MOBILE_MENU*/

  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  function closeMobileMenu() {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

mobileDropdowns.forEach(drop => {
  const title = drop.querySelector('.mobile-title');
  if (!title) return;

  title.addEventListener('click', () => {

    const isActive = drop.classList.contains('active');

    // Close all OTHER dropdowns (leave this one alone)
    mobileDropdowns.forEach(d => {
      if (d !== drop) d.classList.remove('active');
    });

    // Toggle this one normally
    drop.classList.toggle('active');

  });
});

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      closeMobileMenu();
    }
  });

  /*NAVIGATION_SCROLL_BEHAVIOUR*/
  const header = document.querySelector('.site-header');
  const banner = document.querySelector('.banner');

  function updateHeaderState() {

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

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState);

});

/* ======================
   CASE STUDY CAROUSEL (FIXED)
====================== */

const slider = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (slider && slides.length && nextBtn && prevBtn) {

  let index = 1;
  const gap = 24;
  let slideWidth;
  let isMoving = false;

  let autoPlay = null;
  let hasStarted = false; // key: only trigger once when seen

  /* ======================
     SET WIDTH
  ====================== */
  function setWidth() {
    slideWidth = slides[0].offsetWidth + gap;
  }

  /* ======================
     CLONE FOR LOOP
  ====================== */
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  slider.appendChild(firstClone);
  slider.insertBefore(lastClone, slides[0]);

  const allSlides = document.querySelectorAll('.slide');

  /* ======================
     MOVE
  ====================== */
  function goTo(i, animate = true) {
    if (isMoving) return;
    isMoving = true;

    index = i;

    slider.style.transition = animate ? "transform 0.6s ease" : "none";
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  /* ======================
     ACTIVE STATE
  ====================== */
  function setActive() {
    allSlides.forEach(s => s.classList.remove('active'));
    allSlides[index].classList.add('active');
  }

  /* ======================
     LOOP FIX (NO FLASH BOTH DIRECTIONS)
  ====================== */
  slider.addEventListener('transitionend', () => {
    const total = allSlides.length;

    if (index === total - 1) {
      index = 1;
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    if (index === 0) {
      index = total - 2;
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${index * slideWidth}px)`;
    }

    setActive();
    isMoving = false;
  });

  /* ======================
     BUTTONS
  ====================== */
  nextBtn.onclick = () => goTo(index + 1);
  prevBtn.onclick = () => goTo(index - 1);

  /* ======================
     AUTOPLAY
  ====================== */
  function startAutoPlay() {
    if (autoPlay) return;

    autoPlay = setInterval(() => {
      goTo(index + 1);
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = null;
  }

  /* ======================
     START ONLY ONCE IN VIEW
  ====================== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true;
        startAutoPlay();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(slider);

  /* ======================
     HOVER PAUSE
  ====================== */
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', () => {
    if (hasStarted) startAutoPlay();
  });

  /* ======================
     TOUCH
  ====================== */
  let startX = 0;

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    stopAutoPlay();
  });

  slider.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;

    if (startX > endX + 50) goTo(index + 1);
    if (startX < endX - 50) goTo(index - 1);
  });

  /* ======================
     INIT
  ====================== */
  window.addEventListener('load', () => {
    setWidth();
    goTo(index, false);
    setActive();
  });

  window.addEventListener('resize', () => {
    setWidth();
    goTo(index, false);
  });
}