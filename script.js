document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     SLIDE-IN TEXT
  ====================== */
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

  /* ======================
     BANNER OVERLAY FADE-IN
  ====================== */
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

  /* ======================
     FADE-IN SECTIONS
  ====================== */
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
     MOBILE MENU
  ====================== */
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

  /* ======================
     HEADER SCROLL BEHAVIOUR
  ====================== */
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
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (slider && slides.length && nextBtn && prevBtn) {

  let index = 0;
  const gap = 24;

  function updateSlider() {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');

    const slideWidth = slides[0].offsetWidth + gap;

    // IMPORTANT: prevent overscrolling
    const maxIndex = slides.length - 1;
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;

    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  /* Buttons */
  nextBtn.addEventListener('click', () => {
    index++;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    index--;
    updateSlider();
  });

  /* Auto-play (fixed) */
  let autoPlay;

  function startAutoPlay() {
    autoPlay = setInterval(() => {
      index++;
      updateSlider();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlay);
  }

  startAutoPlay();

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  /* Touch swipe */
  let startX = 0;

  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;

    if (startX > endX + 50) {
      index++;
    } else if (startX < endX - 50) {
      index--;
    }

    updateSlider();
  });

  /* Init */
  window.addEventListener('load', updateSlider);
  window.addEventListener('resize', updateSlider);
}
