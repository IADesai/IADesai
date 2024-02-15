var imgs = document.querySelectorAll(".slider img");
var dots = document.querySelectorAll(".dot");
var currentImg = 0; // index of the first image
const interval = 8000; // duration(speed) of the slide

function changeSlide(n) {
  for (var i = 0; i < imgs.length; i++) {
    // reset
    imgs[i].style.opacity = 0;
    dots[i].classList.remove("active");
  }

  currentImg = (n + imgs.length) % imgs.length;

  imgs[currentImg].style.opacity = 1;
  dots[currentImg].classList.add("active");
}

var timer = setInterval(function () {
  changeSlide(currentImg + 1);
}, interval);

function setSlide(n) {
  clearInterval(timer);
  changeSlide(n);
  timer = setInterval(function () {
    changeSlide(currentImg + 1);
  }, interval);
}

// Example: setSlide(2); // Set the slide to index 2
