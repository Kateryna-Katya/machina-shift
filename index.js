/* empty css                      */(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=r(t);fetch(t.href,o)}})();document.addEventListener("DOMContentLoaded",()=>{console.log("DOM Loaded. Initializing Machina Shift..."),h(),y(),E(),w(),b(),x(),L(),T()});function h(){try{typeof lucide<"u"?lucide.createIcons():console.warn("Lucide library not found")}catch(n){console.error("Icons Error:",n)}}function y(){try{let e=function(r){n.raf(r),requestAnimationFrame(e)};if(typeof Lenis>"u")return;const n=new Lenis({duration:1.2,easing:r=>Math.min(1,1.001-Math.pow(2,-10*r)),direction:"vertical",smooth:!0});requestAnimationFrame(e)}catch(n){console.error("Lenis Error:",n)}}function E(){try{const n=document.querySelector(".header__burger"),e=document.querySelector(".mobile-menu__close"),r=document.querySelector(".mobile-menu"),i=document.querySelectorAll(".mobile-menu__link, .mobile-menu__btn");if(!n||!r)return;const t=()=>{r.classList.toggle("is-open"),document.body.style.overflow=r.classList.contains("is-open")?"hidden":""};n.addEventListener("click",o=>{o.stopPropagation(),t()}),e&&e.addEventListener("click",t),i.forEach(o=>{o.addEventListener("click",t)})}catch(n){console.error("Mobile Menu Error:",n)}}function w(){const n=document.getElementById("canvas-container");if(n){if(typeof THREE>"u"){console.error("Three.js not loaded");return}try{let f=function(){requestAnimationFrame(f);const u=a.getElapsedTime();d.uTime.value=u,s.x+=(l.x-s.x)*.08,s.y+=(l.y-s.y)*.08,i.render(e,r)};const e=new THREE.Scene,r=new THREE.OrthographicCamera(-1,1,1,-1,0,1),i=new THREE.WebGLRenderer({alpha:!0,antialias:!0});i.setSize(window.innerWidth,window.innerHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.appendChild(i.domElement);const t=new THREE.TextureLoader;t.setCrossOrigin("anonymous");const c=t.load("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",()=>{},void 0,()=>console.warn("Texture failed to load")),s=new THREE.Vector2(0,0),l=new THREE.Vector2(0,0),d={uTime:{value:0},uTexture:{value:c},uMouse:{value:s},uResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)}},m=new THREE.ShaderMaterial({uniforms:d,vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float uTime;
                uniform sampler2D uTexture;
                uniform vec2 uMouse;
                uniform vec2 uResolution;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    float aspect = uResolution.x / uResolution.y;
                    
                    vec2 mousePoint = uMouse;
                    mousePoint.x *= aspect;
                    
                    vec2 uvAspect = uv;
                    uvAspect.x *= aspect;
                    
                    float dist = distance(uvAspect, mousePoint);
                    float influence = smoothstep(0.45, 0.0, dist);
                    
                    uv.x += influence * (uv.x - uMouse.x) * 0.2; 
                    uv.y += influence * (uv.y - uMouse.y) * 0.2;

                    vec4 color = texture2D(uTexture, uv);
                    color.rgb *= 0.3; // Darken
                    color.rgb += vec3(influence * 0.15, influence * 0.3, 0.0); // Neon tint

                    gl_FragColor = color;
                }
            `}),v=new THREE.PlaneGeometry(2,2),p=new THREE.Mesh(v,m);e.add(p),document.addEventListener("mousemove",u=>{l.x=u.clientX/window.innerWidth,l.y=1-u.clientY/window.innerHeight}),window.addEventListener("resize",()=>{const u=window.innerWidth,g=window.innerHeight;i.setSize(u,g),d.uResolution.value.x=u,d.uResolution.value.y=g});const a=new THREE.Clock;f()}catch(e){console.error("Three.js Error:",e)}}}function b(){const n=document.querySelector(".stats-grid"),e=document.querySelectorAll(".stat-number");let r=!1;if(!n||e.length===0)return;new IntersectionObserver(t=>{t.forEach(o=>{o.isIntersecting&&!r&&(r=!0,e.forEach(c=>{const s=parseFloat(c.getAttribute("data-target")),l=s%1!==0,d=2e3,m=20,v=d/m,p=s/v;let a=0;const f=setInterval(()=>{a+=p,a>=s&&(a=s,clearInterval(f)),c.innerText=l?a.toFixed(1):Math.round(a)},m)}))})},{threshold:.5}).observe(n)}function x(){document.querySelectorAll(".accordion-header").forEach(e=>{e.addEventListener("click",()=>{const i=e.parentElement.querySelector(".accordion-body"),t=e.classList.contains("active");document.querySelectorAll(".accordion-header").forEach(o=>{o.classList.remove("active"),o.setAttribute("aria-expanded","false"),o.nextElementSibling&&(o.nextElementSibling.style.maxHeight=null)}),t||(e.classList.add("active"),e.setAttribute("aria-expanded","true"),i.style.maxHeight=i.scrollHeight+"px")})})}function L(){const n=document.getElementById("lead-form"),e=document.getElementById("form-message");n&&n.addEventListener("submit",r=>{r.preventDefault();const i=document.getElementById("captcha");if(parseInt(i.value)!==8){e.textContent="Ошибка: неверное решение (5 + 3 = 8).",e.className="form-message error";return}const t=n.querySelector('button[type="submit"]'),o=t.textContent;t.textContent="Отправка...",t.disabled=!0,setTimeout(()=>{e.textContent="Успешно! Мы свяжемся с вами.",e.className="form-message success",n.reset(),t.textContent=o,t.disabled=!1,setTimeout(()=>{e.textContent="",e.className="form-message"},5e3)},1500)})}function T(){const n=document.getElementById("cookie-popup"),e=document.getElementById("accept-cookies");!n||!e||(localStorage.getItem("cookiesAccepted")||setTimeout(()=>{n.classList.add("show")},2e3),e.addEventListener("click",()=>{localStorage.setItem("cookiesAccepted","true"),n.classList.remove("show")}))}
//# sourceMappingURL=index.js.map
