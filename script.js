document.addEventListener('DOMContentLoaded',()=>{

/*---INTERSECTION_OBSERVER---*/

const observer=new IntersectionObserver(e=>{e.forEach(t=>{if(t.isIntersecting){t.target.classList.add('visible');observer.unobserve(t.target)}})},{threshold:.3});
document.querySelectorAll('.slide-in,.fade-in,.banner-overlay').forEach(e=>observer.observe(e));

/*---BANNER_VIDEO---*/

const bannerVideo=document.querySelector('.banner-video');
const video=document.querySelector('.banner-video-native');
if(video&&bannerVideo){
video.addEventListener('loadeddata',()=>bannerVideo.classList.add('loaded'));
window.addEventListener('load',()=>video.load());
}

/*---MOBILE_MENU---*/

const toggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('.mobile-menu');
const mobileDropdowns=document.querySelectorAll('.mobile-dropdown');
const mobileLinks=document.querySelectorAll('.mobile-menu a');

const closeMobileMenu=()=>{
toggle?.classList.remove('active');
mobileMenu?.classList.remove('active');
document.body.classList.remove('menu-open');
};

toggle?.addEventListener('click',()=>{
toggle.classList.toggle('active');
mobileMenu.classList.toggle('active');
document.body.classList.toggle('menu-open');
});

mobileLinks.forEach(l=>l.addEventListener('click',closeMobileMenu));

mobileDropdowns.forEach(d=>{
const t=d.querySelector('.mobile-title');
if(!t)return;
t.addEventListener('click',()=>{
mobileDropdowns.forEach(x=>{if(x!==d)x.classList.remove('active')});
d.classList.toggle('active');
});
});

window.addEventListener('resize',()=>{if(window.innerWidth>1024)closeMobileMenu()});

/*---HEADER_SCROLL---*/

const header=document.querySelector('.site-header');
const banner=document.querySelector('.banner');

const updateHeader=()=>{
if(!header)return;
header.classList.toggle('scrolled',window.scrollY>80);
if(banner){
const h=banner.offsetHeight;
header.classList.toggle('is-overlay',window.scrollY<h-80);
}
};

let ticking=false;
const onScroll=()=>{
if(!ticking){
requestAnimationFrame(()=>{updateHeader();ticking=false});
ticking=true;
}
};

updateHeader();
window.addEventListener('scroll',onScroll);

/*---CAROUSEL---*/

const slider = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

if (slider && slides.length) {

let index = 0;
let slideWidth = 0;
let gap = 0;
let autoTimer = null;
let isAnimating = false;
let hasStarted = false;

/* --- MEASURE WIDTH (iOS-safe) --- */
const setWidth = () => {
  const styles = getComputedStyle(slider);
  gap = parseFloat(styles.gap) || 0;

  const rect = slides[0].getBoundingClientRect();
  slideWidth = Math.round(rect.width + gap);
};

/* --- MOVE SLIDE --- */
const moveTo = (i, animate = true) => {
  if (isAnimating && animate) return;

  index = (i + slides.length) % slides.length;
  const offset = index * slideWidth;

  isAnimating = animate;

  slider.style.transition = animate ? "transform 0.6s ease" : "none";
  slider.style.transform = `translate3d(${-offset}px,0,0)`;

  slides.forEach(s => s.classList.remove('active'));
  slides[index].classList.add('active');
};

/* --- UNLOCK AFTER TRANSITION --- */
slider.addEventListener('transitionend', () => {
  isAnimating = false;
});

/* --- AUTO PLAY (no drift) --- */
const startAuto = () => {
  if (autoTimer) return;

  autoTimer = setInterval(() => {
    if (!isAnimating) moveTo(index + 1);
  }, 3200);
};

const stopAuto = () => {
  clearInterval(autoTimer);
  autoTimer = null;
};

/* --- INTERSECTION OBSERVER (KEY FIX) --- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      // 🔥 ALWAYS re-sync on re-entry (fixes iOS issue)
      setWidth();
      moveTo(index, false);

      if (!hasStarted) {
        hasStarted = true;
        startAuto();
      }
    } else {
      // Optional: pause when off-screen (saves performance)
      stopAuto();
    }
  });
}, { threshold: 0.3 });

observer.observe(slider);

/* --- BUTTONS --- */
nextBtn?.addEventListener('click', () => {
  moveTo(index + 1);
  stopAuto();
  startAuto();
});

prevBtn?.addEventListener('click', () => {
  moveTo(index - 1);
  stopAuto();
  startAuto();
});

/* --- INITIAL LOAD (wait for layout stability) --- */
window.addEventListener('load', () => {
  setWidth();
  moveTo(0, false);
});

/* --- iOS ORIENTATION FIX --- */
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    setWidth();
    moveTo(index, false);
  }, 300);
});

/* --- RESIZE --- */
window.addEventListener('resize', () => {
  setWidth();
  moveTo(index, false);
});

}
