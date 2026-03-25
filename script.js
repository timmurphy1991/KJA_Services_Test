document.addEventListener('DOMContentLoaded',()=>{

/*---INTERSECTION_OBSERVER---*/
const observer=new IntersectionObserver(e=>{
e.forEach(t=>{
if(t.isIntersecting){
t.target.classList.add('visible');
observer.unobserve(t.target);
}
});
},{threshold:.3});

document.querySelectorAll('.slide-in,.fade-in,.banner-overlay')
.forEach(e=>observer.observe(e));

/*---BANNER_VIDEO---*/
const bannerVideo=document.querySelector('.banner-video');
const video=document.querySelector('.banner-video-native');

if(video&&bannerVideo){
video.addEventListener('loadeddata',()=>{
bannerVideo.classList.add('loaded');
});
window.addEventListener('load',()=>{
video.load();
});
}

/*---MOBILE_MENU---*/
const toggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('.mobile-menu');
const mobileDropdowns=document.querySelectorAll('.mobile-dropdown');
const mobileLinks=document.querySelectorAll('.mobile-menu a');

if(toggle&&mobileMenu){

const closeMenu=()=>{
toggle.classList.remove('active');
mobileMenu.classList.remove('active');
document.body.classList.remove('menu-open');
};

toggle.addEventListener('click',()=>{
toggle.classList.toggle('active');
mobileMenu.classList.toggle('active');
document.body.classList.toggle('menu-open');
});

mobileLinks.forEach(link=>{
link.addEventListener('click',closeMenu);
});

mobileDropdowns.forEach(drop=>{
const title=drop.querySelector('.mobile-title');
if(!title)return;

title.addEventListener('click',()=>{
drop.classList.toggle('active');
});
});

window.addEventListener('resize',()=>{
if(window.innerWidth>1024)closeMenu();
});

}

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

window.addEventListener('scroll',()=>{
if(!ticking){
requestAnimationFrame(()=>{
updateHeader();
ticking=false;
});
ticking=true;
}
});

updateHeader();

/*---CAROUSEL---*/
const slider=document.querySelector('.carousel');
const slides=document.querySelectorAll('.slide');
const nextBtn=document.querySelector('.next');
const prevBtn=document.querySelector('.prev');

if(slider&&slides.length){

let index=0;
let slideWidth=slides[0].offsetWidth;
let gap=parseFloat(getComputedStyle(slider).gap)||0;

const updateSizes=()=>{
slideWidth=slides[0].offsetWidth;
gap=parseFloat(getComputedStyle(slider).gap)||0;
};

const updatePosition=()=>{
slider.style.transform=`translate3d(${-index*(slideWidth+gap)}px,0,0)`;
};

const goTo=(i)=>{
index=(i+slides.length)%slides.length;

slider.style.transition="transform .6s cubic-bezier(.22,.61,.36,1)";
updatePosition();

slides.forEach(s=>s.classList.remove('active'));
slides[index].classList.add('active');
};

/* AUTOPLAY */
let auto=setInterval(()=>goTo(index+1),3500);

const pause=()=>{
clearInterval(auto);
setTimeout(()=>auto=setInterval(()=>goTo(index+1),3500),5000);
};

/* BUTTONS */
nextBtn?.addEventListener('click',()=>{
goTo(index+1);
pause();
});

prevBtn?.addEventListener('click',()=>{
goTo(index-1);
pause();
});

/* RESIZE */
window.addEventListener('resize',()=>{
updateSizes();
updatePosition();
});

/* INIT */
updateSizes();
updatePosition();

}

});
