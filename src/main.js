document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded. Initializing Machina Shift...');

    // 1. Инициализация иконок (Lucide)
    initIcons();

    // 2. Плавный скролл (Lenis)
    initSmoothScroll();

    // 3. Мобильное меню
    initMobileMenu();

    // 4. Анимация Hero (Three.js Fluid Distortion)
    initHeroAnimation();

    // 5. Аккордеон (Секция Обучения)
    initAccordion();

    // 6. Форма контактов
    initForm();

    // 7. Cookie Popup
    initCookies();
});

/* =========================================
   1. ICONS
   ========================================= */
function initIcons() {
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('Icons initialized');
        } else {
            console.warn('Lucide library not found');
        }
    } catch (e) {
        console.error('Icons Error:', e);
    }
}

/* =========================================
   2. SMOOTH SCROLL (Lenis)
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
        console.log('Smooth Scroll initialized');
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

        if (!burger || !mobileMenu) {
            console.warn('Mobile menu elements missing');
            return;
        }

        const toggleMenu = () => {
            mobileMenu.classList.toggle('is-open');
            // Блокируем скролл страницы, когда меню открыто
            document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
        };

        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', toggleMenu);
        }

        // Закрываем меню при клике на ссылку
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
        
        console.log('Mobile Menu initialized');

    } catch (e) {
        console.error('Mobile Menu Error:', e);
    }
}

/* =========================================
   4. HERO ANIMATION (Three.js)
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

        // Загрузка текстуры
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        // Абстрактное темное изображение для фона
        const imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
        
        const texture = loader.load(imgUrl, 
            () => {}, // Success
            undefined, // Progress
            () => { console.warn('Texture load failed, using fallback color'); } // Error
        );

        const mouse = new THREE.Vector2(0, 0);
        const targetMouse = new THREE.Vector2(0, 0);
        
        const uniforms = {
            uTime: { value: 0 },
            uTexture: { value: texture },
            uMouse: { value: mouse },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };

        // Shader Code
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
            `
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Отслеживание мыши
        document.addEventListener('mousemove', (e) => {
            targetMouse.x = e.clientX / window.innerWidth;
            targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
        });

        // Ресайз окна
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            uniforms.uResolution.value.x = width;
            uniforms.uResolution.value.y = height;
        });

        // Анимационный цикл
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            
            const elapsedTime = clock.getElapsedTime();
            uniforms.uTime.value = elapsedTime;

            // Плавное движение (Lerp)
            mouse.x += (targetMouse.x - mouse.x) * 0.08;
            mouse.y += (targetMouse.y - mouse.y) * 0.08;

            renderer.render(scene, camera);
        }
        animate();
        console.log('Hero Animation initialized');

    } catch (e) {
        console.error('Three.js Error:', e);
    }
}

/* =========================================
   5. ACCORDION (Education Section)
   ========================================= */
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    if (headers.length === 0) return;

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const body = item.querySelector('.accordion-body');
            const isOpen = header.classList.contains('active');

            // Закрываем все остальные
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
                if(h.nextElementSibling) {
                    h.nextElementSibling.style.maxHeight = null;
                }
            });

            // Если не был открыт — открываем текущий
            if (!isOpen) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
    console.log('Accordion initialized');
}

/* =========================================
   6. CONTACT FORM
   ========================================= */
function initForm() {
    const form = document.getElementById('lead-form');
    const msgBox = document.getElementById('form-message');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 1. Проверка капчи (5 + 3)
        const captchaInput = document.getElementById('captcha');
        const captchaVal = captchaInput ? captchaInput.value : '';
        
        if (parseInt(captchaVal) !== 8) {
            msgBox.textContent = 'Ошибка: неверное решение примера (5 + 3 = 8).';
            msgBox.className = 'form-message error';
            return;
        }

        // 2. Имитация отправки
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        btn.textContent = 'Обработка...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        setTimeout(() => {
            // Успех
            msgBox.textContent = 'Успешно! Мы свяжемся с вами в ближайшее время.';
            msgBox.className = 'form-message success';
            form.reset();
            
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            
            // Скрыть сообщение через 5 сек
            setTimeout(() => {
                msgBox.textContent = '';
                msgBox.className = 'form-message';
            }, 5000);
        }, 1500);
    });
    console.log('Form initialized');
}

/* =========================================
   7. COOKIE POPUP
   ========================================= */
function initCookies() {
    const popup = document.getElementById('cookie-popup');
    const btn = document.getElementById('accept-cookies');

    if (!popup || !btn) return;

    // Проверка LocalStorage
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            popup.classList.add('show');
        }, 2000); // Показать через 2 секунды
    }

    btn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        popup.classList.remove('show');
    });
    console.log('Cookies initialized');
}