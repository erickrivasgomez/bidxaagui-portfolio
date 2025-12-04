const form = document.getElementById("magic-form");
const msg = document.getElementById("msg");
const workerBase = "https://bidxaagui-newsletter.rivaserick.workers.dev";
const requestUrl = `${workerBase}/auth/request-link`;

if (!form || !msg) {
  console.warn("Magic link elements not found");
} else {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const emailInput = form.elements.namedItem("email");

    if (!(emailInput instanceof HTMLInputElement)) {
      console.warn("Email input not found in magic form");
      return;
    }

    const email = emailInput.value.trim().toLowerCase();
    if (!email) {
      msg.textContent = "Por favor ingresa un correo válido.";
      msg.style.color = "var(--accent)";
      return;
    }

    msg.textContent = "Enviando…";
    msg.style.color = "inherit";
    button?.setAttribute("disabled", "true");

    try {
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        msg.textContent = "Si tu correo está autorizado, recibirás un enlace en unos segundos.";
        msg.style.color = "green";
        form.reset();
      } else {
        const errorText = await response.text();
        console.warn("Magic link error", response.status, errorText);
        msg.textContent = "Error al enviar el enlace. Intenta nuevamente.";
        msg.style.color = "var(--accent)";
      }
    } catch (error) {
      console.error("Magic link network error", error);
      msg.textContent = "No se pudo contactar al servidor. Revisa tu conexión.";
      msg.style.color = "var(--accent)";
    } finally {
      button?.removeAttribute("disabled");
    }
  });
}
