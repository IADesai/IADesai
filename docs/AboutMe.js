var slider = document.querySelector(".slider");
var imgs = document.querySelectorAll(".slider img");
var dots = document.querySelectorAll(".dot");
var currentImg = 0;
var interval = 8000;
var timer = null;
var touchStartX = 0;

function changeSlide(n) {
  if (!imgs.length) return;
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].style.opacity = 0;
    if (dots[i]) dots[i].classList.remove("active");
  }
  currentImg = (n + imgs.length) % imgs.length;
  imgs[currentImg].style.opacity = 1;
  if (dots[currentImg]) dots[currentImg].classList.add("active");
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(function () {
    changeSlide(currentImg + 1);
  }, interval);
}

function setSlide(n) {
  changeSlide(n);
  startTimer();
}

function handleSwipeEnd(endX) {
  var swipeThreshold = 50;
  if (endX < touchStartX - swipeThreshold) {
    setSlide(currentImg + 1);
  } else if (endX > touchStartX + swipeThreshold) {
    setSlide(currentImg - 1);
  }
}

if (slider) {
  changeSlide(0);
  startTimer();

  // Passive listeners: horizontal swipes change slides, vertical scrolling stays native
  slider.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  slider.addEventListener(
    "touchend",
    function (e) {
      handleSwipeEnd(e.changedTouches[0].clientX);
    },
    { passive: true }
  );

  slider.addEventListener("mousedown", function (e) {
    touchStartX = e.clientX;
  });
  slider.addEventListener("mouseup", function (e) {
    handleSwipeEnd(e.clientX);
  });
}
