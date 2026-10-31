(() => {
  "use strict";

  const defaults = {
    dashboardButtons: true,
    articleCloneButton: true,
  };
  const dashboardCheckbox = document.getElementById("dashboard-buttons");
  const articleCheckbox = document.getElementById("article-clone-button");

  chrome.storage.sync.get(defaults, (settings) => {
    dashboardCheckbox.checked = settings.dashboardButtons !== false;
    articleCheckbox.checked = settings.articleCloneButton !== false;
  });

  dashboardCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ dashboardButtons: dashboardCheckbox.checked });
  });

  articleCheckbox.addEventListener("change", () => {
    chrome.storage.sync.set({ articleCloneButton: articleCheckbox.checked });
  });
})();