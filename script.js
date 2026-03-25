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
header.classList.toggle('scrolled',window.scrollY>90);
if(banner){
const h=banner.offsetHeight;
header.classList.toggle('is-overlay',window.scrollY<h-90);
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

const slider=document.querySelector('.carousel');
const slides=document.querySelectorAll('.slide');
const nextBtn=document.querySelector('.next');
const prevBtn=document.querySelector('.prev');

if(slider&&slides.length){

let index=0,slideWidth=0,gap=0,autoTimer=null,resumeTimer=null,hasStarted=false;

const setWidth=()=>{
const s=getComputedStyle(slider);
gap=parseFloat(s.gap)||0;
slideWidth=slides[0].getBoundingClientRect().width+gap;
moveTo(index,false);
};

const moveTo=(i,a=true)=>{
index=(i+slides.length)%slides.length;
const offset=index*slideWidth;
slider.style.transition=a?"transform .6s":"none";
slider.style.transform=`translate3d(${-offset}px,0,0)`;
slides.forEach(s=>s.classList.remove('active'));
slides[index].classList.add('active');
};

const startAuto=()=>{
if(autoTimer)return;
autoTimer=setInterval(()=>moveTo(index+1),3000);
};

const stopAuto=()=>{
clearInterval(autoTimer);
autoTimer=null;
};

const pause=()=>{
stopAuto();
clearTimeout(resumeTimer);
resumeTimer=setTimeout(startAuto,6000);
};

const checkInView=()=>{
if(hasStarted)return;
const r=slider.getBoundingClientRect();
const vh=window.innerHeight;
if(r.top<vh*.8&&r.bottom>0){
hasStarted=true;
startAuto();
window.removeEventListener('scroll',checkInView);
}
};

window.addEventListener('scroll',checkInView);
checkInView();

nextBtn?.addEventListener('click',()=>{moveTo(index+1);pause()});
prevBtn?.addEventListener('click',()=>{moveTo(index-1);pause()});

setWidth();
moveTo(0,false);
window.addEventListener('resize',setWidth);

}

});