const mongoose = require("mongoose");

const CodingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  tags: {
    type: [String],
    required: true,
  },
});

const CodingProblem = mongoose.model("CodingProblem", CodingProblemSchema);

module.exports = CodingProblem;
