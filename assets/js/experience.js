let experienceData = [];

async function loadExperience() {
  try {
    const res = await fetch("assets/json/experience.json");
    experienceData = await res.json();
    renderExperience(experienceData);
  } catch (err) {
    console.error("Error loading experience:", err);
  }
}

function renderExperience(data) {
  const container = document.getElementById("experience-results");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No experience found.</p>";
    return;
  }

  data.forEach(item => {

    const link = document.createElement("a");

    const experienceId = item.title.toLowerCase();

    link.href = `experience.html?id=${experienceId}`;
    link.className = "experience-link";

    link.innerHTML = `
      <div class="experience-card">
        
        <div class="experience-header">
          <div>
            <h3>${item.title}</h3>
            <p><strong>${item.company}</strong> | ${item.date}</p>
          </div>

          <div class="experience-arrow">
            →
          </div>
        </div>

        <p>${item.description}</p>

        <div class="experience-tags">
          ${item.tags.join(", ")}
        </div>

      </div>
    `;

    container.appendChild(link);
  });
}

function setupSearch() {
  const searchInput = document.getElementById("experience-search");

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = experienceData.filter(item =>
      item.title.toLowerCase().includes(value) ||
      item.company.toLowerCase().includes(value) ||
      item.tags.some(tag => tag.toLowerCase().includes(value)) ||
      item.description.toLowerCase().includes(value)
    );

    renderExperience(filtered);
  });
}

function applySearch(value) {
  const searchInput = document.getElementById("experience-search");

  searchInput.value = value;

  const filtered = experienceData.filter(item =>
    item.title.toLowerCase().includes(value) ||
    item.company.toLowerCase().includes(value) ||
    item.tags.some(tag => tag.toLowerCase().includes(value)) ||
    item.description.toLowerCase().includes(value)
  );

  renderExperience(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  loadExperience();
  setupSearch();

  const skillCards = document.querySelectorAll(".hero-skill-card");

  skillCards.forEach(card => {
    card.addEventListener("click", () => {
      const filter = card.dataset.filter;

      if (!filter) return;

      applySearch(filter);

      document.getElementById("experience").scrollIntoView({
        behavior: "smooth"
      });
    });
  });
});