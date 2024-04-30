require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const cors = require("cors");

const { MONGODB_URI } = process.env;
console.log("MONGODB_URI:", MONGODB_URI); // Check if MONGODB_URI is correctly loaded

const app = express();
app.use(cors());
app.use(express.json());
app.use("/user", userRouter);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((error) => {
    console.error("Failed to connect to db:", error.message);
  });

app.listen(3000, () => {
  console.log("Listening at port 3000");
});
