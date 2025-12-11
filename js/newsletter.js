  const form = document.getElementById("newsletter-form");
const msg = document.getElementById("newsletter-msg");
// Usar el subdominio personalizado
const workerUrl = "https://api.bidxaagui.com/api/newsletter/subscribe";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Enviando…";

  try {
    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();

    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();

    if (data.success) {
      msg.style.color = "green";
      msg.textContent = "¡Gracias por suscribirte!";
      form.reset();
    } else {
      msg.style.color = "red";
      msg.textContent = data.error || "No se pudo suscribir. Intenta más tarde.";
    }
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    msg.style.color = "red";
    msg.textContent = "Error al conectar con el servidor. Intenta nuevamente.";
  }
});
/*
{
  "d1_databases": [
    {
      "binding": "newsletter_db",
      "database_name": "newsletter_db",
      "database_id": "808f85ca-21b6-4c50-96b5-bd1f71340ed9"
    }
  ]
}
*/