document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('historiaAccordionDynamic');
  if (!container) return;

  try {
    const response = await fetch('../data/historia.collapse.json');
    const data = await response.json();

    // data should be an array of sections
    // Each section: { id, heading, title, body }
    let accordionHtml = `<div class="accordion" id="historiaAccordion">`;

    data.forEach(section => {
      // Assume section.body is an array of strings for bullet points
      const bodyItems = Array.isArray(section.body)
        ? section.body.map(item => `<li>${item}</li>`).join('')
        : `<li>${section.body}</li>`;

      accordionHtml += `
        <div class="accordion-item mb-2">
          <h2 class="accordion-header" id="heading${section.id}">
        <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${section.id}" aria-expanded="false" aria-controls="collapse${section.id}">
          ${section.title}
        </button>
          </h2>
          <div id="collapse${section.id}" class="accordion-collapse collapse" aria-labelledby="heading${section.id}" data-bs-parent="#historiaAccordion">
        <div class="accordion-body">
          <ul>
            ${bodyItems}
          </ul>
        </div>
          </div>
        </div>
      `;
    });

    accordionHtml += `</div>`;
    container.innerHTML = accordionHtml;
  } catch (err) {
    container.innerHTML = '<div class="alert alert-danger">No se pudo cargar la historia.</div>';
    console.error(err);
  }
});