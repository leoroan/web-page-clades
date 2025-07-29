// Global JavaScript - Funcionalidades globales para el sitio web de CLADES

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes globales
    initNavigation();
    initScrollEffects();
    initModals();
    initForms();
    initAnimations();
});

// ====== NAVEGACIÓN ======
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item a');

    // Efecto de scroll en el header
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Toggle del menú móvil
    navToggle?.addEventListener('click', function() {
        navMenu?.classList.toggle('active');
        
        // Animación del botón hamburguesa
        const spans = navToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    });

    // Cerrar menú al hacer click en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navMenu?.classList.remove('active');
            const spans = navToggle?.querySelectorAll('span');
            spans?.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        });
    });

    // Marcar enlace activo
    markActiveNavItem();
}

function markActiveNavItem() {
    const navItems = document.querySelectorAll('.nav-item a');
    const currentPath = window.location.pathname;
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ====== EFECTOS DE SCROLL ======
function initScrollEffects() {
    // Smooth scroll para enlaces ancla
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Botón de volver arriba
    createBackToTopButton();
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.classList.add('back-to-top');
    backToTop.setAttribute('aria-label', 'Volver arriba');
    
    // Estilos del botón
    Object.assign(backToTop.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--color-secondary)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: 'bold',
        zIndex: '1000',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    });

    document.body.appendChild(backToTop);

    // Mostrar/ocultar botón según scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // Función del botón
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    backToTop.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'var(--color-primary)';
        this.style.transform = 'translateY(-2px)';
    });

    backToTop.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'var(--color-secondary)';
        this.style.transform = 'translateY(0)';
    });
}

// ====== MODALES ======
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            openModal(modal);
        });
    });

    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus en el primer elemento focusable
        const focusableElement = modal.querySelector('input, button, textarea, select');
        if (focusableElement) {
            focusableElement.focus();
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ====== FORMULARIOS ======
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            // Validación en tiempo real
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Validación al enviar
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                handleFormSubmit(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Limpiar errores previos
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // Validaciones
    if (required && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (value) {
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingrese un email válido';
                }
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingrese un teléfono válido';
                }
                break;
            case 'password':
                if (value.length < 6) {
                    isValid = false;
                    errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                }
                break;
        }
    }

    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('form-error');
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }

    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('.form-control[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Mostrar loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Simular envío (aquí iría la llamada real al servidor)
    setTimeout(() => {
        showAlert('¡Mensaje enviado correctamente!', 'success');
        form.reset();
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Cerrar modal si existe
        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal);
        }
    }, 2000);
}

// ====== ANIMACIONES ======
function initAnimations() {
    // Intersection Observer para animaciones al scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observar elementos animables
    const animatableElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatableElements.forEach(el => {
        observer.observe(el);
    });
}

// ====== UTILIDADES ======
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`);
    alert.textContent = message;
    
    // Estilos para posicionamiento
    Object.assign(alert.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '10000',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease'
    });

    document.body.appendChild(alert);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        alert.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            alert.remove();
        }, 300);
    }, 5000);

    // Permitir cerrar manualmente
    alert.addEventListener('click', function() {
        this.remove();
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Función para cargar imágenes lazy
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Exportar funciones para uso global
window.CLADES = {
    showAlert,
    openModal,
    closeModal,
    debounce,
    throttle,
    validateField,
    validateForm
};
