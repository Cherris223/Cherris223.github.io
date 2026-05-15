const categories = [
  "Electrical Engineering",
  "Mechanical Engineering",
  "Software Engineering",
  "Robotics"
];

const container = document.getElementById("projects-web");
const svg = document.getElementById("projects-lines");
const centerNode = document.querySelector(".projects-center-node");

const nodes = [];

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

categories.forEach((name, i) => {
  const node = document.createElement("div");
  node.className = "node";
  node.textContent = name;

  container.appendChild(node);

  const id = toSlug(name);

  nodes.push({
    node,
    id,
    angleIndex: i,
    x: 0,
    y: 0,
    path: null
  });

  node.addEventListener("mouseenter", () => highlight(node));
  node.addEventListener("mouseleave", resetHighlight);

  node.addEventListener("click", () => {
    window.location.href = `projects_list.html?id=${id}`;
  });
});

function layout() {
  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  const radius = Math.min(rect.width, rect.height) * 0.35;

  nodes.forEach((n, i) => {
    const angle = (i / categories.length + 3.128) * Math.PI * 2;

    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    n.x = x;
    n.y = y;

    n.node.style.left = `${x}px`;
    n.node.style.top = `${y}px`;
  });

  drawLines();
}

function drawLines() {
  const rect = container.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  svg.innerHTML = "";

  nodes.forEach(n => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    const dx = n.x - cx;
    const dy = n.y - cy;

    const mx = cx + dx * 0.5;
    const my = cy + dy * 0.5 - 40;

    const d = `M ${cx} ${cy} Q ${mx} ${my} ${n.x} ${n.y}`;

    path.setAttribute("d", d);
    svg.appendChild(path);

    n.path = path;
  });
}

function highlight(activeNode) {
  nodes.forEach(n => {
    if (n.node !== activeNode) {
      n.node.classList.add("dim");
      if (n.path) n.path.style.stroke = "rgba(120,200,255,0.1)";
    } else {
      n.node.classList.add("highlight");
      if (n.path) {
        n.path.style.stroke = "rgba(120,200,255,1)";
        n.path.style.strokeWidth = "3";
      }
    }
  });
}

function resetHighlight() {
  nodes.forEach(n => {
    n.node.classList.remove("dim", "highlight");
    if (n.path) {
      n.path.style.stroke = "rgba(120,180,255,0.35)";
      n.path.style.strokeWidth = "2";
    }
  });
}

centerNode.addEventListener("mouseenter", () => {
  nodes.forEach(n => {
    n.node.classList.remove("dim");
    if (n.path) n.path.style.stroke = "rgba(120,200,255,0.6)";
  });
});

centerNode.addEventListener("mouseleave", resetHighlight);

function onResize() {
  layout();
}

layout();

window.addEventListener("resize", () => {
  clearTimeout(window.__projResize);
  window.__projResize = setTimeout(layout, 60);
});

window.addEventListener("orientationchange", onResize);