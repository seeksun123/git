document.querySelectorAll(".nav-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const nav = document.getElementById(button.getAttribute("aria-controls"));
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  });
});

document.querySelectorAll(".language-select > button").forEach((button) => {
  button.addEventListener("click", () => {
    const shell = button.closest(".language-select");
    const open = !shell.classList.contains("open");
    shell.classList.toggle("open", open);
    button.setAttribute("aria-expanded", String(open));
  });
});

document.querySelectorAll(".inquiry-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    const trap = form.querySelector("[name='website']");
    if (trap && trap.value) {
      event.preventDefault();
      return;
    }

    const endpoint = form.dataset.endpoint;
    const status = form.querySelector(".form-status");
    const button = form.querySelector("button[type='submit']");

    if (!endpoint || !window.fetch) {
      button.textContent = "Opening email...";
      return;
    }

    event.preventDefault();
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Sending...";
    if (status) status.textContent = "";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      form.reset();
      if (status) status.textContent = "Inquiry sent. We will reply by email.";
    } catch {
      if (status) status.textContent = "Opening your email app as a fallback.";
      window.location.href = form.action;
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
});
