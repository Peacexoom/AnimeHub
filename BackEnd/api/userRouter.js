const express = require("express");
const router = express.Router();

const { idExists, getDatabaseInstance } = require("../db.js");
const db = getDatabaseInstance();

// get user details
router.get("/:user_id", async (req, res) => {
  let { user_id } = req.params;
  let [result] = await db.query(
    "SELECT user_id,`name`,email,created_at FROM `user` WHERE user_id = ?",
    [user_id]
  );

  if (result) return res.json({ success: true, data: result });
  else return res.status(404).json({ success: false, msg: "User not found" });
});

// read user watchlist
router.get("/:user_id/list", async (req, res, next) => {
  let { user_id } = req.params;
  try {
    let [result] = await db.query(
      "SELECT list_item.`type` AS `status`, list_item.anime_id AS anime_id, list_item.anime_id AS is_added, title, alt_title, img_link, num_episodes, rating, anime.`type`, `status`, season, score, `rank`, list_item.`type` AS list_type FROM list_item INNER JOIN anime ON list_item.anime_id=anime.anime_id WHERE list_item.user_id=?",
      [user_id]
    );

    if (result) {
      return res.json({ success: true, data: result });
    } else {
      throw {
        success: false,
        msg: "Error in fetching data from the database.",
      };
    }
  } catch (err) {
    err.route = req.route;
    next(err);
  }
});

// add anime to watchlist
router.post("/:user_id/list/add", async (req, res, next) => {
  try {
    let { user_id } = req.params;
    let { item_status, anime_id } = req.body;
    const status_enum = [
      "CURRENT",
      "COMPLETED",
      "ON_HOLD",
      "DROPPED",
      "PLAN_TO_WATCH",
    ];
    item_status = item_status?.toUpperCase() || status_enum[0];

    if (!status_enum.includes(item_status))
      throwError("Invalid anime watchlist status");
    if (!anime_id) throwError("anime_id not provided");
    if (!(await idExists(db, "user", "user_id", user_id)))
      throwError("User does not exist");
    if (!(await idExists(db, "anime", "anime_id", anime_id)))
      throwError("Anime does not exists");

    await db.query("INSERT INTO list_item VALUE (?,?,?)", [
      user_id,
      item_status,
      anime_id,
    ]);

    return res.json({ success: true });
  } catch (err) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        return res.json({
          success: false,
          msg: "Anime already exists in watchlist",
        });
        break;
      case "ER_NO_REFERENCED_ROW_2":
        return res.json({ success: false, msg: "Anime does not exist" });
        break;
    }
    next(err);
  }
});

// update anime status in watchlist
router.post("/:user_id/list/update", async (req, res, next) => {
  try {
    const status_enum = [
      "CURRENT",
      "COMPLETED",
      "ON_HOLD",
      "DROPPED",
      "PLAN_TO_WATCH",
    ];
    let { user_id } = req.params;
    let { item_status, anime_id } = req.body;
    item_status = item_status.toUpperCase();

    if (!item_status) throwError("Anime watchlist status not provided");
    if (!status_enum.includes(item_status))
      throwError("Invalid anime watchlist status");
    if (!anime_id) throwError("anime_id not provided");
    if (!(await idExists(db, "user", "user_id", user_id)))
      throwError("User does not exist");
    if (!(await idExists(db, "anime", "anime_id", anime_id)))
      throwError("Anime does not exists");
    if (
      !(
        await db.query(
          "SELECT * FROM list_item WHERE anime_id=? AND user_id=?",
          [anime_id, user_id]
        )
      )[0].length
    )
      throwError("Anime is not added to watchlist");

    await db.query(
      "UPDATE list_item SET `type`= ? WHERE user_id = ? AND anime_id = ? ",
      [item_status, user_id, anime_id]
    );

    return res.json({ success: true });
  } catch (err) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        return res.json({
          success: false,
          msg: "Anime already exists in watchlist",
        });
        break;
      case "ER_NO_REFERENCED_ROW_2":
        return res.json({ success: false, msg: "Anime does not exist" });
        break;
    }
    next(err);
  }
});

// delete anime from watchlist
router.delete("/:user_id/list/:anime_id/delete", async (req, res, next) => {
  try {
    let { user_id, anime_id } = req.params;

    if (!anime_id) throwError("anime_id not provided");
    if (!(await idExists(db, "user", "user_id", user_id)))
      throwError("User does not exist");
    if (!(await idExists(db, "anime", "anime_id", anime_id)))
      throwError("Anime does not exists");
    if (
      !(
        await db.query(
          "SELECT * FROM list_item WHERE anime_id=? AND user_id=?",
          [anime_id, user_id]
        )
      )[0].length
    )
      throwError("Anime is not added to watchlist");

    await db.query(
      "DELETE FROM list_item WHERE user_id = ? AND anime_id = ? ",
      [user_id, anime_id]
    );

    return res.json({ success: true });
  } catch (err) {
    switch (err.code) {
      case "ER_DUP_ENTRY":
        return res.json({
          success: false,
          msg: "Anime already exists in watchlist",
        });
        break;
      case "ER_NO_REFERENCED_ROW_2":
        return res.json({ success: false, msg: "Anime does not exist" });
        break;
    }
    next(err);
  }
});

//check which animes are in my watchlist
router.get("/:user_id/list/check/:anime_id", (req, res) => {
  const { user_id, anime_id } = req.params;

  const query =
    "SELECT COUNT(*) AS count FROM list_item WHERE user_id = ? AND anime_id = ?";
  db.query(query, [user_id, anime_id], (error, results) => {
    if (error) {
      console.error("Error checking bookmark:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const isBookmarked = results[0].count > 0;
    res.json({ isBookmarked });
  });
});

module.exports = router;
