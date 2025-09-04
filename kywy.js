// splash screen 

var splashScreen = document.querySelector('.splash');
var header = document.querySelector('.header');

splashScreen.addEventListener('click', () => {
  splashScreen.style.opacity = 0;
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    header.classList.add('visible');
  }, 500)

})


function FetchData() {
  splashScreen.style.opacity = 0;
  setTimeout(() => {
    splashScreen.classList.add('hidden');
    header.classList.add('visible');
  }, 200)
}

setInterval(FetchData, 3900);

// --- Moving Star Background Animation ---
function createStars(containerId, numStars, speed, color) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.style.position = "absolute";
  star.style.width = "4px";
  star.style.height = "4px";
    star.style.borderRadius = "50%";
    star.style.background = color || "#fff";
    star.style.opacity = Math.random() * 0.7 + 0.3;
    star.x = Math.random() * window.innerWidth;
    star.y = Math.random() * window.innerHeight;
    container.appendChild(star);
    stars.push(star);
  }
  function animateStars() {
    for (let star of stars) {
      star.y -= speed;
      if (star.y < 0) {
        star.y = window.innerHeight;
        star.x = Math.random() * window.innerWidth;
      }
      star.style.left = star.x + "px";
      star.style.top = star.y + "px";
    }
    requestAnimationFrame(animateStars);
  }
  animateStars();
}

window.addEventListener("DOMContentLoaded", function() {
  createStars("stars", 120, 0.5, "#fff");
  createStars("stars1", 80, 0.3, "#13c2b9");
  createStars("stars2", 60, 0.7, "#fff");
  createStars("stars3", 40, 1.2, "#fff");
});
