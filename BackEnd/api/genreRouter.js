const express = require("express");
const router = express.Router();

const db = require("../db.js").getDatabaseInstance();

// get all available genres
router.get("/", async (req, res, next) => {
  let result = (await db.query("SELECT label FROM genre"))[0].map(
    (tuple) => tuple.label
  );
  res.json({ success: true, data: result });
});

module.exports = router;
