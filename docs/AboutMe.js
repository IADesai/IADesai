var slider = document.querySelector(".slider");
var imgs = document.querySelectorAll(".slider img");
var dots = document.querySelectorAll(".dot");
var currentImg = 0;
const interval = 8000;
var touchStartX = 0;
var touchEndX = 0;

function changeSlide(n) {
  for (var i = 0; i < imgs.length; i++) {
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

slider.addEventListener("mousedown", handleTouchStart);
slider.addEventListener("touchstart", handleTouchStart);

slider.addEventListener("mousemove", handleTouchMove);
slider.addEventListener("touchmove", handleTouchMove);

slider.addEventListener("mouseup", handleTouchEnd);
slider.addEventListener("touchend", handleTouchEnd);

function handleTouchStart(e) {
  if (e.type === "touchstart") {
    touchStartX = e.touches[0].clientX;
  } else {
    touchStartX = e.clientX;
  }
}

function handleTouchMove(e) {
  e.preventDefault();
}

function handleTouchEnd(e) {
  if (e.type === "touchend") {
    touchEndX = e.changedTouches[0].clientX;
  } else {
    touchEndX = e.clientX;
  }

  var swipeThreshold = 50; // Adjust this value to control the sensitivity of the swipe

  if (touchEndX < touchStartX - swipeThreshold) {
    setSlide(currentImg + 1);
  } else if (touchEndX > touchStartX + swipeThreshold) {
    setSlide(currentImg - 1);
  }
}
