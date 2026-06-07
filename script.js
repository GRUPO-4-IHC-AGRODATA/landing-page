const menuToggle = document.querySelector("#menuToggle");
const primaryMenu = document.querySelector("#primaryMenu");
const contrastToggle = document.querySelector("#contrastToggle");
const offlineToggle = document.querySelector("#offlineToggle");
const offlineStatus = document.querySelector("#offlineStatus");
const scanButton = document.querySelector("#scanButton");
const scanResult = document.querySelector("#scanResult");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

offlineToggle.dataset.status = "offline";

// A11y: el menú actualiza aria-expanded para lectores de pantalla y teclado.
menuToggle.addEventListener("click", () => {
  const isOpen = primaryMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
  );
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (primaryMenu.classList.contains("is-open")) {
      primaryMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    }
  });
});

if (contrastToggle) {
  contrastToggle.addEventListener("click", () => {
    const isHighContrast = document.body.classList.toggle("is-high-contrast");
    contrastToggle.textContent = isHighContrast ? "Contraste normal" : "Alto contraste";
  });
}

offlineToggle.addEventListener("click", () => {
  const isOnline = offlineToggle.dataset.status === "online";

  offlineToggle.dataset.status = isOnline ? "offline" : "online";
  offlineStatus.textContent = isOnline
    ? "Modo offline listo"
    : "Conexión activa";
  offlineToggle.textContent = isOnline ? "SAFE WORK?" : "ONLINE";
});

// Heurística de Nielsen: muestra estado del sistema antes del resultado simulado.
scanButton.addEventListener("click", () => {
  scanButton.disabled = true;
  scanButton.textContent = "Analizando imagen...";
  scanResult.innerHTML = "<p><strong>Estado:</strong> Analizando imagen del cultivo...</p>";

  window.setTimeout(() => {
    scanResult.innerHTML = `
      <p class="scan-result__severity"><span aria-hidden="true">!</span> Severidad media</p>
      <h3>Diagnóstico simulado: posible mancha foliar</h3>
      <p><strong>Recomendación:</strong> separa hojas afectadas, mejora ventilación y consulta un producto autorizado.</p>
      <p><strong>Advertencia de seguridad:</strong> usa guantes, mascarilla y evita aplicar plaguicidas sin revisar la etiqueta.</p>
    `;
    scanButton.disabled = false;
    scanButton.textContent = "Escanear cultivo";
  }, 1400);
});

function showFieldError(field, message) {
  const error = document.querySelector(`#${field.id}Error`);

  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", error.id);
  error.textContent = message;
}

function clearFieldError(field) {
  const error = document.querySelector(`#${field.id}Error`);

  field.removeAttribute("aria-invalid");
  field.removeAttribute("aria-describedby");
  error.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const fields = [name, email, message];
  let isValid = true;

  fields.forEach(clearFieldError);
  formStatus.textContent = "";
  formStatus.classList.remove("is-success");

  if (name.value.trim().length < 2) {
    showFieldError(name, "Ingresa tu nombre para poder contactarte.");
    isValid = false;
  }

  if (!isValidEmail(email.value.trim())) {
    showFieldError(email, "Ingresa un correo válido, por ejemplo nombre@correo.com.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    showFieldError(message, "Escribe un mensaje de al menos 10 caracteres.");
    isValid = false;
  }

  if (!isValid) {
    const firstInvalidField = fields.find((field) => field.getAttribute("aria-invalid") === "true");
    firstInvalidField.focus();
    return;
  }

  contactForm.reset();
  formStatus.textContent = "Mensaje enviado correctamente. Gracias por contactar a Agrosoft.";
  formStatus.classList.add("is-success");
});
