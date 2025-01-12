document.getElementById("start").addEventListener("click", () => {
  const startButton = document.getElementById("start");

  // Desable the button to avoid multiple clicks
  startButton.disabled = true;
  startButton.innerText = "Exporting...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

    // Reload the page before executing the script
    chrome.tabs.reload(tab.id, {}, () => {
      setTimeout(() => { // Wait to the page to reload
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        }).then(() => {
          console.log("Script correctly executed.");
          setTimeout(() => window.close(), 500); // Force popup to close after a short delay
        }).catch((error) => {
          console.error("Error on script execution:", error);
            setTimeout(() => window.close(), 500); // Force popup to close even with errors
        });
      }, 3000); // Time to the page to load completly
    });
  });
});
