// loading.js
document.addEventListener("DOMContentLoaded", () => {
  // Start loading bar at 30% on DOMContentLoaded
  document.getElementById("loading-progress").style.width = "30%";
});

window.addEventListener("load", () => {
  const minDisplayTime = 1000; // Minimum display time for loading screen in milliseconds (e.g., 2 seconds)
  const startTime = performance.now(); // Capture the time when loading started

  // Transition the loading bar to 100%
  document.getElementById("loading-progress").style.width = "100%";

  // Calculate remaining time to meet the minimum display time
  const elapsed = performance.now() - startTime;
  const remainingTime = Math.max(0, minDisplayTime - elapsed);

  // Wait for remaining time, then fade out
  setTimeout(() => {
    document.getElementById("loading-screen").style.opacity = "0"; // Trigger fade-out

    // After fade-out, set display to none
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
    }, 500); // Match this with the CSS opacity transition duration (0.5s)
  }, remainingTime); // Delay to ensure minimum display time
});
