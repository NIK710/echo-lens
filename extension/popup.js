document.getElementById("analyze-btn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  document.getElementById("result").textContent = "Sending to backend...";

  fetch("http://localhost:8000/analyze_reddit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  })
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("result").textContent = data.summary || "Done!";
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("result").textContent = "Error analyzing thread.";
    });
});
