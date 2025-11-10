const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
  },
  { _id: false } // prevent extra _id in array
);

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { type: String, required: true }, // can hold professor’s ID/name
    uploadedAt: { type: Date, default: Date.now },
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
