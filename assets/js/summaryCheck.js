  document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 768) {
      document.querySelector(".hero-objective")?.remove();
    }
  });