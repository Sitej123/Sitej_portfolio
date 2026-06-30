// Main JavaScript for Sitej Meher's Premium 3D Portfolio

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenuToggle.innerHTML = mobileMenu.classList.contains('hidden') 
        ? '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>'
        : '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('scrollProgress').style.width = `${scrolled}%`;
});

// Smooth Scrolling for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Hide mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Scroll-triggered Animations
gsap.utils.toArray('.glass-card').forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.4, // Faster animation
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Typing Effect for Hero Section
const typingText = document.getElementById('typing-text');
const phrases = [
    'Computer Science Student',
    'Java Programmer',
    'Python Programmer',
    'Machine Learning Enthusiast',
    'Student of Life'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex--);
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex++);
    }

    let typeSpeed = 75; // Faster typing speed

    if (charIndex === currentPhrase.length) {
        typeSpeed = 1000; // Faster deletion delay
        isDeleting = true;
    } else if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typing effect after a short delay
setTimeout(typeWriter, 1500);

// 3D Background Animation with Three.js
class ThreeBackground {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.isAnimating = false;
        
        this.init();
        this.animate();
    }

    init() {
        const container = document.getElementById('3d-background');
        
        // Scene Setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 20;

        // Renderer Setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        // Create Particles
        this.createParticles();

        // Handle Window Resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const count = 100;
        
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const colorPalette = [
            new THREE.Color(0x3b82f6), // Electric Blue
            new THREE.Color(0xa855f7), // Neon Purple
            new THREE.Color(0x06b6d4), // Cyan
            new THREE.Color(0xf59e0b)  // Amber
        ];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);

        // Create Floating Shapes
        this.createFloatingShapes();
    }

    createFloatingShapes() {
        const shapes = [];
        const geometryTypes = [
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.SphereGeometry(1.5, 32, 32),
            new THREE.TorusGeometry(1, 0.4, 16, 100)
        ];

        for (let i = 0; i < 15; i++) {
            const geometry = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
            const material = new THREE.MeshBasicMaterial({
                color: Math.random() > 0.5 ? 0x3b82f6 : 0xa855f7,
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 40;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 20;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Animation properties
            mesh.userData = {
                speed: Math.random() * 0.02 + 0.01,
                rotationSpeed: Math.random() * 0.01 + 0.005,
                amplitude: Math.random() * 5 + 2,
                timeOffset: Math.random() * 100
            };

            this.scene.add(mesh);
            shapes.push(mesh);
        }

        this.shapes = shapes;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animate Particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.003; // Faster rotation
            this.particleSystem.rotation.x += 0.0015; // Faster rotation
        }

        // Animate Floating Shapes
        if (this.shapes) {
            this.shapes.forEach((shape, index) => {
                const data = shape.userData;
                
                // Floating animation
                shape.position.y += Math.sin(Date.now() * 0.003 + data.timeOffset) * 0.04; // Faster floating
                shape.position.x += Math.cos(Date.now() * 0.003 + data.timeOffset) * 0.02; // Faster floating
                
                // Rotation animation
                shape.rotation.x += data.rotationSpeed * 2; // Faster rotation
                shape.rotation.y += data.rotationSpeed * 3; // Faster rotation
                
                // Pulse animation
                const scale = 1 + Math.sin(Date.now() * 0.002 + index) * 0.1;
                shape.scale.set(scale, scale, scale);
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize 3D Background
const threeBackground = new ThreeBackground();

// Enhanced Scroll Animations
    gsap.from('#hero-name', {
        opacity: 0,
        y: 50,
        duration: 0.8, // Faster animation
        ease: 'power3.out'
    });

// Skills Section Animation
const skillBars = document.querySelectorAll('.w-24 > div');
skillBars.forEach((bar, index) => {
    gsap.from(bar, {
        width: 0,
        duration: 1.5,
        delay: index * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 80%'
        }
    });
});

// Education Timeline Animation
const timelineItems = document.querySelectorAll('#education .glass-card');
timelineItems.forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        duration: 1,
        delay: index * 0.2,
        scrollTrigger: {
            trigger: item,
            start: 'top 80%'
        }
    });
});

// Contact Form Animation
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    gsap.from(contactForm, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '#contact',
            start: 'top 80%'
        }
    });
}

// Add hover effects to skill bars
document.querySelectorAll('.flex.justify-between.items-center').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const bar = item.querySelector('div > div');
        gsap.to(bar, {
            width: '100%',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    item.addEventListener('mouseleave', () => {
        const bar = item.querySelector('div > div');
        const originalWidth = bar.parentElement.style.width || '100%';
        gsap.to(bar, {
            width: originalWidth,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Add parallax effect to hero section
window.addEventListener('mousemove', (e) => {
    const hero = document.getElementById('hero');
    const x = (e.clientX - window.innerWidth / 2) / 20;
    const y = (e.clientY - window.innerHeight / 2) / 20;
    
    if (hero) {
        hero.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Add subtle floating animation to hero name
const heroName = document.getElementById('hero-name');
if (heroName) {
    let floatDirection = 1;
    setInterval(() => {
        const currentY = parseFloat(heroName.style.transform.replace(/[^0-9\-\.]/g, '') || '0');
        const newY = currentY + (floatDirection * 1); // Faster floating
        
        if (Math.abs(newY) > 10) {
            floatDirection *= -1;
        }
        
        heroName.style.transform = `translateY(${newY}px)`;
    }, 100);
}

// Performance optimization: Pause animations when tab is not active
let isTabActive = true;
document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
});

// Contact form submission (basic implementation)
const contactFormElement = document.querySelector('#contact form');

if (contactFormElement) {
    emailjs.init("bz_ebCQ7H2-aUufuX"); // Replace with your EmailJS Public Key

    contactFormElement.addEventListener("submit", function(e) {
        e.preventDefault();

        const submitBtn = contactFormElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            from_name: contactFormElement.querySelector('input[placeholder="Your Name"]').value,
            from_email: contactFormElement.querySelector('input[placeholder="Your Email"]').value,
            message: contactFormElement.querySelector('textarea').value,

            // Your email
            to_email: "mehersitej988@gmail.com"
        })
        .then(() => {
            submitBtn.textContent = "Message Sent!";
            contactFormElement.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        })
        .catch((error) => {
            console.error(error);
            alert("Failed to send message.");

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
};

// Add smooth hover effects to CTA buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            duration: 0.2,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
});

// Add scroll-triggered navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-white', 'border-b-2', 'border-electric');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-white', 'border-b-2', 'border-electric');
        }
    });
});

console.log('🚀 Sitej Meher Portfolio loaded successfully!');