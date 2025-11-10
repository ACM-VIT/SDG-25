const path = require("path");
const Note = require("../models/notes.model");
exports.handleMultipleFileUpload = (req) => {
  if (!req.files || req.files.length === 0) {
    const error = new Error("No file uploaded");
    error.statusCode = 400;
    throw error;
  }

  return req.files.map((file) => ({
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
  }));
};

exports.createNoteWithAttachment = async (noteData, fileMetadataArray) => {
  const note = new Note({
    title: noteData.title,
    content: noteData.content,
    createdBy: noteData.createdBy,
    attachments: fileMetadataArray,
    uploadedAt: new Date(),
  });

  return await note.save();
};
