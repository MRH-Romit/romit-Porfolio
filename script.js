// Portfolio Interaction Script
// Typed text effect (simple lightweight implementation)
(()=>{
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const roles = [
    'Full Stack Developer',
    'ML Explorer',
    'DevOps Learner',
    'Open Source Contributor',
    'CSE Student (UIU)'
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
(()=>{
  const targets = document.querySelectorAll('.section, .project-card, .timeline-item, .skill');
  if(!targets.length) return;
  targets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} });
  },{threshold:0.16, rootMargin:'0px 0px -40px'});
  targets.forEach(el => io.observe(el));
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

// 3D Hero (rotating wireframe model using Three.js)
(()=>{
  const canvas = document.getElementById('hero3d');
  if(!canvas || !window.THREE) return;
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(prefersReduce) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0,0,6);
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  const resize = ()=>{
    const w = canvas.clientWidth; const h = canvas.clientHeight; renderer.setSize(w,h,false); camera.aspect = w/h || 1; camera.updateProjectionMatrix();
  }; resize(); window.addEventListener('resize', resize, {passive:true});
  const group = new THREE.Group(); scene.add(group);
  const geo1 = new THREE.IcosahedronGeometry(2,1);
  const mat1 = new THREE.MeshBasicMaterial({wireframe:true,color:0x5a63f2,transparent:true,opacity:0.6});
  const mesh1 = new THREE.Mesh(geo1,mat1); group.add(mesh1);
  const geo2 = new THREE.TorusKnotGeometry(1.2,0.35,120,16);
  const mat2 = new THREE.MeshBasicMaterial({wireframe:true,color:0xd84fb3,transparent:true,opacity:0.35});
  const mesh2 = new THREE.Mesh(geo2,mat2); group.add(mesh2);
  mesh2.rotation.x = Math.PI/3;
  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    mesh1.rotation.y = t*0.25; mesh1.rotation.x = t*0.18;
    mesh2.rotation.y = t*0.3; mesh2.rotation.z = t*0.12;
    group.rotation.y = Math.sin(t*0.1)*0.4;
    renderer.render(scene,camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

// Dynamic GitHub Projects (fetch top starred repos)
(()=>{
  const grid = document.getElementById('projectsGrid');
  if(!grid || !window.fetch) return;
  const username = 'MRH-Romit';
  fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
    .then(r=>r.ok?r.json():Promise.reject(r.status))
    .then(repos=>{
      const filtered = repos.filter(r=>!r.fork && !r.private);
      filtered.sort((a,b)=> (b.stargazers_count - a.stargazers_count) || (b.forks_count - a.forks_count));
      const top = filtered.slice(0,3);
      if(!top.length) return;
      // Remove existing static cards (keep first parent container clean)
      grid.innerHTML = '';
      top.forEach(repo=>{
        const el = document.createElement('article'); el.className='project-card reveal';
        el.innerHTML = `
          <div class="project-media skeleton" title="${repo.name}"></div>
          <div class="project-content">
            <h3>${repo.name}</h3>
            <p>${(repo.description||'').slice(0,140) || 'No description provided.'}</p>
            <ul class="tags">
              <li>${repo.language || 'Code'}</li>
              <li>★ ${repo.stargazers_count}</li>
              <li>Forks ${repo.forks_count}</li>
            </ul>
            <div class="links">
              ${repo.homepage?`<a href="${repo.homepage}" class="btn btn-small btn-primary-outline" target="_blank" rel="noopener">Live</a>`:''}
              <a href="${repo.html_url}" class="btn btn-small btn-ghost" target="_blank" rel="noopener">Code</a>
            </div>
          </div>`;
        grid.appendChild(el);
      });
    })
    .catch(()=>{});
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
