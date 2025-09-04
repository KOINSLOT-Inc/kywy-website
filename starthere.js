var startHere = document.querySelector('.startHere');
startHere.addEventListener('click', () => {
    startHere.style.opacity = 0;
    setTimeout(() => {
        startHere.classList.add('hidden')
    }, 500)

})


function FetchData() {
    startHere.style.opacity = 0;
    setTimeout(() => {
        startHere.classList.add('hidden')
    }, 200)
}
setInterval(FetchData, 8200);