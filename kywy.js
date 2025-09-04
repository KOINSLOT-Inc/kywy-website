// splash screen 

var splashScreen = document.querySelector('.splash');
splashScreen.addEventListener('click', () => {
  splashScreen.style.opacity = 0;
  setTimeout(() => {
    splashScreen.classList.add('hidden')
  }, 500)

})


function FetchData() {
  splashScreen.style.opacity = 0;
  setTimeout(() => {
    splashScreen.classList.add('hidden')
  }, 200)
}
setInterval(FetchData, 3900);
