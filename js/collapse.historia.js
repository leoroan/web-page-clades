document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('historiaAccordionDynamic');
  if (!container) return;

  try {
    const response = await fetch('../data/historia.collapse.json');
    const data = await response.json();

    // data should be an array of sections
    // Each section: { id, heading, title, body }
    let accordionHtml = `<div class="accordion w-100 " id="historiaAccordion">`;

    data.forEach(section => {
      // Assume section.body is an array of strings for bullet points
      const bodyItems = Array.isArray(section.body)
        ? section.body.map(item => `<li>${item}</li>`).join('')
        : `<li>${section.body}</li>`;

      accordionHtml += `
        <div class="accordion-item border-primary mb-2">
          <h2 class="accordion-header" id="heading${section.id}">
        <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${section.id}" aria-expanded="false" aria-controls="collapse${section.id}">
          ${section.title}
        </button>
          </h2>
          <div id="collapse${section.id}" class="accordion-collapse collapse" aria-labelledby="heading${section.id}" data-bs-parent="#historiaAccordion">
        <div class="accordion-body bg-primary-subtle">
          <ul class="list-group list-group-flush px-2">
            ${Array.isArray(section.body)
          ? section.body.map(item => {
            // If item is an object with text and img, render both
            if (typeof item === 'object' && item !== null && ('text' in item || 'img' in item)) {
                return `
                <li class="list-group-item bg-transparent border-0 ps-4" style="font-size:1.05em; line-height:1.7; display: flex; align-items: center; justify-content: space-between;">
                  <span>
                  <span class="fw-semibold text-primary-emphasis">&#8226;</span>
                  <span class="ms-2 text-dark-emphasis">${item.text || ''}</span>
                  </span>
                  ${item.img ? `<img src="${item.img}" alt="" style="height:5em; width:auto; margin-left:1em; object-fit:contain; border-radius:0.25em;">` : ''}
                </li>
                `;
            } else {
              // If item is just a string
              return `
                <li class="list-group-item bg-transparent border-0 ps-4" style="font-size:1.05em; line-height:1.7;">
              <span class="fw-semibold text-primary-emphasis">&#8226;</span>
              <span class="ms-2 text-dark-emphasis">${item}</span>
                </li>
              `;
            }
          }).join('')
          : `
              <li class="list-group-item bg-transparent border-0 ps-4" style="font-size:1.05em; line-height:1.7;">
            <span class="fw-semibold text-primary-emphasis">&#8226;</span>
            <span class="ms-2 text-dark-emphasis">${section.body}</span>
              </li>
            `
        }
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