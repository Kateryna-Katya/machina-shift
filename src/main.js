document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded. Initializing Machina Shift...');

  // Запуск всех модулей
  initIcons();
  initSmoothScroll();
  initMobileMenu();
  initHeroAnimation();
  initStats();
  initAccordion();
  initForm();
  initCookies(); // Запуск логики куки
});

/* 1. ICONS */
function initIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* 2. SCROLL */
function initSmoothScroll() {
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
}

/* 3. MENU */
function initMobileMenu() {
  const burger = document.querySelector('.header__burger');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

  if (!burger || !mobileMenu) return;

  const toggle = () => {
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
  };

  burger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  if (closeBtn) closeBtn.addEventListener('click', toggle);
  links.forEach(l => l.addEventListener('click', toggle));
}

/* 4. HERO ANIMATION (With Error Handling) */
function initHeroAnimation() {
  const container = document.getElementById('canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  try {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');

      // Используем надежный источник Unsplash
      const imgUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';

      const texture = loader.load(imgUrl, () => {}, undefined, () => console.log('Texture err'));

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
          vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
          fragmentShader: `
              uniform float uTime;
              uniform sampler2D uTexture;
              uniform vec2 uMouse;
              uniform vec2 uResolution;
              varying vec2 vUv;
              void main() {
                  vec2 uv = vUv;
                  float aspect = uResolution.x / uResolution.y;
                  vec2 m = uMouse; m.x *= aspect;
                  vec2 uva = uv; uva.x *= aspect;
                  float dist = distance(uva, m);
                  float influence = smoothstep(0.45, 0.0, dist);
                  uv.x += influence * (uv.x - uMouse.x) * 0.2;
                  uv.y += influence * (uv.y - uMouse.y) * 0.2;
                  vec4 color = texture2D(uTexture, uv);
                  color.rgb *= 0.35;
                  color.rgb += vec3(influence * 0.2, influence * 0.4, 0.0);
                  gl_FragColor = color;
              }
          `
      });

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      document.addEventListener('mousemove', (e) => {
          targetMouse.x = e.clientX / window.innerWidth;
          targetMouse.y = 1.0 - (e.clientY / window.innerHeight);
      });

      window.addEventListener('resize', () => {
          renderer.setSize(window.innerWidth, window.innerHeight);
          uniforms.uResolution.value.x = window.innerWidth;
          uniforms.uResolution.value.y = window.innerHeight;
      });

      const clock = new THREE.Clock();
      function animate() {
          requestAnimationFrame(animate);
          uniforms.uTime.value = clock.getElapsedTime();
          mouse.x += (targetMouse.x - mouse.x) * 0.08;
          mouse.y += (targetMouse.y - mouse.y) * 0.08;
          renderer.render(scene, camera);
      }
      animate();
  } catch (e) { console.error(e); }
}

/* 5. STATS */
function initStats() {
  const section = document.querySelector('.stats-grid');
  const numbers = document.querySelectorAll('.stat-number');
  let started = false;

  if (!section || !numbers.length) return;

  const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
          started = true;
          numbers.forEach(num => {
              const target = parseFloat(num.getAttribute('data-target'));
              const isFloat = target % 1 !== 0;
              let current = 0;
              const step = target / 50; // 50 frames
              const timer = setInterval(() => {
                  current += step;
                  if (current >= target) { current = target; clearInterval(timer); }
                  num.innerText = isFloat ? current.toFixed(1) : Math.round(current);
              }, 30);
          });
      }
  }, { threshold: 0.5 });
  obs.observe(section);
}

/* 6. ACCORDION */
function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(h => {
      h.addEventListener('click', () => {
          const isOpen = h.classList.contains('active');
          document.querySelectorAll('.accordion-header').forEach(el => {
              el.classList.remove('active');
              el.nextElementSibling.style.maxHeight = null;
          });
          if (!isOpen) {
              h.classList.add('active');
              h.nextElementSibling.style.maxHeight = h.nextElementSibling.scrollHeight + "px";
          }
      });
  });
}

/* 7. FORM */
function initForm() {
  const form = document.getElementById('lead-form');
  const msg = document.getElementById('form-message');
  if (!form) return;

  form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (document.getElementById('captcha').value != '8') {
          msg.textContent = 'Ошибка: 5 + 3 = 8'; msg.className = 'form-message error'; return;
      }
      const btn = form.querySelector('button');
      const txt = btn.textContent;
      btn.textContent = '...'; btn.disabled = true;
      setTimeout(() => {
          msg.textContent = 'Отправлено!'; msg.className = 'form-message success';
          form.reset(); btn.textContent = txt; btn.disabled = false;
      }, 1500);
  });
}

/* 8. COOKIES (FORCE SHOW) */
function initCookies() {
  const popup = document.getElementById('cookie-popup');
  const btn = document.getElementById('accept-cookies');
  // Используем НОВЫЙ ключ, чтобы сбросить историю
  const key = 'machina_cookie_v3';

  if (!popup || !btn) return;

  if (!localStorage.getItem(key)) {
      setTimeout(() => {
          popup.classList.add('show');
          console.log('Popup Triggered');
      }, 1500);
  }

  btn.addEventListener('click', () => {
      localStorage.setItem(key, 'true');
      popup.classList.remove('show');
  });
}