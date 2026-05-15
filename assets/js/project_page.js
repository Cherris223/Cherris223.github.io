let allExperiences = [];

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

async function loadProjectPage() {
  try {
    const [projectsRes, experiencesRes] = await Promise.all([
      fetch("assets/json/projects.json"),
      fetch("assets/json/experience.json")
    ]);

    const projects = await projectsRes.json();
    allExperiences = await experiencesRes.json();

    const project = projects.find(item => {
      const generatedId = item.id || item.title.toLowerCase().replace(/\s+/g, "-");
      return generatedId === projectId;
    });

    if (!project) {
      renderNotFound();
      return;
    }

    renderProject(project);

  } catch (err) {
    console.error("Failed to load project:", err);
    renderNotFound();
  }
}

function renderProject(project) {
  // Set project title, date, role, description
  document.getElementById("project-title").textContent = project.title;
  document.getElementById("project-date").textContent = project.date || "";
  document.getElementById("project-role").textContent = project.role || "";
  document.getElementById("project-description").textContent = project.description;

  // Set main image
  const mainImage = document.getElementById("project-main-image");
  mainImage.src = project.image || "assets/images/placeholder.jpg";
  mainImage.alt = project.title;

  // Render tags
  const tagsContainer = document.getElementById("project-tags");
  tagsContainer.innerHTML = "";
  if (project.tags) {
    project.tags.forEach(tag => {
      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = tag;
      tagsContainer.appendChild(tagEl);
    });
  }

  // Render Key Contributions (details)
  const detailsCard = document.querySelector(".project-details-card");
  const detailsList = document.getElementById("project-details-list");
  detailsList.innerHTML = "";

  if (project.details && project.details.length > 0) {
    project.details.forEach(detail => {
      const li = document.createElement("li");
      li.textContent = detail;
      detailsList.appendChild(li);
    });
    detailsCard.style.display = "block"; // show section
  } else {
    detailsCard.style.display = "none"; // hide section if empty
  }

  // Render gallery and related experience
  loadProjectGallery(project);
  renderRelatedExperience(project);
}

async function loadProjectGallery(project) {
  const gallery = document.getElementById("project-gallery");
  gallery.innerHTML = "";
  const galleryItems = [];

  // Include main project image first
  if (project.image) {
    galleryItems.push({ type: "image", src: project.image, caption: project.title });
  }

  try {
    const manifestPath = `assets/project_data/${project.id}/manifest.json`;
    const response = await fetch(manifestPath);

    if (response.ok) {
      const manifest = await response.json();
      if (manifest.gallery) {
        manifest.gallery.forEach(item => {
          galleryItems.push({ ...item, src: `assets/project_data/${project.id}/${item.src}` });
        });
      }
    }

  } catch (err) {
    console.warn("No manifest found:", err);
  }

  if (galleryItems.length === 0) {
    gallery.innerHTML = `<p>No gallery content available.</p>`;
    return;
  }

  // Render gallery items
  galleryItems.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "gallery-item";

    if (item.type === "image") {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || project.title;
      wrapper.appendChild(img);

      if (item.caption) {
        const caption = document.createElement("p");
        caption.className = "gallery-caption";
        caption.textContent = item.caption;
        wrapper.appendChild(caption);
      }
    } else if (item.type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.src = item.src;
      wrapper.appendChild(video);

      if (item.caption) {
        const caption = document.createElement("p");
        caption.className = "gallery-caption";
        caption.textContent = item.caption;
        wrapper.appendChild(caption);
      }
    } else if (item.type === "pdf") {
      wrapper.innerHTML = `
        <div class="file-card">
          <img src="assets/images/PDFicon.png" />
          <h3>${item.title || "PDF Document"}</h3>
          <a href="${item.src}" target="_blank" class="file-button">Open PDF</a>
        </div>`;
    } else {
      wrapper.innerHTML = `
        <div class="file-card">
          <img src="assets/images/PDFicon.png" />
          <h3>${item.title || "Download File"}</h3>
          <a href="${item.src}" target="_blank" class="file-button">Download</a>
        </div>`;
    }

    gallery.appendChild(wrapper);
  });
}

function renderRelatedExperience(project) {
  const carousel = document.getElementById("related-experience-carousel");
  carousel.innerHTML = "";

  const relatedExperience = allExperiences.filter(experience => {
    if (!experience.tags || !project.tags) return false;
    return experience.tags.some(expTag => project.tags.some(projTag => expTag.toLowerCase() === projTag.toLowerCase()));
  });

  if (relatedExperience.length === 0) {
    carousel.innerHTML = `<p>No related experience found.</p>`;
    return;
  }

  relatedExperience.forEach(experience => {
    const card = document.createElement("a");
    card.href = `experience.html?id=${experience.title}`;
    card.className = "experience-card";
    card.innerHTML = `
      <div class="experience-card-content">
        <h3>${experience.title}</h3>
        <p>${experience.company || ""}</p>
        <p>${experience.description || ""}</p>
        <div class="experience-tags">${(experience.tags || []).join(", ")}</div>
      </div>`;
    carousel.appendChild(card);
  });

  setupCarouselButtons();
}

function setupCarouselButtons() {
  const carousel = document.getElementById("related-experience-carousel");
  const prev = document.getElementById("experience-prev");
  const next = document.getElementById("experience-next");

  prev.addEventListener("click", () => {
    carousel.scrollBy({ left: -340, behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    carousel.scrollBy({ left: 340, behavior: "smooth" });
  });
}

function renderNotFound() {
  document.querySelector(".project-page").innerHTML = `
    <section class="not-found">
      <h1>Project Not Found</h1>
      <p>The requested project does not exist.</p>
      <a href="index.html#projects-section" class="back-button">← Return Home</a>
    </section>`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjectPage();
});