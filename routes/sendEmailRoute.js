const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const sender = "onlinerentalservice16@gmail.com";
// const receipent = "adnan.bsse3006@iiu.edu.pk";
const password = "pakistan7863006";
router.post("/", async (req, res) => {
  const body = req.body;
  const receipent = body.receipent;
  const subject = body.subject;
  const emailMessage = body.emailMessage;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender,
      pass: password
    }
  });

  const mailOptions = {
    from: sender,
    to: receipent,
    subject: subject,
    text: emailMessage

    // html: '<h1>Hi Smartherd</h1><p>Your Messsage</p>'
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      return res.status(400).send(error);
    } else {
      // console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});
module.exports = router;
