// Global JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
  // Back to top button functionality
  const backToTopButton = document.getElementById("backToTop")

  if (backToTopButton) {
    // Show/hide back to top button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.remove("d-none")
      } else {
        backToTopButton.classList.add("d-none")
      }
    })

    // Smooth scroll to top when button is clicked
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Form submission handling
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      // ⚠️ No uses e.preventDefault() aquí

      const submitButton = form.querySelector('button[type="submit"]')

      // Opcional: cambia el texto mientras se envía (el usuario no lo verá si redirige)
      submitButton.innerHTML = '<i class="bi bi-send-fill me-2"></i>Enviando...'
      submitButton.disabled = true
    })
  })

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href")
      if (targetId !== "#") {
        e.preventDefault()
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          })
        }
      }
    })
  })
})
