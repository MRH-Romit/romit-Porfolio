// Portfolio Interaction Script
// Typed text effect (simple lightweight implementation)
(()=>{
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roles = [
    'ML & Network Security Specialist',
    'UIU Robotics Sub Team Lead',
    'Open Source Contributor',
    '4th Year CSE Student',
    'Hardware & Software Integrator'
  ];
  let typedIndex = 0, charIndex = 0, deleting = false;
  const typedEl = document.getElementById('typed');
  function typeLoop(){
    if(!typedEl || prefersReduce) return;
    const current = roles[typedIndex];
    if(!deleting){
      typedEl.textContent = current.slice(0, ++charIndex);
      if(charIndex === current.length){
        deleting = true; setTimeout(typeLoop, 1400); return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIndex);
      if(charIndex === 0){ deleting = false; typedIndex = (typedIndex + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 38 : 88);
  }
  requestAnimationFrame(typeLoop);
})();

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
const registerReveal = (()=>{
  let io;
  function initObserver(){
    if(io) return io;
    io = new IntersectionObserver(entries => {
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
    },{threshold:0.16, rootMargin:'0px 0px -40px'});
    return io;
  }
  return function register(scope=document){
    const targets = scope.querySelectorAll('.reveal:not(.visible)');
    if(!targets.length) return;
    const observer = initObserver();
    targets.forEach(el => observer.observe(el));
  };
})();
// initial mark & register
document.querySelectorAll('.section, .project-card, .timeline-item, .skill, .achievement-card, .bio-card').forEach(el=>el.classList.add('reveal'));
registerReveal();

// Parallax effect for hero art
(()=>{
  const heroArt = document.querySelector('.hero-art');
  if(!heroArt) return;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduce) return;
  
  window.addEventListener('scroll', ()=>{
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    heroArt.style.transform = `translateY(${rate}px)`;
  }, {passive:true});
})();

// Animated numbers
(()=>{
  const nums = document.querySelectorAll('.num');
  if(!nums.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(!entry.isIntersecting) return;
      const el = entry.target; const target = parseInt(el.dataset.count,10)||0; const start=performance.now(); const dur=1250;
      const plus = el.textContent.trim().endsWith('+');
      function step(now){
        const p=Math.min((now-start)/dur,1); el.textContent = Math.floor(p*target)+(plus?'+':''); if(p<1) requestAnimationFrame(step); else el.textContent=target+(plus?'+':''); }
      requestAnimationFrame(step); io.unobserve(el);
    });
  },{threshold:0.45});
  nums.forEach(n=>io.observe(n));
})();

// Canvas Orb (simple animated gradient blob)
(()=>{
  const canvas = document.getElementById('orbCanvas');
  if(!canvas) return; const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduce) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = canvas.clientWidth * devicePixelRatio; canvas.height = canvas.clientHeight * devicePixelRatio; }
  window.addEventListener('resize', resize, {passive:true}); resize();
  let t=0; (function draw(){ t+=0.01; const {width:w,height:h}=canvas; ctx.clearRect(0,0,w,h); const cx=w/2+Math.sin(t*0.7)*w*0.08; const cy=h/2+Math.cos(t*0.9)*h*0.08; const r=Math.min(w,h)*0.35+Math.sin(t)*10; const g=ctx.createRadialGradient(cx,cy,r*0.2,cx,cy,r); g.addColorStop(0,'rgba(99,102,241,0.9)'); g.addColorStop(0.45,'rgba(139,92,246,0.55)'); g.addColorStop(1,'rgba(12,15,29,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill(); requestAnimationFrame(draw); })();
})();

// Modern Particle Network Animation for Hero
(()=>{
  const canvas = document.getElementById('hero3d');
  if(!canvas) return;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduce) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = {x: null, y: null, radius: 150};
  
  function resize(){
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    initParticles();
  }
  
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.baseX = x;
      this.baseY = y;
      this.density = Math.random() * 30 + 10;
      this.vx = Math.random() * 0.5 - 0.25;
      this.vy = Math.random() * 0.5 - 0.25;
    }
    
    draw() {
      ctx.fillStyle = `rgba(99, 102, 241, ${0.8 - this.size / 10})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    update() {
      // Mouse interaction
      if(mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        
        if(distance < mouse.radius) {
          this.x -= forceDirectionX * force * this.density * 0.6;
          this.y -= forceDirectionY * force * this.density * 0.6;
        }
      }
      
      // Return to base position
      const dx = this.baseX - this.x;
      const dy = this.baseY - this.y;
      this.x += dx * 0.05;
      this.y += dy * 0.05;
      
      // Gentle drift
      this.baseX += this.vx;
      this.baseY += this.vy;
      
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      
      if(this.baseX < 0 || this.baseX > w) this.vx *= -1;
      if(this.baseY < 0 || this.baseY > h) this.vy *= -1;
    }
  }
  
  function initParticles() {
    particles = [];
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const numberOfParticles = Math.min(Math.floor((w * h) / 15000), 100);
    
    for(let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particles.push(new Particle(x, y));
    }
  }
  
  function connectParticles() {
    for(let i = 0; i < particles.length; i++) {
      for(let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if(distance < 120) {
          const opacity = (1 - distance / 120) * 0.5;
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    
    // Draw gradient background
    const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)/2);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.03)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.01)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resize, {passive:true});
  resize();
  animate();
})();

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

// Scroll Progress Bar
(()=>{
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }
  
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(href === '#' || href === '#top') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if(target){
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // Close mobile nav if open
      const navList = document.querySelector('.nav-list');
      if(navList) navList.classList.remove('show');
    }
  });
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
if(storedTheme === 'light') document.body.classList.add('light');
if(themeToggle){
  themeToggle.addEventListener('click',()=>{
    document.body.classList.toggle('light');
    const mode = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('theme', mode);
    themeToggle.textContent = mode === 'light' ? '🌙' : '🌓';
  });
  themeToggle.textContent = document.body.classList.contains('light') ? '🌙' : '🌓';
}
