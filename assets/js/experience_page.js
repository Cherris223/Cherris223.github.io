let allProjects = [];

const params = new URLSearchParams(window.location.search);

const experienceId = params.get("id").toLowerCase();

async function loadExperiencePage() {

  try {

    const [experienceRes, projectsRes] = await Promise.all([
      fetch("assets/json/experience.json"),
      fetch("assets/json/projects.json")
    ]);

    const experienceData = await experienceRes.json();

    allProjects = await projectsRes.json();

    const experience = experienceData.find(item => {

      const generatedId =
        item.id ||
        item.title.toLowerCase();

      return generatedId === experienceId;
    });

    if (!experience) {

      renderNotFound();

      return;
    }

    renderExperience(experience);

  } catch (err) {

    console.error("Failed to load experience page:", err);

    renderNotFound();
  }
}

function renderExperience(experience) {

  document.getElementById("experience-title").textContent =
    experience.title;

  document.getElementById("experience-company").textContent =
    experience.company;

  document.getElementById("experience-date").textContent =
    experience.date;

  document.getElementById("experience-description").textContent =
    experience.description;

  const tagsContainer =
    document.getElementById("experience-tags");

  tagsContainer.innerHTML = "";

  experience.tags.forEach(tag => {

    const tagEl = document.createElement("span");

    tagEl.className = "tag";

    tagEl.textContent = tag;

    tagsContainer.appendChild(tagEl);
  });

  const detailsList =
    document.getElementById("experience-details-list");

  detailsList.innerHTML = "";

  if (experience.details) {

    experience.details.forEach(detail => {

      const li = document.createElement("li");

      li.textContent = detail;

      detailsList.appendChild(li);
    });
  }

  renderRelatedProjects(experience);
}

function renderRelatedProjects(experience) {

  const carousel =
    document.getElementById("related-projects-carousel");

  carousel.innerHTML = "";
  const relatedProjects = allProjects.filter(project => {

    return project.tags.some(projectTag => {

      return experience.tags.some(experienceTag => {

        return projectTag.toLowerCase() ===
               experienceTag.toLowerCase();
      });
    });
  });
  if (relatedProjects.length === 0) {

    carousel.innerHTML = `
      <p>No related projects found.</p>
    `;

    return;
  }

  relatedProjects.forEach(project => {

    const card = document.createElement("a");

    card.href =
      `project.html?id=${project.id}`;

    card.className = "project-card";

    card.innerHTML = `

      <img
        src="${project.image}"
        alt="${project.title}"
      >

      <div class="project-card-content">

        <h3>${project.title}</h3>

        <p>${project.description}</p>

        <div class="project-tags">
          ${project.tags.join(", ")}
        </div>

      </div>
    `;

    carousel.appendChild(card);
  });

  setupCarouselButtons();
}

function setupCarouselButtons() {

  const carousel =
    document.getElementById("related-projects-carousel");

  const prev =
    document.getElementById("projects-prev");

  const next =
    document.getElementById("projects-next");

  prev.addEventListener("click", () => {

    carousel.scrollBy({
      left: -340,
      behavior: "smooth"
    });
  });

  next.addEventListener("click", () => {

    carousel.scrollBy({
      left: 340,
      behavior: "smooth"
    });
  });
}

function renderNotFound() {

  document.querySelector(".experience-page").innerHTML = `

    <section class="not-found">

      <h1>Experience Not Found</h1>

      <p>
        The requested experience entry does not exist.
      </p>

      <a
        href="index.html#experience"
        class="back-button"
      >
        ← Return Home
      </a>

    </section>
  `;
}

document.addEventListener("DOMContentLoaded", () => {

  loadExperiencePage();
});