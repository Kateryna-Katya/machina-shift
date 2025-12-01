/* =========================================
   1. ICONS & SMOOTH SCROLL
   ========================================= */
lucide.createIcons();

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

/* =========================================
   2. MOBILE MENU
   ========================================= */
const burger = document.querySelector('.header__burger');
const closeBtn = document.querySelector('.mobile-menu__close');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__btn');

function toggleMenu() {
    mobileMenu.classList.toggle('is-open');
    // Block scrolling when menu is open
    if (mobileMenu.classList.contains('is-open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

burger.addEventListener('click', toggleMenu);
closeBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

/* =========================================
   3. HERO FLUID DISTORTION (Three.js)
   ========================================= */
const container = document.getElementById('canvas-container');

if (container) {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha for transparency
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Texture Loader
    const loader = new THREE.TextureLoader();
    
    // ВАЖНО: Замените URL ниже на свое фоновое изображение (желательно темное, абстрактное)
    // Сейчас используется плейсхолдер
    const texture = loader.load('https://picsum.photos/1920/1080?grayscale&blur=2'); 

    // Mouse coordinates
    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);

    // Shader Uniforms
    const uniforms = {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uMouse: { value: mouse },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    // Custom Shader for Fluid/Distortion Effect
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
        `
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Event Listeners
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates to 0..1
        targetMouse.x = e.clientX / window.innerWidth;
        targetMouse.y = 1.0 - (e.clientY / window.innerHeight); // Flip Y
    });

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.uResolution.value.x = window.innerWidth;
        uniforms.uResolution.value.y = window.innerHeight;
    });

    // Animation Loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        uniforms.uTime.value = elapsedTime;

        // Smooth mouse movement (Linear Interpolation)
        mouse.x += (targetMouse.x - mouse.x) * 0.05;
        mouse.y += (targetMouse.y - mouse.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();
}

console.log('Machina Shift: Systems Operational');