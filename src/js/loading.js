function finishLoading() {
  const loadingScreen = document.getElementById("loadingScreen");
  const app = document.getElementById("app");
  const loadingText = document.getElementById("loadingText");
  const loadingProgress = document.getElementById("loadingProgress");

  let progress = 0;

  const interval = setInterval(function () {
    progress++;

    loadingProgress.style.width = `${progress}%`;

    if (progress >= 50) {
      loadingText.textContent =
        "loading moisture framework...";
    }

    if (progress >= 100) {
      loadingText.textContent =
        "enterprise amphibian systems online.";

      clearInterval(interval);

      setTimeout(function () {
        loadingScreen.classList.add("hidden");
        app.classList.remove("hidden");
      }, 800);
    }
  }, 25);
}