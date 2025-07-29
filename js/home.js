// Home page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Add any home-specific functionality here
  console.log("Home page loaded")

  // Example: Add animation to hero section
  const heroSection = document.querySelector(".bg-light.py-5")
  if (heroSection) {
    // Add fade-in effect on page load
    heroSection.style.opacity = "0"
    heroSection.style.transform = "translateY(20px)"
    heroSection.style.transition = "opacity 0.6s ease, transform 0.6s ease"

    setTimeout(() => {
      heroSection.style.opacity = "1"
      heroSection.style.transform = "translateY(0)"
    }, 100)
  }
})
