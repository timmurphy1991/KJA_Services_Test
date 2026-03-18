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
