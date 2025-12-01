/* empty css                      */(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const t of n)if(t.type==="childList")for(const c of t.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(n){const t={};return n.integrity&&(t.integrity=n.integrity),n.referrerPolicy&&(t.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?t.credentials="include":n.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(n){if(n.ep)return;n.ep=!0;const t=r(n);fetch(n.href,t)}})();document.addEventListener("DOMContentLoaded",()=>{console.log("DOM Loaded. Initializing Machina Shift..."),y(),h(),E(),w(),b(),x(),L()});function y(){try{typeof lucide<"u"?(lucide.createIcons(),console.log("Icons initialized")):console.warn("Lucide library not found")}catch(o){console.error("Icons Error:",o)}}function h(){try{let e=function(r){o.raf(r),requestAnimationFrame(e)};if(typeof Lenis>"u")return;const o=new Lenis({duration:1.2,easing:r=>Math.min(1,1.001-Math.pow(2,-10*r)),direction:"vertical",smooth:!0});requestAnimationFrame(e),console.log("Smooth Scroll initialized")}catch(o){console.error("Lenis Error:",o)}}function E(){try{const o=document.querySelector(".header__burger"),e=document.querySelector(".mobile-menu__close"),r=document.querySelector(".mobile-menu"),i=document.querySelectorAll(".mobile-menu__link, .mobile-menu__btn");if(!o||!r){console.warn("Mobile menu elements missing");return}const n=()=>{r.classList.toggle("is-open"),document.body.style.overflow=r.classList.contains("is-open")?"hidden":""};o.addEventListener("click",t=>{t.stopPropagation(),n()}),e&&e.addEventListener("click",n),i.forEach(t=>{t.addEventListener("click",n)}),console.log("Mobile Menu initialized")}catch(o){console.error("Mobile Menu Error:",o)}}function w(){const o=document.getElementById("canvas-container");if(o){if(typeof THREE>"u"){console.error("Three.js not loaded");return}try{let d=function(){requestAnimationFrame(d);const s=v.getElapsedTime();u.uTime.value=s,l.x+=(a.x-l.x)*.08,l.y+=(a.y-l.y)*.08,i.render(e,r)};const e=new THREE.Scene,r=new THREE.OrthographicCamera(-1,1,1,-1,0,1),i=new THREE.WebGLRenderer({alpha:!0,antialias:!0});i.setSize(window.innerWidth,window.innerHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),o.appendChild(i.domElement);const n=new THREE.TextureLoader;n.setCrossOrigin("anonymous");const c=n.load("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",()=>{},void 0,()=>{console.warn("Texture load failed, using fallback color")}),l=new THREE.Vector2(0,0),a=new THREE.Vector2(0,0),u={uTime:{value:0},uTexture:{value:c},uMouse:{value:l},uResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)}},f=new THREE.ShaderMaterial({uniforms:u,vertexShader:`
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
                    
                    // Эффект жидкости (искажение)
                    float influence = smoothstep(0.45, 0.0, dist);
                    
                    uv.x += influence * (uv.x - uMouse.x) * 0.2; 
                    uv.y += influence * (uv.y - uMouse.y) * 0.2;

                    vec4 color = texture2D(uTexture, uv);
                    
                    // Затемнение фона для читаемости текста
                    color.rgb *= 0.3; 
                    
                    // Неоновый зеленый тинт при наведении
                    color.rgb += vec3(influence * 0.15, influence * 0.3, 0.0);

                    gl_FragColor = color;
                }
            `}),g=new THREE.PlaneGeometry(2,2),p=new THREE.Mesh(g,f);e.add(p),document.addEventListener("mousemove",s=>{a.x=s.clientX/window.innerWidth,a.y=1-s.clientY/window.innerHeight}),window.addEventListener("resize",()=>{const s=window.innerWidth,m=window.innerHeight;i.setSize(s,m),u.uResolution.value.x=s,u.uResolution.value.y=m});const v=new THREE.Clock;d(),console.log("Hero Animation initialized")}catch(e){console.error("Three.js Error:",e)}}}function b(){const o=document.querySelectorAll(".accordion-header");o.length!==0&&(o.forEach(e=>{e.addEventListener("click",()=>{const i=e.parentElement.querySelector(".accordion-body"),n=e.classList.contains("active");document.querySelectorAll(".accordion-header").forEach(t=>{t.classList.remove("active"),t.setAttribute("aria-expanded","false"),t.nextElementSibling&&(t.nextElementSibling.style.maxHeight=null)}),n||(e.classList.add("active"),e.setAttribute("aria-expanded","true"),i.style.maxHeight=i.scrollHeight+"px")})}),console.log("Accordion initialized"))}function x(){const o=document.getElementById("lead-form"),e=document.getElementById("form-message");o&&(o.addEventListener("submit",r=>{r.preventDefault();const i=document.getElementById("captcha"),n=i?i.value:"";if(parseInt(n)!==8){e.textContent="Ошибка: неверное решение примера (5 + 3 = 8).",e.className="form-message error";return}const t=o.querySelector('button[type="submit"]'),c=t.textContent;t.textContent="Обработка...",t.disabled=!0,t.style.opacity="0.7",setTimeout(()=>{e.textContent="Успешно! Мы свяжемся с вами в ближайшее время.",e.className="form-message success",o.reset(),t.textContent=c,t.disabled=!1,t.style.opacity="1",setTimeout(()=>{e.textContent="",e.className="form-message"},5e3)},1500)}),console.log("Form initialized"))}function L(){const o=document.getElementById("cookie-popup"),e=document.getElementById("accept-cookies");!o||!e||(localStorage.getItem("cookiesAccepted")||setTimeout(()=>{o.classList.add("show")},2e3),e.addEventListener("click",()=>{localStorage.setItem("cookiesAccepted","true"),o.classList.remove("show")}),console.log("Cookies initialized"))}
//# sourceMappingURL=index.js.map
