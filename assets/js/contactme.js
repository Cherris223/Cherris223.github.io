document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyC9YUJ1Zma5gZ302P7_cf7WIabndancUrZPDFgD8Y9j9rRnnqXR-eto8lNQ7-v6jAt/exec";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill out all fields.";
      status.style.color = "red";
      return;
    }

    status.textContent = "Sending...";
    status.style.color = "white";

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (result.status === "success") {
        status.textContent = "Message sent successfully!";
        status.style.color = "lightgreen";
        form.reset();
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error(err);
      status.textContent = "Error sending message.";
      status.style.color = "red";
    }
  });
});