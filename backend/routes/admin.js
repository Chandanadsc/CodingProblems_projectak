const express = require("express");
const CodingProblem = require("../db/codingproblem");
const router = express.Router();

router.use(express.json());

router.post("/addProblem", async (req, res) => {
  const { title, link, difficulty } = req.body;
  if (title && link && difficulty) {
    try {
      const existingProblem = await CodingProblem.findOne({ link });
      if (existingProblem) {
        return res.json({
          message: "This problem already exists in the database",
        });
      } else {
        const newProblem = new CodingProblem({ title, link, difficulty });
        await newProblem.save();
        return res.status(200).json({
          message: "New coding problem successfully added to the database",
        });
      }
    } catch (error) {
      console.error("Error adding problem:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({
      message: "All three fields (title, link, and difficulty) are required",
    });
  }
});

router.delete("/removeProblem", async (req, res) => {
  try {
    const { title, link } = req.body;
    console.log(title || link);
    if (title || link) {
      const deletedProblem = await CodingProblem.findOneAndDelete({
        $or: [{ title: title }, { link: link }],
      });

      if (!deletedProblem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      res.status(200).json({ message: "Problem removed successfully" });
    } else {
      return res.json({
        message:
          "either problem link or title of the coding problem is required",
      });
    }
  } catch (error) {
    console.error("Error removing problem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
