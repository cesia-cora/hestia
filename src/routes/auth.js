const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const connection = require("../models/connection");
const UserModel = require("../models/UserModel");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res) => {
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    req.body.username,
    (error, results) => {
      if (error) {
        throw error;
      }

      if (!results.length) {
        res.send("Incorrect username or password");
      }
      else {
        const user = results.shift();
        if (!bcryptjs.compareSync(req.body.password, user.password)) {
          res.send("Incorrect username or password");
        }
        else {
          req.session.userId = user.id;
          req.session.username = user.username;

          res.redirect("/login");
        }
      }
    }
  );
});

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  const hash = await bcryptjs.hash(req.body.password, 8);
  connection.query(
    "INSERT INTO users SET ?",
    {
      ...req.body,
      password: hash,
    },
    (error, results) => {
      if (error) {
        throw error;
      }

      res.redirect("/");
    }
  );
});

router.get("/logout", (req, res) => {
  // req.session.destroy(() => {
  //   res.redirect("/");
  // });
  req.session = null;
  res.redirect('/');
});

router.get("/forgot-password", (req, res) => {
  res.render("auth/forgot");
});

router.post("/forgot-password", async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { username: req.body.username },
    });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    await UserModel.update(
      { resetPasswordToken: resetToken },
      { where: { id: user.id } }
    );

    const resetUrl = `${process.env.APP_URL || ('http://' + req.headers.host)}/reset/${resetToken}`;

    let transporter;
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@example.com',
      to: user.email,
      subject: 'Password reset',
      text: `To reset your password go to: ${resetUrl}`,
      html: `<p>Select <a href="${resetUrl}">this</a> to reset your password.</p>`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      if (!process.env.SMTP_USER) {
        console.log("Ethereal preview URL:", nodemailer.getTestMessageUrl(info));
      }
    } catch (mailErr) {
      console.error("Mail error:", mailErr);
    }

    res.send("An email has been sent to reset the password.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error has occured.");
  }
});

router.get("/reset-password/:token", async (req, res) => {
  const user = await UserModel.findOne({
    where: { resetPasswordToken: req.params.token },
  });

  if (!user) {
    return res.status(404).send("Invalid or expired token");
  }

  res.render("auth/reset-password", { token: req.params.token });
});

router.post("/reset-password/:token", async (req, res) => {
  const user = await UserModel.findOne({
    where: { resetPasswordToken: req.params.token },
  });
  if (!user) {
    return res.status(404).send("Invalid or expired token");
  }

  const hash = await bcryptjs.hash(req.body.password, 8);
  await UserModel.update(
    { password: hash, resetPasswordToken: null },
    { where: { id: user.id } }
  );

  res.send("Password reset successful");
});

module.exports = router;