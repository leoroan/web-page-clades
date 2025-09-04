document.addEventListener("DOMContentLoaded", async () => {
  const messagesBody = document.getElementById("messages-body");
  const modalContent = document.getElementById("modal-content");
  const modal = new bootstrap.Modal(document.getElementById("detailModal"));

  const apiUrl = "https://formsubmit.co/api/get-submissions/53401abed654d63fddfcda574a74c06e61009d6696bdac3eac63105745e46f88";
  const CACHE_KEY = "formsubmit_cache";
  const RATE_LIMIT_KEY = "formsubmit_rate_limit";
  const AUTH_KEY = "formsubmit_authenticated";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  const PASSWORD = "cladees2025";

  // 🔑 Autenticación
  if (!sessionStorage.getItem(AUTH_KEY)) {
    const pass = prompt("🔐 Ingrese la contraseña para acceder al panel:");
    if (pass !== PASSWORD) {
      alert("❌ Contraseña incorrecta.");
      window.location.href = "index.html";
      return;
    }
    sessionStorage.setItem(AUTH_KEY, "true");
  }

  // Función: Mostrar cuenta regresiva de 5 minutos (para caché)
  const showCacheCountdown = () => {
    messagesBody.innerHTML = `
      <tr class="table-info">
        <td colspan="6" class="text-center py-5">
          <i class="bi bi-clock-history text-primary me-2"></i>
          Actualizado desde caché. Próxima verificación en: 
          <strong id="countdown">5:00</strong>
        </td>
      </tr>`;
    startTimer(300);
  };

  // Función: Mostrar cuenta regresiva larga (rate limit: 22h, 1h, etc.)
  const showRateLimitCountdown = (totalMinutes) => {
    const totalSeconds = totalMinutes * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Formato legible: "20h 0m" o "5 min"
    const displayTime = totalMinutes >= 60
      ? `${hours}h ${minutes}m`
      : `${totalMinutes} min`;

    messagesBody.innerHTML = `
    <tr class="table-warning">
      <td colspan="6" class="text-center py-5">
        <i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>
        <strong>Demasiadas consultas.</strong><br>
        Próxima actualización en: 
        <strong id="countdown">${displayTime}</strong>
      </td>
    </tr>`;

    // Iniciar cuenta regresiva en segundos
    startTimer(totalSeconds);
  };

  // Controlador de temporizador
  const startTimer = (totalSeconds) => {
    const countdownEl = document.getElementById("countdown");
    let remaining = totalSeconds;

    const timer = setInterval(() => {
      remaining--;

      const hours = Math.floor(remaining / 3600);
      const mins = Math.floor((remaining % 3600) / 60);
      const secs = remaining % 60;

      // Mostrar formato adecuado
      const display = hours > 0
        ? `${hours}h ${mins.toString().padStart(2, '0')}m`
        : `${mins}:${secs.toString().padStart(2, '0')}`;

      if (countdownEl) {
        countdownEl.textContent = display;
      }

      if (remaining <= 0) {
        clearInterval(timer);
        location.reload();
      }
    }, 1000);
  };

  // ✅ Verificar si estamos en periodo de rate limit (22h, etc.)
  const rateLimitUntil = localStorage.getItem(RATE_LIMIT_KEY);
  if (rateLimitUntil && Date.now() < parseInt(rateLimitUntil)) {
    const minutesLeft = Math.ceil((parseInt(rateLimitUntil) - Date.now()) / (60 * 1000));
    showRateLimitCountdown(minutesLeft);
    return;
  }

  // ✅ Intentar usar caché solo si está dentro del tiempo permitido
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    try {
      const { data, timestamp } = JSON.parse(cachedData);
      // Usar caché solo si no ha expirado
      if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(data) && data.length > 0) {
        renderTable(data);
        showCacheCountdown();
        return; // ✅ No hacer fetch, usar caché
      }
      // Si el caché está vencido, eliminarlo
      if (Date.now() - timestamp >= CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
      }
    } catch (e) {
      console.warn("Caché corrupto, limpiando...");
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // ❌ Si no hay caché válido, y no estamos en rate limit, entonces hacer fetch
  try {
    messagesBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-5">
          <i class="bi bi-cloud-download me-2"></i>Actualizando desde servidor...
        </td>
      </tr>`;

    const response = await fetch(apiUrl);
    const result = await response.json();

    // ✅ Caso 1: Estamos en rate limit (ej: 22h)
    // ✅ Caso 1: Estamos en rate limit (ej: 22h)
    if (!result.success && result.message && result.message.includes("try again in")) {
      let totalMinutes = 60; // fallback: 1 hora

      // Buscar "X hours" (ej: "20 hours")
      const hoursMatch = result.message.match(/try again in (\d+) hours?/i);
      if (hoursMatch) {
        totalMinutes = parseInt(hoursMatch[1], 10) * 60; // 20h → 1200 minutos
      } else {
        // Buscar "X minutes" (ej: "5 minutes")
        const minutesMatch = result.message.match(/try again in (\d+) minutes?/i);
        if (minutesMatch) {
          totalMinutes = parseInt(minutesMatch[1], 10); // 5 minutos
        }
      }

      // ✅ Guardar el tiempo exacto de reintentar
      const retryAt = Date.now() + (totalMinutes * 60 * 1000);
      localStorage.setItem(RATE_LIMIT_KEY, retryAt);

      // ✅ Mostrar cuenta regresiva con el total en minutos
      showRateLimitCountdown(totalMinutes);
      return;
    }

    // ✅ Caso 2: Éxito
    if (result.success && Array.isArray(result.submissions)) {
      // Guardar en caché
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data: result.submissions, timestamp: Date.now() })
      );

      renderTable(result.submissions);
      showCacheCountdown();
      return;
    }

    // ✅ Caso 3: Sin mensajes pero success true
    if (result.success && Array.isArray(result.submissions) && result.submissions.length === 0) {
      renderTable([]);
      return;
    }

    // ❌ Caso 4: Otra respuesta inesperada
    throw new Error("Respuesta inválida");
  } catch (error) {
    console.error("Error al conectar con API:", error);

    // ✅ Mostrar caché incluso si está vencido (mejor que nada)
    if (cachedData) {
      try {
        const { data } = JSON.parse(cachedData);
        renderTable(data);
        messagesBody.innerHTML += `
          <tr class="table-warning">
            <td colspan="6" class="text-center small text-danger">
              ⚠️ Sin conexión. Mostrando datos antiguos.
            </td>
          </tr>`;
        showCacheCountdown();
        return;
      } catch (e) { }
    }

    // ❌ Sin caché ni conexión
    messagesBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-danger py-5">
          ❌ No hay conexión ni datos locales disponibles.
        </td>
      </tr>`;
  }

  // ✅ Renderizar tabla
  function renderTable(submissions) {
    if (submissions.length === 0) {
      messagesBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-5">
            <i class="bi bi-inbox me-2"></i>No hay mensajes aún.
          </td>
        </tr>`;
      return;
    }

    submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    messagesBody.innerHTML = submissions.map((msg, index) => {
      const date = new Date(msg.timestamp || msg.submitted_at?.date);
      const formatted = date.toLocaleString("es-AR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "America/Argentina/Buenos_Aires"
      });

      return `
        <tr>
          <td><strong>#${index + 1}</strong></td>
          <td>${escapeHtml(msg.form_data.nombre || "Sin nombre")}</td>
          <td>${escapeHtml(msg.form_data.email || "Sin email")}</td>
          <td>${escapeHtml(msg.form_data.motivo || "General")}</td>
          <td><span class="badge badge-timestamp">${formatted}</span></td>
          <td>
            <button class="btn btn-outline-primary btn-sm btn-view" data-id="${index}">
              <i class="bi bi-eye-fill me-1"></i>Ver
            </button>
          </td>
        </tr>`;
    }).join("");

    document.querySelectorAll(".btn-view").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const msg = submissions[id];
        openModal(msg);
      });
    });
  }

  // ✅ Evitar XSS
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // ✅ Modal
  function openModal(msg) {
    const date = new Date(msg.timestamp || msg.submitted_at?.date);
    const formatted = date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "America/Argentina/Buenos_Aires"
    });

    modalContent.innerHTML = `
      <p><strong><i class="bi bi-person-fill text-primary me-2"></i>Nombre:</strong> ${escapeHtml(msg.form_data.nombre || "No proporcionado")}</p>
      <p><strong><i class="bi bi-envelope-fill text-warning me-2"></i>Email:</strong> 
         <a href="mailto:${escapeHtml(msg.form_data.email || '')}" class="text-primary">${escapeHtml(msg.form_data.email || "No proporcionado")}</a>
      </p>
      <p><strong><i class="bi bi-chat-dots-fill text-info me-2"></i>Motivo:</strong> ${escapeHtml(msg.form_data.motivo || "General")}</p>
      <p><strong><i class="bi bi-telephone-fill text-success me-2"></i>Teléfono:</strong> ${escapeHtml(msg.form_data.telefono || "No proporcionado")}</p>
      <hr>
      <p><strong><i class="bi bi-chat-text-fill text-danger me-2"></i>Mensaje:</strong></p>
      <blockquote class="border-start border-primary ps-3">${escapeHtml(msg.form_data.mensaje || "Sin mensaje.").replace(/\n/g, '<br>')}</blockquote>
      <hr>
      <p class="text-muted small">
        <i class="bi bi-clock-fill me-1"></i>Recibido el: ${formatted}
      </p>`;
    modal.show();
  }
});