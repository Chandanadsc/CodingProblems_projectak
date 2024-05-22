const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const CodingProblem = require("../db/codingproblem");

const router = express.Router();

router.get("/problems", async (req, res) => {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/problemset.problems?tags=implementation"
    );
    const problems = response.data.result.problems;
    const formattedProblems = problems.map((problem) => ({
      title: problem.name,
      link: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
      tags: problem.tags,
    }));
    await CodingProblem.insertMany(formattedProblems);
    res
      .status(200)
      .json({ message: "Coding problems fetched and saved successfully" });
  } catch (error) {
    console.error("Error fetching and saving coding problems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
