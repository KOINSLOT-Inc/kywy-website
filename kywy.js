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
