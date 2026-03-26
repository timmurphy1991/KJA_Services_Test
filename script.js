document.addEventListener('DOMContentLoaded',()=>{

/*---FADE-IN/SLIDE-IN---*/

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

/* VIDEO */

const banner=document.querySelector('.banner-video');
if(banner)setTimeout(()=>banner.classList.add('loaded'),600);

window.addEventListener('load',()=>{
const v=document.querySelector('.banner-video-native');
if(v)v.load();
});

/*---MOBILE_MENU---*/

const toggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('.mobile-menu');

toggle?.addEventListener('click',()=>{
toggle.classList.toggle('active');
mobileMenu.classList.toggle('active');
document.body.classList.toggle('menu-open');
});

document.querySelectorAll('.mobile-menu a').forEach(e=>{
e.addEventListener('click',()=>{
toggle?.classList.remove('active');
mobileMenu?.classList.remove('active');
document.body.classList.remove('menu-open');
});
});

document.querySelectorAll('.mobile-dropdown').forEach(drop=>{
drop.querySelector('.mobile-title')?.addEventListener('click',()=>{
document.querySelectorAll('.mobile-dropdown')
.forEach(d=>d!==drop&&d.classList.remove('active'));
drop.classList.toggle('active');
});
});

/*---HEADER---*/

const header=document.querySelector('.site-header');
const hero=document.querySelector('.banner');

function updateHeader(){
if(!header)return;
header.classList.toggle('scrolled',window.scrollY>90);
if(hero){
const h=hero.offsetHeight;
header.classList.toggle('is-overlay',window.scrollY<h-90);
}
}

updateHeader();
window.addEventListener('scroll',()=>requestAnimationFrame(updateHeader));

/*---CAROUSEL---*/

const slider=document.querySelector('.carousel');
const slides=document.querySelectorAll('.slide');
const next=document.querySelector('.next');
const prev=document.querySelector('.prev');

if(!slider||!slides.length)return;

let i=0,w=0,g=0,auto=null,resume=null;

function size(){
g=parseFloat(getComputedStyle(slider).gap)||0;
w=slides[0].offsetWidth+g;
move(i,false);
}

function move(n,a=true){
i=(n+slides.length)%slides.length;
const x=Math.round(i*w);
slider.style.transition=a?"transform .6s ease":"none";
slider.style.transform=`translate3d(-${x}px,0,0)`;
slides.forEach(s=>s.classList.remove('active'));
slides[i].classList.add('active');
}

function start(){
if(auto)return;
auto=setInterval(()=>move(i+1),3000);
}

function stop(){
clearInterval(auto);
auto=null;
}

function pause(){
stop();
clearTimeout(resume);
resume=setTimeout(start,6000);
}

function inView(){
const r=slider.getBoundingClientRect();
if(r.top<window.innerHeight*.9&&r.bottom>0){
start();
window.removeEventListener('scroll',inView);
}
}

window.addEventListener('scroll',inView);
inView();

next?.addEventListener('click',()=>{move(i+1);pause();});
prev?.addEventListener('click',()=>{move(i-1);pause();});

let t;
window.addEventListener('resize',()=>{
clearTimeout(t);
t=setTimeout(size,100);
});

size();
move(0,false);

});