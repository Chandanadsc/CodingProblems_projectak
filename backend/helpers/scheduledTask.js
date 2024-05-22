const cron = require("node-cron");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const User = require("../db/db");
const CodingProblem = require("../db/codingproblem");

mongoose.connect(
  "mongodb+srv://Chandanadsc:Chandana27072005@cluster0.utwrbxl.mongodb.net/projectak"
);

const sendCodingProblems = async () => {
  try {
    console.log("Fetching subscribed users...");
    const subscribedUsers = await User.find({ subscriptionStatus: true });
    console.log(subscribedUsers);
    console.log("Fetching coding problems...");
    const codingProblems = await CodingProblem.find().limit(3);
    console.log(codingProblems);

    if (subscribedUsers.length === 0) {
      console.log("No subscribed users found.");
      return;
    }

    if (codingProblems.length === 0) {
      console.log("No coding problems found.");
      return;
    }

    console.log("Creating transporter...");
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "2210030214@klh.edu.in",
        pass: "lnss mzel hytm nlzc",
      },
    });

    console.log("Sending emails...");
    for (const user of subscribedUsers) {
      let emailContent = "<h1>Daily Coding Problems</h1>";
      emailContent += `<p>Hi ${user.username},</p>`;
      emailContent += "<p>Here are your coding problems for today:</p>";

      for (const problem of codingProblems) {
        emailContent += `<p><a href="${problem.link}">${problem.title}</a> (${problem.tags})</p>`;
      }

      const info = await transporter.sendMail({
        from: '"smtp sample" <2210030214@klh.edu.in>',
        to: user.email,
        subject: "Daily Coding Problems",
        html: emailContent,
      });

      console.log("Message sent to", user.email, ":", info.messageId);
    }
    await CodingProblem.deleteMany({
      _id: { $in: codingProblems.map((p) => p._id) },
    });

    console.log("All emails sent successfully.");
  } catch (error) {
    console.error("Send coding problems error:", error);
  } finally {
    mongoose.disconnect();
  }
};
sendCodingProblems();
// cron.schedule("* * * * *", () => {
//   console.log("Running scheduled task...");
//
// });
