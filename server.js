// 

const express = require("express");
const fs = require("fs");
const path = require("path");

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000; 
// Railway will set process.env.PORT automatically

app.use(express.json());

// Example endpoint: POST /api/save-result
app.post("/api/save-result", (req, res) => {
  const newResult = req.body; 
  // e.g. { nickname, result, time } from the client

  const filePath = path.join(__dirname, "1.json");

  // Read existing data
  let existingData = [];
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    try {
      existingData = JSON.parse(raw);
    } catch (err) {
      console.error("Error parsing 1.json, overwriting with fresh array");
      existingData = [];
    }
  }

  // Append new result
  existingData.push(newResult);

  // Write updated array to 1.json
  fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
    if (err) {
      console.error("Error writing 1.json:", err);
      return res.status(500).json({ error: "Failed to write file" });
    }
    // Respond
    return res.json({ message: "Result saved", data: newResult });
  });
});

// A simple GET (optional) to check if server is up
app.get("/", (req, res) => {
  res.send("Tetris backend is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});
