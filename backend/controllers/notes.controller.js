const { successResponse, errorResponse } = require("../utils/response");
const {
  handleMultipleFileUpload,
  createNoteWithAttachment,
} = require("../services/notes.service");
const { asyncHandler } = require("../utils/asyncHandler");

exports.createNote = asyncHandler(async (req, res) => {
  // File + body handled together
  const fileMetadataArray = handleMultipleFileUpload(req);
  const noteData = {
    title: req.body.title,
    content: req.body.content,
    createdBy: req.body.createdBy,
  };

  // const savedNote = await createNoteWithAttachment(noteData, fileMetadataArray);
  const savedNote = {
    ...noteData,
    attachments: fileMetadataArray,
    _id: "mock-id-123",
    uploadedAt: new Date(),
  }; //remove this(23-28) line when implementing actual DB save
  console.log("Saved Note:", savedNote);
  return successResponse(
    res,
    savedNote,
    "Note created successfully with attachment"
  );
});
