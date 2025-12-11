  const form = document.getElementById("newsletter-form");
  const msg = document.getElementById("newsletter-msg");
  const workerUrl = "/api/newsletter/subscribe";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Enviando…";

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();

    const res = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
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