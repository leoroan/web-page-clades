// News page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  loadNews()
})

async function loadNews() {
  try {
    const response = await fetch("data/novedades.json")
    const news = await response.json()
    displayNews(news)
  } catch (error) {
    console.error("Error loading news:", error)
    displayErrorMessage()
  }
}

function displayNews(newsArray) {
  const container = document.getElementById("newsContainer")

  if (!container) return

  container.innerHTML = ""

  newsArray.forEach((news) => {
    const newsCard = createNewsCard(news)
    container.appendChild(newsCard)
  })
}

function createNewsCard(news) {
  const col = document.createElement("div")
  col.className = "col-lg-4 col-md-6"

  const formattedDate = formatDate(news.fecha)

  col.innerHTML = `
        <div class="h-100 bg-white rounded shadow-sm overflow-hidden">
            <img src="${news.imagen}" class="w-100" style="height: 250px; object-fit: cover;" alt="${news.titulo}">
            <div class="p-4">
                <div class="d-flex align-items-center mb-2">
                    <i class="bi bi-calendar-event text-primary me-2"></i>
                    <small class="text-muted">${formattedDate}</small>
                </div>
                <h5 class="text-primary fw-bold mb-3">${news.titulo}</h5>
                <p class="text-muted mb-3">${news.descripcion}</p>
                <button class="btn btn-outline-primary btn-sm" onclick="showNewsDetail(${news.id})">
                    <i class="bi bi-arrow-right me-1"></i>Leer más
                </button>
            </div>
        </div>
    `

  return col
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("es-ES", options)
}

function showNewsDetail(newsId) {
  // This function could open a modal or navigate to a detail page
  // For now, we'll show an alert
  alert(`Funcionalidad de detalle para la noticia ID: ${newsId} - Esta funcionalidad se puede expandir más adelante.`)
}

function displayErrorMessage() {
  const container = document.getElementById("newsContainer")
  if (container) {
    container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center" role="alert">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    No se pudieron cargar las novedades en este momento. Por favor, intenta más tarde.
                </div>
            </div>
        `
  }
}
