document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded. Initializing Machina Shift...');

    // 1. Иконки
    initIcons();

    // 2. Плавный скролл
    initSmoothScroll();

    // 3. Мобильное меню
    initMobileMenu();

    // 4. Анимация Hero (Жидкость)
    initHeroAnimation();

    // 5. Статистика (Цифры) — НОВОЕ
    initStats();

    // 6. Аккордеон
    initAccordion();

    // 7. Форма
    initForm();

    // 8. Cookies
    initCookies();
});

/* =========================================
   1. ICONS (LUCIDE)
   ========================================= */
function initIcons() {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide library not found');
        }
    } catch (e) {
        console.error('Icons Error:', e);
    }
}

/* =========================================
   2. SMOOTH SCROLL (LENIS)
   ========================================= */
function initSmoothScroll() {
    try {
        if (typeof Lenis === 'undefined') return;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
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
   3. MOBILE MENU
   ========================================= */
function initMobileMenu() {
    try {
        const burger = document.querySelector('.header__burger');
        const closeBtn = document.querySelector('.mobile-menu__close');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

        if (!burger || !mobileMenu) return;

        const toggleMenu = () => {
            mobileMenu.classList.toggle('is-open');
            document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
        };

        burger.addEventListener('click', (e) => {
            e.stopPropagation();
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
   4. HERO ANIMATION (THREE.JS)
   ========================================= */
function initHeroAnimation() {
    const container = document.getElementById('canvas-container');

    if (!container) return;
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    try {
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        // Темное абстрактное изображение
        const imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
        
        const texture = loader.load(imgUrl, 
            () => {}, 
            undefined, 
            () => console.warn('Texture failed to load')
        );

        const mouse = new THREE.Vector2(0, 0);
        const targetMouse = new THREE.Vector2(0, 0);
        
        const uniforms = {
            uTime: { value: 0 },
            uTexture: { value: texture },
            uMouse: { value: mouse },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
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
                    float influence = smoothstep(0.45, 0.0, dist);
                    
                    uv.x += influence * (uv.x - uMouse.x) * 0.2; 
                    uv.y += influence * (uv.y - uMouse.y) * 0.2;

                    vec4 color = texture2D(uTexture, uv);
                    color.rgb *= 0.3; // Darken
                    color.rgb += vec3(influence * 0.15, influence * 0.3, 0.0); // Neon tint

                    gl_FragColor = color;
                }
            `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

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

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;
            mouse.x += (targetMouse.x - mouse.x) * 0.08;
            mouse.y += (targetMouse.y - mouse.y) * 0.08;
            renderer.render(scene, camera);
        }
        animate();

    } catch (e) {
        console.error('Three.js Error:', e);
    }
}

/* =========================================
   5. STATS ANIMATION (НОВОЕ)
   ========================================= */
function initStats() {
    const statsSection = document.querySelector('.stats-grid');
    const numbers = document.querySelectorAll('.stat-number');
    let started = false;

    if (!statsSection || numbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                
                numbers.forEach(num => {
                    const target = parseFloat(num.getAttribute('data-target'));
                    const isFloat = target % 1 !== 0; 
                    const duration = 2000; // 2 sec
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        num.innerText = isFloat ? current.toFixed(1) : Math.round(current);
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

/* =========================================
   6. ACCORDION
   ========================================= */
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const isOpen = header.classList.contains('active');

            // Close others
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
                if(h.nextElementSibling) h.nextElementSibling.style.maxHeight = null;
            });

            // Open current
            if (!isOpen) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
}

/* =========================================
   7. CONTACT FORM
   ========================================= */
function initForm() {
    const form = document.getElementById('lead-form');
    const msgBox = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Captcha validation
        const captchaInput = document.getElementById('captcha');
        if (parseInt(captchaInput.value) !== 8) {
            msgBox.textContent = 'Ошибка: неверное решение (5 + 3 = 8).';
            msgBox.className = 'form-message error';
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Отправка...';
        btn.disabled = true;

        setTimeout(() => {
            msgBox.textContent = 'Успешно! Мы свяжемся с вами.';
            msgBox.className = 'form-message success';
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
            
            setTimeout(() => {
                msgBox.textContent = '';
                msgBox.className = 'form-message';
            }, 5000);
        }, 1500);
    });
}

/* =========================================
   8. COOKIE POPUP
   ========================================= */
function initCookies() {
    const popup = document.getElementById('cookie-popup');
    const btn = document.getElementById('accept-cookies');

    if (!popup || !btn) return;

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            popup.classList.add('show');
        }, 2000);
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        popup.classList.remove('show');
    });
}