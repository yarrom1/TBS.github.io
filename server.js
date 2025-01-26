function saveResultToServer() {
  const now = new Date().toLocaleString();
  const data = {
    nickname,
    result: score,
    time: now
  };

  // Replace this with your actual Railway URL:
  fetch("https://tetris-backend.up.railway.app/api/save-result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Failed to save result");
    }
    return res.json();
  })
  .then(json => {
    console.log("Server responded:", json);
  })
  .catch(err => {
    console.error("Error sending result:", err);
  });
}
