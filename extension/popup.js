// popup.js
const backendBaseUrl = "http://localhost:8000";

function getRedditUrl(tab) {
  const url = tab.url;
  return url.includes("reddit.com") ? url : null;
}

function showAnalysis(text) {
  document.getElementById("status").textContent = "Analysis complete:";
  document.getElementById("result").textContent = text;
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const redditUrl = getRedditUrl(tabs[0]);

  if (!redditUrl) {
    document.getElementById("status").textContent =
      "Not a Reddit thread. Open one and try again.";
    return;
  }

  fetch(`${backendBaseUrl}/analyze?url=${encodeURIComponent(redditUrl)}`)
    .then((res) => res.json())
    .then((data) => {
      showAnalysis(data.gemini_analysis || "No analysis returned.");
    })
    .catch((err) => {
      document.getElementById("status").textContent = "Error fetching analysis.";
      console.error(err);
    });
});

