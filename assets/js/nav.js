document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("nav-placeholder");

  fetch("assets/html/nav.html")
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;

      initNavToggle();
      initScrollNav();
    })
    .catch(err => {
      console.error("Failed to load nav:", err);
    });
});

function initNavToggle() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  navLinks.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    navLinks.classList.remove("active");
  });
}

function initScrollNav() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const SHOW_AFTER = 600; 

  let lastState = null;

  function updateNav() {
    const shouldShow = window.scrollY > SHOW_AFTER;

    if (shouldShow !== lastState) {
      nav.classList.toggle("show", shouldShow);
      lastState = shouldShow;
    }
  }

  window.addEventListener("scroll", updateNav, { passive: true });

  updateNav();
}