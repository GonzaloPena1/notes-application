const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Helper function to read/write data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading data file:", error);
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API Routes
app.get("/api/notes", (req, res) => {
  res.json(readData());
});

app.post("/api/notes", (req, res) => {
  const notes = readData();
  const newNote = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
  };
  notes.push(newNote);
  writeData(notes);
  res.status(201).json(newNote);
});

app.put("/api/notes/:id", (req, res) => {
  let notes = readData();
  const noteIndex = notes.findIndex((n) => n.id == req.params.id);
  if (noteIndex !== -1) {
    notes[noteIndex].title = req.body.title;
    notes[noteIndex].description = req.body.description;
    writeData(notes);
    res.json(notes[noteIndex]);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

app.delete("/api/notes/:id", (req, res) => {
  let notes = readData();
  const filteredNotes = notes.filter((n) => n.id != req.params.id);
  writeData(filteredNotes);
  res.json({ message: "Note deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
