// Portfolio Interaction Script
// Typed text effect (simple lightweight implementation)
const roles = [
  'Full Stack Developer',
  'JavaScript Enthusiast',
  'Problem Solver',
  'Open Source Contributor'
];
let typedIndex = 0;
let charIndex = 0;
let deleting = false;
const typedEl = document.getElementById('typed');
function typeLoop(){
  if(!typedEl) return;
  const current = roles[typedIndex];
  if(!deleting){
    typedEl.textContent = current.slice(0, ++charIndex);
    if(charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if(charIndex === 0){
      deleting = false;
      typedIndex = (typedIndex + 1) % roles.length;
    }
  }
  const delay = deleting ? 40 : 90;
  setTimeout(typeLoop, delay);
}
requestAnimationFrame(typeLoop);

// Year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if(navToggle && navList){
  navToggle.addEventListener('click', ()=>{
    const show = navList.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', show);
  });
}

// Intersection Observer for reveal animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.15});

document.querySelectorAll('.section, .project-card, .timeline-item, .skill').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Animated numbers
const numObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count,10) || 0;
      let start = 0;
      const duration = 1400;
      const startTime = performance.now();
      function update(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value + (el.textContent.includes('+') ? '+' : '');
        if(progress < 1){
          requestAnimationFrame(update);
        } else {
          el.textContent = target + '+';
        }
      }
      requestAnimationFrame(update);
      numObserver.unobserve(el);
    }
  });
},{threshold:0.5});

document.querySelectorAll('.num').forEach(el => numObserver.observe(el));

// Canvas Orb (simple animated gradient blob)
const canvas = document.getElementById('orbCanvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
  }
  window.addEventListener('resize', resize);
  resize();

  let t = 0;
  function draw(){
    t += 0.01;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    const cx = w/2 + Math.sin(t*0.7)*w*0.08;
    const cy = h/2 + Math.cos(t*0.9)*h*0.08;
    const r = Math.min(w,h)*0.35 + Math.sin(t)*10;
    const grd = ctx.createRadialGradient(cx,cy, r*0.2, cx,cy,r);
    grd.addColorStop(0,'rgba(99,102,241,0.9)');
    grd.addColorStop(0.45,'rgba(139,92,246,0.55)');
    grd.addColorStop(1,'rgba(12,15,29,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.fill();
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

// Active nav link highlighting
const sections = Array.from(document.querySelectorAll('section[id]'));
function onScroll(){
  const scrollPos = window.scrollY + 120;
  let current = sections[0];
  for(const sec of sections){
    if(sec.offsetTop <= scrollPos) current = sec;
  }
  document.querySelectorAll('.nav-list a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
}
window.addEventListener('scroll', onScroll, {passive:true});
requestAnimationFrame(onScroll);
