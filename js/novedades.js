// Novedades Page JavaScript - Funcionalidades específicas para la página de novedades

let novedadesData = [];
let filteredNovedades = [];
let currentPage = 1;
const itemsPerPage = 6;

document.addEventListener('DOMContentLoaded', function() {
    loadNovedadesData();
    initFilters();
    initSearch();
    initPagination();
    initNewsletterSubscription();
});

// ====== CARGA DE DATOS ======
async function loadNovedadesData() {
    try {
        showLoading(true);
        
        // Intentar cargar desde el archivo JSON
        const response = await fetch('./data/novedades.json');
        if (response.ok) {
            novedadesData = await response.json();
        } else {
            // Si no existe el archivo, usar datos de ejemplo
            novedadesData = getExampleNovedades();
        }
        
        filteredNovedades = [...novedadesData];
        renderNovedades();
        updatePagination();
        
    } catch (error) {
        console.error('Error cargando novedades:', error);
        // Usar datos de ejemplo en caso de error
        novedadesData = getExampleNovedades();
        filteredNovedades = [...novedadesData];
        renderNovedades();
        updatePagination();
    } finally {
        showLoading(false);
    }
}

function getExampleNovedades() {
    return [
        {
            id: 1,
            title: "Nueva Campaña de Reforestación en el Amazonas",
            excerpt: "Iniciamos un ambicioso proyecto para plantar 10,000 árboles nativos en zonas deforestadas del Amazonas, con la participación de comunidades locales.",
            content: "Contenido completo de la noticia...",
            category: "medio-ambiente",
            date: "2024-01-15",
            author: "María González",
            image: "./images/novedades/reforestacion-amazonas.jpg",
            featured: true,
            tags: ["reforestación", "amazonas", "sostenibilidad"]
        },
        {
            id: 2,
            title: "Programa de Becas Educativas Alcanza los 500 Beneficiarios",
            excerpt: "Celebramos un hito importante: nuestro programa de becas ha beneficiado a 500 jóvenes de comunidades vulnerables en toda América Latina.",
            content: "Contenido completo de la noticia...",
            category: "educacion",
            date: "2024-01-10",
            author: "Carlos Mendoza",
            image: "./images/novedades/becas-educativas.jpg",
            featured: false,
            tags: ["educación", "becas", "juventud"]
        },
        {
            id: 3,
            title: "Alianza Estratégica con UNICEF para Protección Infantil",
            excerpt: "Firmamos un acuerdo de colaboración con UNICEF para desarrollar programas de protección y desarrollo integral de la infancia.",
            content: "Contenido completo de la noticia...",
            category: "alianzas",
            date: "2024-01-05",
            author: "Ana Rodríguez",
            image: "./images/novedades/alianza-unicef.jpg",
            featured: true,
            tags: ["alianza", "UNICEF", "infancia", "protección"]
        },
        {
            id: 4,
            title: "Taller de Emprendimiento Social en Guatemala",
            excerpt: "Realizamos un exitoso taller de emprendimiento social que capacitó a 150 líderes comunitarios en Guatemala.",
            content: "Contenido completo de la noticia...",
            category: "capacitacion",
            date: "2023-12-28",
            author: "Luis Hernández",
            image: "./images/novedades/taller-guatemala.jpg",
            featured: false,
            tags: ["emprendimiento", "Guatemala", "capacitación"]
        },
        {
            id: 5,
            title: "Campaña de Agua Potable Beneficia a 2,000 Familias",
            excerpt: "Nuestra campaña de acceso a agua potable ha logrado llevar agua limpia a 2,000 familias en zonas rurales de Honduras.",
            content: "Contenido completo de la noticia...",
            category: "salud",
            date: "2023-12-20",
            author: "Patricia Silva",
            image: "./images/novedades/agua-potable.jpg",
            featured: false,
            tags: ["agua potable", "Honduras", "salud", "familias"]
        },
        {
            id: 6,
            title: "Informe Anual 2023: Impacto y Transparencia",
            excerpt: "Presentamos nuestro informe anual 2023, destacando los logros alcanzados y el impacto generado en las comunidades.",
            content: "Contenido completo de la noticia...",
            category: "institucional",
            date: "2023-12-15",
            author: "Roberto Díaz",
            image: "./images/novedades/informe-anual.jpg",
            featured: true,
            tags: ["informe", "transparencia", "impacto", "2023"]
        }
    ];
}

// ====== RENDERIZADO ======
function renderNovedades() {
    const container = document.querySelector('.novedades-grid');
    if (!container) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const novedadesToShow = filteredNovedades.slice(startIndex, endIndex);

    if (novedadesToShow.length === 0) {
        showNoResults();
        return;
    }

    container.innerHTML = novedadesToShow.map(novedad => createNovedadCard(novedad)).join('');
    
    // Agregar event listeners a las tarjetas
    container.querySelectorAll('.novedad-card').forEach(card => {
        card.addEventListener('click', function() {
            const novedadId = this.dataset.novedadId;
            showNovedadDetail(novedadId);
        });
    });
}

function createNovedadCard(novedad) {
    const categoryNames = {
        'medio-ambiente': 'Medio Ambiente',
        'educacion': 'Educación',
        'alianzas': 'Alianzas',
        'capacitacion': 'Capacitación',
        'salud': 'Salud',
        'institucional': 'Institucional'
    };

    const formattedDate = formatDate(novedad.date);
    const categoryName = categoryNames[novedad.category] || novedad.category;

    return `
        <article class="novedad-card" data-novedad-id="${novedad.id}" data-category="${novedad.category}">
            <div class="novedad-image">
                <img src="${novedad.image}" alt="${novedad.title}" loading="lazy">
                <span class="novedad-category">${categoryName}</span>
                <span class="novedad-date">${formattedDate}</span>
            </div>
            <div class="novedad-content">
                <h3 class="novedad-title">${novedad.title}</h3>
                <p class="novedad-excerpt">${novedad.excerpt}</p>
                <div class="novedad-meta">
                    <div class="novedad-author">
                        <img src="./images/avatars/${novedad.author.toLowerCase().replace(' ', '-')}.jpg" 
                             alt="${novedad.author}" class="author-avatar"
                             onerror="this.src='./images/avatars/default.jpg'">
                        <span>Por ${novedad.author}</span>
                    </div>
                </div>
                <a href="#" class="read-more" onclick="event.stopPropagation(); showNovedadDetail(${novedad.id})">
                    Leer más
                </a>
            </div>
        </article>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ====== FILTROS ======
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            applyFilters(filter);
        });
    });
}

function applyFilters(category = 'all') {
    if (category === 'all') {
        filteredNovedades = [...novedadesData];
    } else {
        filteredNovedades = novedadesData.filter(novedad => novedad.category === category);
    }
    
    // Aplicar también el filtro de búsqueda si existe
    const searchTerm = document.querySelector('.search-box')?.value.toLowerCase();
    if (searchTerm) {
        filteredNovedades = filteredNovedades.filter(novedad => 
            novedad.title.toLowerCase().includes(searchTerm) ||
            novedad.excerpt.toLowerCase().includes(searchTerm) ||
            novedad.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    currentPage = 1;
    renderNovedades();
    updatePagination();
}

// ====== BÚSQUEDA ======
function initSearch() {
    const searchBox = document.querySelector('.search-box');
    if (!searchBox) return;

    // Usar debounce para optimizar la búsqueda
    const debouncedSearch = debounce(performSearch, 300);
    
    searchBox.addEventListener('input', function() {
        debouncedSearch(this.value);
    });
    
    searchBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });
}

function performSearch(searchTerm) {
    const activeFilter = document.querySelector('.filter-button.active')?.dataset.filter || 'all';
    
    // Primero aplicar filtro de categoría
    let results = activeFilter === 'all' ? [...novedadesData] : 
                  novedadesData.filter(novedad => novedad.category === activeFilter);
    
    // Luego aplicar búsqueda de texto
    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        results = results.filter(novedad => 
            novedad.title.toLowerCase().includes(term) ||
            novedad.excerpt.toLowerCase().includes(term) ||
            novedad.author.toLowerCase().includes(term) ||
            novedad.tags.some(tag => tag.toLowerCase().includes(term))
        );
    }
    
    filteredNovedades = results;
    currentPage = 1;
    renderNovedades();
    updatePagination();
}

// ====== PAGINACIÓN ======
function initPagination() {
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredNovedades.length / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    paginationContainer.innerHTML = '';
    
    // Botón anterior
    const prevButton = createPaginationButton('Anterior', currentPage > 1, () => goToPage(currentPage - 1));
    paginationContainer.appendChild(prevButton);
    
    // Páginas
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationContainer.appendChild(createPaginationButton('1', true, () => goToPage(1)));
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const button = createPaginationButton(i.toString(), true, () => goToPage(i), i === currentPage);
        paginationContainer.appendChild(button);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.className = 'pagination-ellipsis';
            paginationContainer.appendChild(ellipsis);
        }
        paginationContainer.appendChild(createPaginationButton(totalPages.toString(), true, () => goToPage(totalPages)));
    }
    
    // Botón siguiente
    const nextButton = createPaginationButton('Siguiente', currentPage < totalPages, () => goToPage(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

function createPaginationButton(text, enabled, onClick, isActive = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `pagination-button ${isActive ? 'active' : ''}`;
    button.disabled = !enabled;
    
    if (enabled) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

function goToPage(page) {
    currentPage = page;
    renderNovedades();
    updatePagination();
    
    // Scroll suave hacia arriba
    document.querySelector('.novedades-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ====== DETALLES DE NOVEDAD ======
function showNovedadDetail(novedadId) {
    const novedad = novedadesData.find(n => n.id == novedadId);
    if (!novedad) return;
    
    // Crear modal con el detalle
    const modal = createNovedadModal(novedad);
    document.body.appendChild(modal);
    
    // Mostrar modal
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Cerrar con ESC
    const closeHandler = (e) => {
        if (e.key === 'Escape') {
            closeNovedadModal(modal);
            document.removeEventListener('keydown', closeHandler);
        }
    };
    document.addEventListener('keydown', closeHandler);
}

function createNovedadModal(novedad) {
    const modal = document.createElement('div');
    modal.className = 'modal novedad-modal';
    
    const categoryNames = {
        'medio-ambiente': 'Medio Ambiente',
        'educacion': 'Educación',
        'alianzas': 'Alianzas',
        'capacitacion': 'Capacitación',
        'salud': 'Salud',
        'institucional': 'Institucional'
    };
    
    const categoryName = categoryNames[novedad.category] || novedad.category;
    const formattedDate = formatDate(novedad.date);
    
    modal.innerHTML = `
        <div class="modal-content novedad-detail">
            <button class="modal-close">&times;</button>
            <header class="novedad-header">
                <img src="${novedad.image}" alt="${novedad.title}" class="novedad-detail-image">
                <div class="novedad-header-content">
                    <span class="novedad-category">${categoryName}</span>
                    <h1 class="novedad-detail-title">${novedad.title}</h1>
                    <div class="novedad-meta">
                        <span class="novedad-author">Por ${novedad.author}</span>
                        <span class="novedad-date">${formattedDate}</span>
                    </div>
                </div>
            </header>
            <div class="novedad-detail-content">
                <p class="novedad-detail-excerpt">${novedad.excerpt}</p>
                <div class="novedad-detail-text">
                    ${novedad.content || 'Contenido completo no disponible.'}
                </div>
                <div class="novedad-tags">
                    ${novedad.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
            <footer class="novedad-detail-footer">
                <button class="btn btn-primary" onclick="shareNovedad(${novedad.id})">
                    Compartir
                </button>
                <button class="btn btn-outline" onclick="closeNovedadModal(this.closest('.modal'))">
                    Cerrar
                </button>
            </footer>
        </div>
    `;
    
    // Event listeners
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeNovedadModal(modal);
        }
    });
    
    modal.querySelector('.modal-close').addEventListener('click', function() {
        closeNovedadModal(modal);
    });
    
    return modal;
}

function closeNovedadModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.remove();
    }, 300);
}

function shareNovedad(novedadId) {
    const novedad = novedadesData.find(n => n.id == novedadId);
    if (!novedad) return;
    
    if (navigator.share) {
        navigator.share({
            title: novedad.title,
            text: novedad.excerpt,
            url: window.location.href + '#novedad-' + novedadId
        });
    } else {
        // Fallback: copiar al portapapeles
        const url = window.location.href + '#novedad-' + novedadId;
        navigator.clipboard.writeText(url).then(() => {
            CLADES.showAlert('Enlace copiado al portapapeles', 'success');
        });
    }
}

// ====== SUSCRIPCIÓN AL NEWSLETTER ======
function initNewsletterSubscription() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('.newsletter-input').value;
        const button = this.querySelector('.newsletter-button');
        
        if (!email || !isValidEmail(email)) {
            CLADES.showAlert('Por favor, ingrese un email válido', 'error');
            return;
        }
        
        const originalText = button.textContent;
        button.textContent = 'Suscribiendo...';
        button.disabled = true;
        
        // Simular suscripción
        setTimeout(() => {
            CLADES.showAlert('¡Gracias por suscribirte! Recibirás nuestras novedades por email.', 'success');
            this.reset();
            
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====== ESTADOS DE CARGA ======
function showLoading(show) {
    const container = document.querySelector('.novedades-grid');
    if (!container) return;
    
    if (show) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Cargando novedades...</p>
            </div>
        `;
    }
}

function showNoResults() {
    const container = document.querySelector('.novedades-grid');
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-results">
            <h3>No se encontraron novedades</h3>
            <p>Intenta ajustar los filtros o la búsqueda</p>
            <button class="btn btn-primary" onclick="clearAllFilters()">
                Limpiar filtros
            </button>
        </div>
    `;
}

function clearAllFilters() {
    // Limpiar búsqueda
    const searchBox = document.querySelector('.search-box');
    if (searchBox) searchBox.value = '';
    
    // Activar filtro "Todas"
    const allFilter = document.querySelector('.filter-button[data-filter="all"]');
    if (allFilter) allFilter.click();
}

// ====== UTILIDADES ======
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

// Función global para compartir (usada en el HTML)
window.shareNovedad = shareNovedad;
window.closeNovedadModal = closeNovedadModal;
window.clearAllFilters = clearAllFilters;
