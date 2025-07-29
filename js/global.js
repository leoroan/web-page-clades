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
      e.preventDefault()

      // Show success message (you can customize this)
      const submitButton = form.querySelector('button[type="submit"]')
      const originalText = submitButton.innerHTML

      submitButton.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Mensaje enviado'
      submitButton.classList.remove("btn-primary")
      submitButton.classList.add("btn-success")
      submitButton.disabled = true

      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset()
        submitButton.innerHTML = originalText
        submitButton.classList.remove("btn-success")
        submitButton.classList.add("btn-primary")
        submitButton.disabled = false
      }, 3000)
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
