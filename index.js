/* empty css                      */(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(e){if(e.ep)return;e.ep=!0;const o=r(e);fetch(e.href,o)}})();document.addEventListener("DOMContentLoaded",()=>{console.log("DOM Loaded. Initializing Machina Shift...");try{typeof lucide<"u"?lucide.createIcons():console.warn("Lucide icons library not loaded")}catch(n){console.error("Icons Error:",n)}p(),y(),w()});function p(){try{const n=document.querySelector(".header__burger"),t=document.querySelector(".mobile-menu__close"),r=document.querySelector(".mobile-menu"),i=document.querySelectorAll(".mobile-menu__link, .mobile-menu__btn");if(!n||!r){console.warn("Mobile menu elements not found in HTML");return}const e=()=>{r.classList.toggle("is-open"),document.body.style.overflow=r.classList.contains("is-open")?"hidden":""};n.addEventListener("click",o=>{o.stopPropagation(),e()}),t&&t.addEventListener("click",e),i.forEach(o=>{o.addEventListener("click",e)})}catch(n){console.error("Mobile Menu Error:",n)}}function y(){try{let t=function(r){n.raf(r),requestAnimationFrame(t)};if(typeof Lenis>"u")return;const n=new Lenis({duration:1.2,easing:r=>Math.min(1,1.001-Math.pow(2,-10*r)),smooth:!0});requestAnimationFrame(t)}catch(n){console.error("Lenis Error:",n)}}function w(){const n=document.getElementById("canvas-container");if(n){if(typeof THREE>"u"){console.error("Three.js library is not loaded!");return}try{let d=function(){requestAnimationFrame(d);const s=g.getElapsedTime();a.uTime.value=s,u.x+=(l.x-u.x)*.08,u.y+=(l.y-u.y)*.08,i.render(t,r)};const t=new THREE.Scene,r=new THREE.OrthographicCamera(-1,1,1,-1,0,1),i=new THREE.WebGLRenderer({alpha:!0,antialias:!0});i.setSize(window.innerWidth,window.innerHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.appendChild(i.domElement);const e=new THREE.TextureLoader;e.setCrossOrigin("anonymous");const c=e.load("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",()=>{console.log("Texture loaded successfully")},void 0,s=>{console.error("Texture load error:",s)}),u=new THREE.Vector2(0,0),l=new THREE.Vector2(0,0),a={uTime:{value:0},uTexture:{value:c},uMouse:{value:u},uResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)},uHover:{value:0}},f=new THREE.ShaderMaterial({uniforms:a,vertexShader:`
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
                    
                    // Liquid Distortion Logic
                    float influence = smoothstep(0.4, 0.0, dist);
                    
                    uv.x += influence * (uv.x - uMouse.x) * 0.15; // Increased strength
                    uv.y += influence * (uv.y - uMouse.y) * 0.15;

                    vec4 color = texture2D(uTexture, uv);
                    
                    // Darken image slightly to make text readable
                    color.rgb *= 0.4; 
                    
                    // Acid Green Tint based on movement
                    color.rgb += vec3(influence * 0.2, influence * 0.4, 0.0);

                    gl_FragColor = color;
                }
            `}),v=new THREE.PlaneGeometry(2,2),h=new THREE.Mesh(v,f);t.add(h),document.addEventListener("mousemove",s=>{l.x=s.clientX/window.innerWidth,l.y=1-s.clientY/window.innerHeight}),window.addEventListener("resize",()=>{const s=window.innerWidth,m=window.innerHeight;i.setSize(s,m),a.uResolution.value.x=s,a.uResolution.value.y=m});const g=new THREE.Clock;d()}catch(t){console.error("Three.js Logic Error:",t)}}}
//# sourceMappingURL=index.js.map
