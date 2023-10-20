const express = require("express");
const router = express.Router();

const { idExists, getDatabaseInstance } = require("../db.js");
const db = getDatabaseInstance();
let genres = [];

// get anime section wise
router.get("/:section/:limit", async (req, res, next) => {
  try {
    let { user_id } = req.headers;
    if (!user_id) throwError("No user_id received.");
    if (!(await idExists(db, "user", "user_id", user_id)))
      throwError("User does not exist");

    let { section, limit } = req.params;
    let { offset } = req.query;
    limit = parseInt(limit);
    offset = offset ? parseInt(offset) : 20;
    if (
      ["popular", "ongoing", "newest", "top_rated", "movies"].includes(section)
    ) {
      let result;
      switch (section) {
        case "popular":
          [result] = await db.query(
            "SELECT anime.*,watchlist.anime_id AS is_added FROM anime LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON anime.anime_id = watchlist.anime_id ORDER BY `popularity` limit ?,?",
            [user_id, offset, limit]
          );
          break;
        case "ongoing":
          [result] = await db.query(
            "SELECT anime.*, watchlist.anime_id AS is_added FROM anime LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON anime.anime_id = watchlist.anime_id WHERE status='CURRENTLY_AIRING' AND `type`='TV' ORDER BY `rank` limit ?,?",
            [user_id, offset, limit]
          );
          break;
        case "newest":
          [result] = await db.query(
            "SELECT anime.*, watchlist.anime_id AS is_added FROM anime LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON anime.anime_id = watchlist.anime_id WHERE start_date IS NOT NULL AND `type`='TV' AND source='MANGA' ORDER BY anime.start_date desc limit ?,?",
            [user_id, offset, limit]
          );
          break;
        case "top_rated":
          [result] = await db.query(
            "SELECT anime.*, watchlist.anime_id AS is_added FROM anime LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON anime.anime_id = watchlist.anime_id ORDER BY `rank` limit ?,?",
            [user_id, offset, limit]
          );
          break;
        case "movies":
          [result] = await db.query(
            "SELECT anime.*, watchlist.anime_id AS is_added FROM anime LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON anime.anime_id = watchlist.anime_id WHERE `type`='MOVIE' ORDER BY `popularity` limit ?,?",
            [user_id, offset, limit]
          );
          break;
      }
      return res.json({ success: true, data: result });
    } else {
      return res
        .status(404)
        .send({ success: false, msg: "Error! Unknown section requested" });
    }
  } catch (err) {
    next(err);
  }
});

// get anime list by filters
router.get("/filter", async (req, res, next) => {
  try {
    let { user_id } = req.headers;
    let { genre, limit, offset } = req.query;
    limit = limit ? parseInt(limit) : 20;
    offset = offset ? parseInt(offset) : 0;
    genre = genre.toUpperCase();

    if (!user_id) throwError("No user_id received.");
    if (!(await idExists(db, "user", "user_id", user_id)))
      throwError("User does not exist");

    if (genres.length === 0) {
      genres = (await db.query("SELECT label from genre"))[0].map((tuple) =>
        tuple.label.toUpperCase()
      );
    }
    if (
      !genres.includes(genre.replace("_", " ").toUpperCase()) &&
      genre != "ALL"
    ) {
      return res.json({ success: false, msg: "Invalid genre" });
    } else {
      genreString = `label=${genre.toUpperCase()}`;
    }
    let data = [];
    if (genre == "ALL") {
      data = (
        await db.query(
          "SELECT anime.* FROM anime ORDER BY `popularity` limit ?,?",
          [offset, limit]
        )
      )[0];
    } else {
      data = (
        await db.query(
          "SELECT genre_filter.*,watchlist.anime_id AS is_added FROM (SELECT anime.* FROM anime INNER JOIN (SELECT * FROM anime_genre WHERE label=?) AS anime_genre ON anime.anime_id=anime_genre.anime_id ORDER BY `popularity` limit ?,?) AS genre_filter LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON genre_filter.anime_id = watchlist.anime_id",
          [genre, offset, limit, user_id]
        )
      )[0];
    }
    return res.json({ success: true, data });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// get results of a search query
router.get("/search", async (req, res, next) => {
  try {
    let { user_id } = req.headers;
    if (!user_id) throwError("No user_id received.");
    if (!(await idExists(db, "user", "user_id", user_id)))
      throwError("User does not exist");

    console.log(req.query);
    let { search_query, limit, offset } = req.query;
    limit = limit ? parseInt(limit) : 10;
    offset = offset ? parseInt(offset) : 0;
    console.log(limit, offset);
    if (search_query && search_query != "") {
      let result = (
        await db.query(
          "SELECT anime.*,watchlist.anime_id AS is_added FROM anime LEFT JOIN (SELECT anime_id FROM list_item WHERE user_id = ?) AS watchlist ON anime.anime_id = watchlist.anime_id WHERE MATCH(title,alt_title) AGAINST (? IN NATURAL LANGUAGE MODE) ORDER BY `rank` limit ?,?",
          [user_id, search_query, offset, limit]
        )
      )[0];
      res.json({ success: true, data: result });
    } else {
      throwError("Invalid query");
    }
  } catch (err) {
    next(err);
  }
});

// get anime details
router.get("/:anime_id", async (req, res, next) => {
  let { anime_id } = req.params;
  anime_id = parseInt(anime_id);
  try {
    let anime = (
      await db.query("SELECT * FROM anime WHERE anime_id=?", [anime_id])
    )[0][0];
    let genres = (
      await db.query("SELECT label FROM anime_genre WHERE anime_id = ?", [
        anime_id,
      ])
    )[0].map((tuple) => tuple.label);
    let characters = (
      await db.query(
        "SELECT * FROM anime_character_junction INNER JOIN `character` ON anime_character_junction.character_id=`character`.character_id WHERE anime_character_junction.anime_id=?",
        [anime_id]
      )
    )[0];

    if (anime) {
      anime.genres = genres;
      anime.characters = characters;
      return res.json({ success: true, data: anime });
    } else throw { msg: "No anime found" };
  } catch (err) {
    next(err);
  }
});

module.exports = router;
