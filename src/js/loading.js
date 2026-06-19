export function finishLoading(onFinished = null) {
  const loadingScreen = document.getElementById("loadingScreen");
  const app = document.getElementById("app");
  const loadingText = document.getElementById("loadingText");
  const loadingProgress = document.getElementById("loadingProgress");

  if (!loadingScreen || !app || !loadingText || !loadingProgress) {
    if (onFinished) {
      onFinished();
    }

    return;
  }

  let progress = 0;

  const interval = setInterval(function () {
    progress++;

    loadingProgress.style.width = `${progress}%`;

    if (progress === 50) {
      loadingText.textContent = "loading moisture framework...";
    }

    if (progress === 100) {
      loadingText.textContent = "enterprise amphibian systems online.";

      clearInterval(interval);

      setTimeout(function () {
        loadingScreen.classList.add("hidden");
        app.classList.remove("hidden");

        if (onFinished) {
          onFinished();
        }
      }, 800);
    }
  }, 25);
}
