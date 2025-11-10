require("dotenv").config();
const path = require("path");
const express = require("express");
const notesRouter = require("./routes/notes.route");
const database = require("./connector/database.connector");
const { errorHandler } = require("./middleware/errorHandler.middleware");
const app = express();
const cors = require("cors");
const port = process.env.PORT ?? 8000;
//CORS setup
app.use(
  cors({
    origin: "http://localhost:3000", // React app
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Parse JSON bodies
app.use(express.json());

// Serve uploaded files statically (for viewing/downloading)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Notes + file-upload routes
app.use("/api/notes", notesRouter);

// Global error handler
app.use(errorHandler);
//database connection is established in database.connector.js
// database();
// Start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
