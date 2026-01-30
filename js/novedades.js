document.addEventListener("DOMContentLoaded", () => {
  loadNews()
})

// Variables de paginación
let currentPage = 1;
const itemsPerPage = 10;
let allNews = [];

function formatDate(dateString) {
  if (!dateString) return "";

  // Intentar parsear YYYY-MM-DD sin zona horaria para evitar desplazamientos por UTC
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  let date;
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1; // monthIndex 0-11
    const day = Number(match[3]);
    date = new Date(year, month, day);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return dateString; // fallback si es inválida

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-AR", options);
}

async function loadNews() {
  try {
    const response = await fetch("data/novedades.json");
    allNews = await response.json();

    // Ordenar por fecha (de más reciente a más antigua)
    allNews.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Mostrar la primera página
    displayNewsPage(currentPage);
    setupPagination();
  } catch (error) {
    console.error("Error loading news:", error)
    displayErrorMessage()
  }
}

function displayNewsPage(page) {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  // Limpiar el contenedor
  container.innerHTML = "";

  // Calcular los índices para la página actual
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const newsToDisplay = allNews.slice(startIndex, endIndex);

  // Mostrar las noticias de la página actual
  newsToDisplay.forEach((news) => {
    const newsCard = createNewsCard(news);
    container.appendChild(newsCard);
  });

  // Actualizar currentPage
  currentPage = page;
}

function setupPagination() {
  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) return;

  const totalPages = Math.ceil(allNews.length / itemsPerPage);

  // Limpiar controles de paginación existentes
  paginationContainer.innerHTML = "";

  // Crear controles de paginación
  const pagination = document.createElement("ul");
  pagination.className = "pagination";

  // Botón "Anterior"
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous" onclick="changePage(${currentPage - 1}); return false;">
      <span aria-hidden="true">&laquo;</span>
    </a>
  `;
  pagination.appendChild(prevLi);

  // Determinar qué números de página mostrar
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Ajustar si estamos cerca del final
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Crear páginas
  for (let i = startPage; i <= endPage; i++) {
    const pageLi = document.createElement("li");
    pageLi.className = `page-item ${currentPage === i ? "active" : ""}`;
    pageLi.innerHTML = `
      <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
    `;
    pagination.appendChild(pageLi);
  }

  // Botón "Siguiente"
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `
    <a class="page-link" href="#" aria-label="Next" onclick="changePage(${currentPage + 1}); return false;">
      <span aria-hidden="true">&raquo;</span>
    </a>
  `;
  pagination.appendChild(nextLi);

  paginationContainer.appendChild(pagination);
}

// Hacer que changePage esté disponible globalmente
window.changePage = function (page) {
  const totalPages = Math.ceil(allNews.length / itemsPerPage);

  // Validar que la página esté dentro del rango
  if (page < 1 || page > totalPages) return;

  displayNewsPage(page);
  setupPagination();

  // Obtener el contenedor de noticias
  const newsContainer = document.getElementById("newsContainer");
  if (newsContainer) {
    // Hacer scroll al contenedor con animación suave
    newsContainer.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // Dar foco al contenedor para accesibilidad
    setTimeout(() => {
      newsContainer.focus();
    }, 300); // Pequeño retraso para asegurar que el scroll se complete
  }
};

// function createNewsCard(news) {
//   const col = document.createElement("div");
//   col.className = "col-lg-4 col-md-6 col-sm-12 col-12";

//   const formattedDate = formatDate(news.fecha);

//   col.innerHTML = `
//         <div class="h-100 bg-white rounded shadow overflow-hidden border p-1">
//             <img src="${news.imagen}" class="card-img-top" ${news.estiloCss ? news.estiloCss : "style=\"height: 250px; object-fit: cover;\""} alt="${news.titulo}">
//             <div class="card-body p-3">
//                 <div class="text-end mb-3">
//                     <i class="bi bi-calendar-event text-primary me-2">
//                     <small class="text-muted">${formattedDate}</small></i>
//                 </div>
//                 <h5 class="text-primary fw-bold mb-3">${news.titulo}</h5>
//                 <p class="text-muted mb-3">${news.descripcion}</p>
//             </div>
//             <div class="card-footer bg-white text-end m-2">
//                 <button class="btn btn-outline-primary btn-sm" onclick="showNewsDetail(${news.id})">
//                     <i class="bi bi-arrow-right me-1"></i>Leer más
//                 </button>
//             </div>
//         </div>
//     `;

//   return col;
// }

function createNewsCard(news) {
  const col = document.createElement("div");
  col.className = "col-lg-4 col-md-6 col-sm-12 col-12 mb-4"; // Añadimos mb-4 para separar filas

  const formattedDate = formatDate(news.fecha);
  const esPdf = news.archivoPdf || news.imagen.toLowerCase().endsWith('.pdf');

  // f-flex y flex-column en el div principal hacen que los hijos se apilen verticalmente
  // h-100 asegura que todas las cards de la misma fila tengan la misma altura
  col.innerHTML = `
        <div class="card h-100 bg-white rounded shadow-sm overflow-hidden border d-flex flex-column">
            <img src="${news.imagen}" class="card-img-top" ${news.estiloCss ? news.estiloCss : "style='height: 250px; object-fit: cover;'"} alt="${news.titulo}">
            
            <div class="card-body p-3 d-flex flex-column">
                <div class="text-end mb-2">
                    <i class="bi bi-calendar-event text-primary me-2"></i>
                    <small class="text-muted">${formattedDate}</small>
                </div>
                <h5 class="text-primary fw-bold mb-3">${news.titulo}</h5>
                <p class="text-muted mb-3">${news.descripcion}</p>
                
                <div class="mt-auto"></div>
            </div>

            <div class="card-footer bg-white text-end border-0 pb-3 px-3">
                <button class="btn btn-outline-primary btn-sm" onclick="showNewsDetail(${news.id})">
                    <i class="bi ${esPdf ? 'bi-file-pdf' : 'bi-arrow-right'} me-1"></i>
                    ${esPdf ? 'Ver Documento' : 'Leer más'}
                </button>
            </div>
        </div>
    `;

  return col;
}

// function showNewsDetail(newsId) {
//   // Buscar la noticia por ID en el array global allNews
//   const news = allNews.find(n => n.id === newsId);

//   if (!news) {
//     alert("No se encontró la noticia con ID: " + newsId);
//     return;
//   }

//   // Obtener elementos del modal
//   const modalTitle = document.getElementById("newsModalLabel");
//   const modalBody = document.querySelector("#newsModal .modal-body");
//   const modalFooter = document.querySelector("#newsModal .modal-footer");

//   // Formatear la fecha
//   const formattedDate = formatDate(news.fecha);

//   // Actualizar contenido del modal
//   modalTitle.textContent = news.titulo;

//   // Crear contenido del modal
//   modalBody.innerHTML = `
//     <div class="mb-3">
//       <img src="${news.imagen}" class="img-fluid rounded" ${news.estiloCss ? news.estiloCss.replace('style="', '').replace('"', '') : "style=\"width: 100%; height: auto;\""} alt="${news.titulo}">
//     </div>
//     <div class="mb-3">
//       <small class="text-muted"><i class="bi bi-calendar-event me-1"></i> ${formattedDate}</small>
//     </div>
//     <!-- <p class="mb-3">${news.descripcion}</p> -->
//     <div class="mb-3">
//       <!-- <h5 class="text-primary fw-bold">Contenido:</h5> -->
//       <p class="text-start text-muted mb-3">${formatContent(news.contenido)}</p>
//     </div>
//   `;

//   // Actualizar el footer del modal
//   modalFooter.innerHTML = `
//     <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
//     ${news.contenido.includes("https://") ?
//       `<a href="${extractUrl(news.contenido)}" target="_blank" class="btn btn-primary">Más información</a>`
//       : ''}
//   `;

//   // Inicializar y mostrar el modal
//   const newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
//   newsModal.show();
// }

function showNewsDetail(newsId) {
  const news = allNews.find(n => n.id === newsId);
  if (!news) return;

  const modalTitle = document.getElementById("newsModalLabel");
  const modalBody = document.querySelector("#newsModal .modal-body");
  const modalFooter = document.querySelector("#newsModal .modal-footer");

  modalTitle.textContent = news.titulo;
  const targetUrl = news.archivoPdf || news.imagen;
  const esPdf = targetUrl.toLowerCase().endsWith('.pdf');

  if (esPdf) {
    // Si es PDF, usamos un visor embebido
    modalBody.innerHTML = `
      <div class="mb-3" style="height: 500px;">
        <embed src="${targetUrl}" type="application/pdf" width="100%" height="100%" class="rounded border" />
      </div>
      <div class="mb-3">
        <small class="text-muted"><i class="bi bi-calendar-event me-1"></i> ${formatDate(news.fecha)}</small>
      </div>
      <p class="text-muted">${news.descripcion}</p>
    `;
  } else {
    // Si es imagen, mantenemos tu lógica original
    modalBody.innerHTML = `
      <div class="mb-3">
        <img src="${news.imagen}" class="img-fluid rounded" style="width: 100%; height: auto;" alt="${news.titulo}">
      </div>
      <div class="mb-3">
        <small class="text-muted"><i class="bi bi-calendar-event me-1"></i> ${formatDate(news.fecha)}</small>
      </div>
      <p class="text-muted">${formatContent(news.contenido)}</p>
    `;
  }

  // Footer dinámico con botón de descarga o link externo
  modalFooter.innerHTML = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    ${esPdf ?
      `<a href="${targetUrl}" target="_blank" class="btn btn-primary"><i class="bi bi-download me-1"></i>Descargar PDF</a>` :
      (news.contenido.includes("https://") ? `<a href="${extractUrl(news.contenido)}" target="_blank" class="btn btn-primary">Más información</a>` : '')
    }
  `;

  const newsModal = new bootstrap.Modal(document.getElementById('newsModal'));
  newsModal.show();
}

// Función auxiliar para formatear el contenido (convertir enlaces, etc.)
function formatContent(content) {
  // Si el contenido contiene un enlace, convertirlo en un enlace real
  if (content.includes("https://") || content.includes("http://")) {
    // Buscar URLs en el texto y convertirlas en enlaces
    return content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-primary">$1</a>');
  }
  return content;
}

// Función para extraer la URL del contenido
function extractUrl(content) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = content.match(urlRegex);
  return match ? match[0] : '';
}

function displayErrorMessage() {
  const container = document.getElementById("newsContainer");
  if (container) {
    container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    No se pudieron cargar las novedades en este momento. Por favor, intenta más tarde.
                </div>
            </div>
        `;
  }
}