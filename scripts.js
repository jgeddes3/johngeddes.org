document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "/index.html";
});
document.getElementById("about-btn").addEventListener("click", () => {
  window.location.href = "/about.html";
});
document.getElementById("projects-btn").addEventListener("click", () => {
  window.location.href = "/projects.html";
});
// Contact button does nothing for now
// Listen for scroll events
window.addEventListener("scroll", function() {
  const buttons = document.querySelectorAll(".nav-btn");

  if (window.scrollY >= 240) {
    buttons.forEach(btn => btn.classList.add("scrolled"));
  } else {
    buttons.forEach(btn => btn.classList.remove("scrolled"));
  }
});

  