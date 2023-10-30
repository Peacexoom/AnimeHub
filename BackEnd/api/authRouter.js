const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const router = express.Router();

const { sendMail } = require("../emailService.js");
const { getDatabaseInstance } = require("../db.js");
const db = getDatabaseInstance();
const SALT_ROUNDS = 10;

// signup api
router.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const emailToken = crypto.randomBytes(64).toString("hex");
    const hashToken = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    console.log("Hash: ", hashToken);
    const sql =
      "INSERT INTO user(name,email,password_hash,created_at,is_admin,is_verified,emailToken) VALUES (?,?,?,curdate(),0,0,?)";
    const values = [req.body.name, req.body.email, hashToken, emailToken];
    const [result] = await db.query(sql, values, (err, data) => {
      if (err) {
        return res.json(err);
      }
      return res.json(data);
    });
    if (process.env.EMAIL_VERIFICATION_ENABLED === "true") {
      sendMail(req.body.name, req.body.email, emailToken);
    }
    return res.json({ success: true, msg: `${req.body.name} added` });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.json({ success: false, msg: "User already exists" });
    } else {
      next(err);
    }
  }
});

//verify user api
router.get("/verify/:token", async (req, res) => {
  console.log(req.params);
  const { token } = req.params;
  try {
    const sql =
      "SELECT user_id,`name`,email,created_at,is_verified,emailToken FROM user WHERE emailToken = ?";
    let data = (await db.query(sql, [token]))[0];
    if (data.length) {
      console.log(data);
      const userId = data[0].user_id;
      const updateSql = "UPDATE user SET is_verified = 1 WHERE user_id = ?";
      await db.query(updateSql, [userId]);

      // Redirect to the login page (adjust the URL as needed)
      return res.redirect(`${process.env.FRONTEND}/login`);
    } else throw "Invalid token";
  } catch (error) {
    next(error);
  }
});

// login api
router.post(
  "/login",
  [
    check("email", "Email length error")
      .isEmail()
      .isLength({ min: 10, max: 30 }),
    check("password", "password length 8-10").isLength({ min: 8 }),
  ],
  async (req, res, next) => {
    console.log(req.body);
    try {
      const sql =
        "SELECT user_id, `name`, email, password_hash, created_at, is_verified FROM user WHERE email = ?";
      const [data] = await db.query(sql, [req.body.email]);

      if (data.length > 0) {
        const user = data[0];

        // Compare the provided password with the stored hash
        const valid = await bcrypt.compare(
          req.body.password,
          user.password_hash
        );

        if (valid) {
          if (
            user.is_verified ||
            process.env.EMAIL_VERIFICATION_ENABLED === "false"
          ) {
            return res.json({ success: true, data: user });
          } else {
            return res.json({
              success: false,
              msg: "Please verify your email before logging in.",
            });
          }
        } else throw "Invalid password";
      } else {
        throw "Invalid Credentials";
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
