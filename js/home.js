// Home Page JavaScript - Funcionalidades específicas para la página principal

document.addEventListener('DOMContentLoaded', function() {
    initHeroEffects();
    initProjectsSection();
    initPartnershipsSection();
    initCounterAnimation();
    initTestimonials();
    initContactForm();
});

// ====== EFECTOS DEL HERO ======
function initHeroEffects() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!hero || !heroContent) return;

    // Parallax effect en el hero
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, 16));

    // Animación de typing para el título del hero
    const heroTitle = hero.querySelector('h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remover cursor después de completar
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Iniciar después de un pequeño delay
        setTimeout(typeWriter, 500);
    }

    // Animación de partículas en el fondo
    createParticleEffect(hero);
}

function createParticleEffect(container) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.3';
    canvas.style.zIndex = '1';
    
    container.appendChild(canvas);
    
    function resizeCanvas() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ====== SECCIÓN DE PROYECTOS ======
function initProjectsSection() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Efecto hover con información adicional
        card.addEventListener('mouseenter', function() {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const overlay = this.querySelector('.project-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }
        });
        
        // Click para ver más detalles
        card.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            if (projectId) {
                showProjectModal(projectId);
            }
        });
    });
    
    // Filtro de proyectos
    initProjectFilter();
}

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar proyectos
            projectCards.forEach(card => {
                const categories = card.dataset.categories?.split(',') || [];
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function showProjectModal(projectId) {
    // Aquí iría la lógica para mostrar un modal con detalles del proyecto
    // Por ahora, mostraremos una alerta
    CLADES.showAlert('Próximamente: Detalles del proyecto', 'info');
}

// ====== SECCIÓN DE ALIANZAS ======
function initPartnershipsSection() {
    const partnershipLogos = document.querySelectorAll('.partnership-logo');
    
    // Efecto de rotación automática
    let currentIndex = 0;
    const rotationInterval = 3000;
    
    function highlightPartnership() {
        partnershipLogos.forEach((logo, index) => {
            logo.classList.remove('highlighted');
            if (index === currentIndex) {
                logo.classList.add('highlighted');
            }
        });
        
        currentIndex = (currentIndex + 1) % partnershipLogos.length;
    }
    
    // Iniciar rotación si hay alianzas
    if (partnershipLogos.length > 0) {
        setInterval(highlightPartnership, rotationInterval);
    }
    
    // Tooltip con información de la alianza
    partnershipLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            const tooltip = this.dataset.tooltip;
            if (tooltip) {
                showTooltip(this, tooltip);
            }
        });
        
        logo.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = text;
    
    Object.assign(tooltip.style, {
        position: 'absolute',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: '1000',
        pointerEvents: 'none',
        whiteSpace: 'nowrap'
    });
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    // Guardar referencia para poder eliminarla
    element._tooltip = tooltip;
}

function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

// ====== ANIMACIÓN DE CONTADORES ======
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(counter) {
    const target = parseInt(counter.dataset.target);
    const duration = 2000; // 2 segundos
    const step = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// ====== TESTIMONIOS ======
function initTestimonials() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    const testimonials = testimonialSlider.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
    
    nextBtn?.addEventListener('click', nextTestimonial);
    prevBtn?.addEventListener('click', prevTestimonial);
    
    // Auto-play
    setInterval(nextTestimonial, 5000);
    
    // Inicializar
    showTestimonial(0);
}

// ====== FORMULARIO DE CONTACTO ======
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validar datos
        if (!data.name || !data.email || !data.message) {
            CLADES.showAlert('Por favor, complete todos los campos obligatorios', 'error');
            return;
        }
        
        // Enviar formulario (simulado)
        sendContactForm(data);
    });
}

function sendContactForm(data) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío
    setTimeout(() => {
        CLADES.showAlert('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
        document.querySelector('#contact-form').reset();
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// ====== EFECTOS ADICIONALES ======
function initScrollReveal() {
    // Revelar elementos al hacer scroll
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Newsletter subscription
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (!email) {
            CLADES.showAlert('Por favor, ingrese un email válido', 'error');
            return;
        }
        
        // Simular suscripción
        setTimeout(() => {
            CLADES.showAlert('¡Gracias por suscribirte a nuestro newsletter!', 'success');
            this.reset();
        }, 1000);
    });
}

// Llamar a funciones adicionales
document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initNewsletterForm();
});
