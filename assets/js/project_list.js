const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

const categories = {
  "electrical-engineering": "Electrical Engineering",
  "mechanical-engineering": "Mechanical Engineering",
  "software-engineering": "Software Engineering",
  "robotics": "Robotics",
  "ai-ml": "AI / ML",
  "civil-engineering": "Civil Engineering"
};

const categoryTagMap = {
  "robotics": ["robotics", "autonomous systems"],
  "electrical-engineering": ["embedded", "pcb", "power electronics"],
  "software-engineering": ["analysis", "malware", "security", "software"],
  "ai-ml": ["ai", "machine learning"],
  "civil-engineering": ["civil"],
  "mechanical-engineering": ["mechanical"]
};

const titleEl = document.getElementById("category-title");
const container = document.getElementById("projects-container");
const notFound = document.getElementById("not-found");

titleEl.textContent = categories[categoryId] || "Projects";

async function loadProjects() {
  try {
    const res = await fetch("assets/json/projects.json");
    const projects = await res.json();

    const allowedTags = (categoryTagMap[categoryId] || [])
      .map(t => t.toLowerCase());

    const filtered = projects.filter(project => {
      if (!project.tags) return false;

      return project.tags.some(tag =>
        allowedTags.includes(tag.toLowerCase())
      );
    });

    render(filtered);

  } catch (err) {
    console.error("Error loading projects.json:", err);
    notFound.classList.remove("hidden");
  }
}

function render(projects) {
  container.innerHTML = "";

  if (!projects.length) {
    notFound.classList.remove("hidden");
    return;
  }

  notFound.classList.add("hidden");

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <img src="${project.image}" alt="${project.title}" style="
        width:100%;
        height:160px;
        object-fit:cover;
        border-radius:10px;
        margin-bottom:12px;
      "/>

      <h3>${project.title}</h3>
      <p>${project.description}</p>

      <div class="tag-container">
        ${project.tags.map(tag => `
          <span class="tag">${tag}</span>
        `).join("")}
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `project.html?id=${project.id}`;
    });

    container.appendChild(card);
  });
}

loadProjects();