/* empty css                      */(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))u(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&u(o)}).observe(document,{childList:!0,subtree:!0});function i(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function u(e){if(e.ep)return;e.ep=!0;const t=i(e);fetch(e.href,t)}})();lucide.createIcons();const w=new Lenis({duration:1.2,easing:n=>Math.min(1,1.001-Math.pow(2,-10*n)),smooth:!0});function f(n){w.raf(n),requestAnimationFrame(f)}requestAnimationFrame(f);const y=document.querySelector(".header__burger"),E=document.querySelector(".mobile-menu__close"),d=document.querySelector(".mobile-menu"),R=document.querySelectorAll(".mobile-menu__link, .mobile-menu__btn");function a(){d.classList.toggle("is-open"),d.classList.contains("is-open")?document.body.style.overflow="hidden":document.body.style.overflow=""}y.addEventListener("click",a);E.addEventListener("click",a);R.forEach(n=>{n.addEventListener("click",a)});const m=document.getElementById("canvas-container");if(m){let l=function(){requestAnimationFrame(l);const c=g.getElapsedTime();s.uTime.value=c,t.x+=(o.x-t.x)*.05,t.y+=(o.y-t.y)*.05,i.render(n,r)};const n=new THREE.Scene,r=new THREE.OrthographicCamera(-1,1,1,-1,0,1),i=new THREE.WebGLRenderer({alpha:!0});i.setSize(window.innerWidth,window.innerHeight),m.appendChild(i.domElement);const e=new THREE.TextureLoader().load("https://picsum.photos/1920/1080?grayscale&blur=2"),t=new THREE.Vector2(0,0),o=new THREE.Vector2(0,0),s={uTime:{value:0},uTexture:{value:e},uMouse:{value:t},uResolution:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)}},v=new THREE.ShaderMaterial({uniforms:s,vertexShader:`
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
                
                // Aspect ratio correction
                float aspect = uResolution.x / uResolution.y;
                
                // Mouse influence calculation
                vec2 mousePoint = uMouse;
                mousePoint.x *= aspect; // correct mouse aspect
                
                vec2 uvAspect = uv;
                uvAspect.x *= aspect; // correct uv aspect
                
                // Distance from mouse
                float dist = distance(uvAspect, mousePoint);
                
                // Ripple effect logic
                float strength = 0.05; // Distortion strength
                float radius = 0.35;    // Radius of effect
                
                // Create a smooth circle of influence
                float influence = smoothstep(radius, 0.0, dist);
                
                // Distort UVs based on influence
                uv.x += influence * (uv.x - uMouse.x) * strength;
                uv.y += influence * (uv.y - uMouse.y) * strength;

                // Color tint (Machina Acid green tint on interaction)
                vec4 color = texture2D(uTexture, uv);
                
                // Add subtle scanline effect
                float scanline = sin(uv.y * 800.0) * 0.02;
                color.rgb += scanline;

                gl_FragColor = color;
            }
        `}),p=new THREE.PlaneGeometry(2,2),h=new THREE.Mesh(p,v);n.add(h),document.addEventListener("mousemove",c=>{o.x=c.clientX/window.innerWidth,o.y=1-c.clientY/window.innerHeight}),window.addEventListener("resize",()=>{i.setSize(window.innerWidth,window.innerHeight),s.uResolution.value.x=window.innerWidth,s.uResolution.value.y=window.innerHeight});const g=new THREE.Clock;l()}console.log("Machina Shift: Systems Operational");
//# sourceMappingURL=index.js.map
