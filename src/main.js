document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded. Initializing Machina Shift...');

    // 1. ICONS (Lucide)
    // Оборачиваем в try-catch
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide icons library not loaded');
        }
    } catch (e) {
        console.error('Icons Error:', e);
    }

    // 2. MOBILE MENU (Logic isolated)
    initMobileMenu();

    // 3. SMOOTH SCROLL (Lenis)
    initSmoothScroll();

    // 4. HERO ANIMATION (Three.js)
    initHeroAnimation();
});

/* =========================================
   FUNCTION: MOBILE MENU
   ========================================= */
function initMobileMenu() {
    try {
        const burger = document.querySelector('.header__burger');
        const closeBtn = document.querySelector('.mobile-menu__close');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

        if (!burger || !mobileMenu) {
            console.warn('Mobile menu elements not found in HTML');
            return;
        }

        const toggleMenu = () => {
            mobileMenu.classList.toggle('is-open');
            document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
        };

        burger.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие
            toggleMenu();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', toggleMenu);
        }

        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });

    } catch (e) {
        console.error('Mobile Menu Error:', e);
    }
}

/* =========================================
   FUNCTION: SMOOTH SCROLL
   ========================================= */
function initSmoothScroll() {
    try {
        if (typeof Lenis === 'undefined') return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.error('Lenis Error:', e);
    }
}

/* =========================================
   FUNCTION: HERO ANIMATION (Three.js)
   ========================================= */
function initHeroAnimation() {
    const container = document.getElementById('canvas-container');
    
    // Проверки безопасности
    if (!container) return;
    if (typeof THREE === 'undefined') {
        console.error('Three.js library is not loaded!');
        return;
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Оптимизация для ретины
        container.appendChild(renderer.domElement);

        // Texture Loading with CORS fix
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous'); // ВАЖНО для загрузки картинок с других сайтов
        
        // Используем более надежный источник картинки или заглушку, если картинка не грузится
        // Попробуем простую абстракцию, если picsum заблокирован политиками браузера
        const imgUrl = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop';
        
        const texture = loader.load(imgUrl, 
            () => { console.log('Texture loaded successfully'); },
            undefined,
            (err) => { console.error('Texture load error:', err); }
        );

        const mouse = new THREE.Vector2(0, 0);
        const targetMouse = new THREE.Vector2(0, 0);

        const uniforms = {
            uTime: { value: 0 },
            uTexture: { value: texture },
            uMouse: { value: mouse },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uHover: { value: 0 }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
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
            `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Event Listeners
        document.addEventListener('mousemove', (e) => {
            targetMouse.x = e.clientX / window.innerWidth;
            targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
        });

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.x = width;
            uniforms.uResolution.value.y = height;
        });

        // Animation Loop
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;

            // Smooth mouse
            mouse.x += (targetMouse.x - mouse.x) * 0.08;
            mouse.y += (targetMouse.y - mouse.y) * 0.08;

            renderer.render(scene, camera);
        }
        animate();

    } catch (e) {
        console.error('Three.js Logic Error:', e);
    }
}