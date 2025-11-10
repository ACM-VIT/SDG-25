const { errorResponse } = require("../utils/response");

exports.validateBody = (schema) => (req, res, next) => {
  try {
    console.log("Incoming body before validation:", req.body);

    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }

    const data = {
      title: req.body.title || "",
      content: req.body.content || "",
      createdBy: req.body.createdBy || "",
    };

    const parsed = schema.parse(data);
    console.log("Zod Validation Success", parsed);
    next();
  } catch (error) {
    console.error("Zod Validation Error Details:", error);
    return res.status(400).json({
      message: "Invalid input",
      errors: error.errors || [],
    });
  }
};
