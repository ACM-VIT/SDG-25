const { z } = require("zod");

exports.noteSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title must be at least 3 characters long"), // Changed min length to 1 to allow short titles
  content: z
    .string({ required_error: "Content is required" })
    .min(1, "Content must be at least 5 characters long"), // Changed min length to 1 to allow short content
  createdBy: z
    .string({ required_error: "CreatedBy is required" }) // Added createdBy field validation
    .min(1, "Invalid name"),
});
