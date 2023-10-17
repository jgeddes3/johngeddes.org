document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "/index.html";
});
document.getElementById("about-btn").addEventListener("click", () => {
  window.location.href = "/about.html";
});
document.getElementById("projects-btn").addEventListener("click", () => {
  window.location.href = "/projects.html";
});
document.getElementById("contact-btn").addEventListener("click", () => {
  window.location.href = "/contact.html";
});
document.getElementById("misc-btn").addEventListener("click", () => {
  window.location.href = "/misc.html";
});
// Listen for scroll events
window.addEventListener("scroll", function() {
  const buttons = document.querySelectorAll(".nav-btn");

  if (window.scrollY >= 240) {
    buttons.forEach(btn => btn.classList.add("scrolled"));
  } else {
    buttons.forEach(btn => btn.classList.remove("scrolled"));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  let angle = 0;
  const step = 0.005;
  const radius = 400;

  function updateOrbPositions() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const orb1 = document.getElementById("orb1");
    const orb2 = document.getElementById("orb2");
    const orb3 = document.getElementById("orb3");
    const orb4 = document.getElementById("orb4");

    orb1.style.left = `${centerX + radius * Math.cos(angle) - orb1.clientWidth / 2}px`;
    orb1.style.top = `${centerY + radius * Math.sin(angle) - orb1.clientHeight / 2}px`;

    orb2.style.left = `${centerX + radius * Math.cos(angle + Math.PI / 2) - orb2.clientWidth / 2}px`;
    orb2.style.top = `${centerY + radius * Math.sin(angle + Math.PI / 2) - orb2.clientHeight / 2}px`;

    orb3.style.left = `${centerX + radius * Math.cos(angle + Math.PI) - orb3.clientWidth / 2}px`;
    orb3.style.top = `${centerY + radius * Math.sin(angle + Math.PI) - orb3.clientHeight / 2}px`;

    orb4.style.left = `${centerX + radius * Math.cos(angle + 3 * Math.PI / 2) - orb4.clientWidth / 2}px`;
    orb4.style.top = `${centerY + radius * Math.sin(angle + 3 * Math.PI / 2) - orb4.clientHeight / 2}px`;

    angle += step;
  }

  setInterval(updateOrbPositions, 16);
});

document.addEventListener("DOMContentLoaded", function() {
  const button1 = document.getElementById('button1');
  const rGroup = document.getElementById('rGroup');

  button1.addEventListener('mouseover', function() {
    button1.style.height = "557px";
    button1.style.background = "#933739";
    rGroup.style.transform = "translateY(-9px)";
  });

  button1.addEventListener('mouseout', function() {
    button1.style.height = "548px";
    button1.style.background = "#BC4749";
    rGroup.style.transform = "translateY(0)";
  });
});
