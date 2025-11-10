require("dotenv").config();
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const { createNote } = require("../controllers/notes.controller");
const { validateBody } = require("../middleware/notes.validate");
const { noteSchema } = require("../validators/notes.validator");
// Create note with file
router.post(
  "/create",
  upload.array("file", 5),
  validateBody(noteSchema),
  createNote
);
//same logic as above
router.post(
  "/upload/note",
  upload.array("file", 5),
  validateBody(noteSchema),
  createNote
);
module.exports = router;
