(() => {
  "use strict";

  const defaults = {
    dashboardButtons: true,
    articleCloneButton: true,
  };
  const publish = (settings) => {
    document.dispatchEvent(
      new CustomEvent("lbcpro:settings", {
        detail: JSON.stringify(settings),
      }),
    );
  };

  chrome.storage.sync.get(defaults, publish);
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (
      areaName === "sync" &&
      (changes.dashboardButtons || changes.articleCloneButton)
    ) {
      chrome.storage.sync.get(defaults, publish);
    }
  });
})();