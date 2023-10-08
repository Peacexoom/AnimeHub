const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();
// const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
const port = 5000;
const app = express();
let db;
let genres = [];

function throwError(msg) {
    throw { success: false, msg };
}

async function idExists(db, tableName, ID_key, ID) {
    try {
        let queryString = `SELECT ${ID_key} FROM ${tableName} WHERE ${ID_key} = ?`;
        let result = (await db.query(queryString, [parseInt(ID)]))[0];
        return result ? true : false;
    } catch (err) {
        throw err;
    }
}

app.use(cors());
// app.use(morgan());
app.use((req, res, next) => {
    console.log(req.ip, "- ", req.url);
    next();
});
app.use(express.json());

const connectToDB = async () => {
    let connParam = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    };
    db = await mysql.createConnection(connParam);
    console.log("Connected to DB");
};

connectToDB();

app.get("/", (req, res) => {
    return res.send("HELLO");
});

app.use((req, res, next) => {
    console.log(req.url);
    next();
});

// signup api
app.post("/signup", async (req, res, next) => {
    try {
        console.log(req.body);
        const sql = "INSERT INTO user(name,email,password_hash,created_at,is_admin) VALUES (?,?,?,curdate(),0)";
        const values = [req.body.name, req.body.email, req.body.password];
        const [result] = await db.query(sql, values, (err, data) => {
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        });
        return res.json({ success: true, msg: `${req.body.name} added` });
    } catch (err) {
        if ((err.code = "ER_DUP_ENTRY")) {
            return res.json({ success: false, msg: "User already exists" });
        } else {
            next(err);
        }
    }
});

// login api
app.post(
    "/login",
    [
        check("email", "Email length error").isEmail().isLength({ min: 10, max: 30 }),
        check("password", "password length 8-10").isLength({ min: 8 }),
    ],
    async (req, res, next) => {
        console.log(req.body);
        try {
            const sql = "SELECT user_id,`name`,email,created_at FROM user WHERE email = ? AND password_hash = ?";
            let data = (await db.query(sql, [req.body.email, req.body.password]))[0];
            if (data.length) return res.json({ success: true, data: data[0] });
            else throw "Invalid Credentials";
        } catch (err) {
            next(err);
        }
    }
);

// get anime section wise
app.get("/anime/:section/:limit", async (req, res, next) => {
    try {
        let { user_id } = req.headers;
        if (!user_id) throwError("No user_id received.");
        if (!(await idExists(db, "user", "user_id", user_id))) throwError("User does not exist");

        let { section, limit } = req.params;
        let { offset } = req.query;
        limit = parseInt(limit);
        offset = offset ? parseInt(offset) : 20;
        if (["popular", "ongoing", "newest", "top_rated", "movies"].includes(section)) {
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
            return res.status(404).send({ success: false, msg: "Error! Unknown section requested" });
        }
    } catch (err) {
        next(err);
    }
});

// get anime list by filters
app.get("/anime/filter", async (req, res, next) => {
    try {
        let { user_id } = req.headers;
        let { genre, limit, offset } = req.query;
        limit = limit ? parseInt(limit) : 20;
        offset = offset ? parseInt(offset) : 0;
        genre = genre.toUpperCase();

        if (!user_id) throwError("No user_id received.");
        if (!(await idExists(db, "user", "user_id", user_id))) throwError("User does not exist");

        if (genres.length === 0) {
            genres = (await db.query("SELECT label from genre"))[0].map((tuple) => tuple.label.toUpperCase());
        }
        if (!genres.includes(genre.replace("_", " ").toUpperCase()) && genre != "ALL") {
            return res.json({ success: false, msg: "Invalid genre" });
        } else {
            genreString = `label=${genre.toUpperCase()}`;
        }
        let data = [];
        if (genre == "ALL") {
            data = (await db.query("SELECT anime.* FROM anime ORDER BY `popularity` limit ?,?", [offset, limit]))[0];
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
app.get("/anime/search", async (req, res, next) => {
    try {
        let { user_id } = req.headers;
        if (!user_id) throwError("No user_id received.");
        if (!(await idExists(db, "user", "user_id", user_id))) throwError("User does not exist");

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
app.get("/anime/:anime_id", async (req, res, next) => {
    let { anime_id } = req.params;
    anime_id = parseInt(anime_id);
    try {
        let anime = (await db.query("SELECT * FROM anime WHERE anime_id=?", [anime_id]))[0][0];
        let genres = (await db.query("SELECT label FROM anime_genre WHERE anime_id = ?", [anime_id]))[0].map(
            (tuple) => tuple.label
        );
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

// get all available genres
app.get("/genres", async (req, res, next) => {
    let result = (await db.query("SELECT label FROM genre"))[0].map((tuple) => tuple.label);
    res.json({ success: true, data: result });
});

// get user details
app.get("/user/:user_id", async (req, res) => {
    let { user_id } = req.params;
    let [result] = await db.query("SELECT user_id,`name`,email,created_at FROM `user` WHERE user_id = ?", [user_id]);

    if (result) return res.json({ success: true, data: result });
    else return res.status(404).json({ success: false, msg: "User not found" });
});

// read user watchlist
app.get("/user/:user_id/list", async (req, res, next) => {
    let { user_id } = req.params;
    try {
        let [result] = await db.query(
            "SELECT list_item.`type` AS `status`,list_item.anime_id AS anime_id,list_item.anime_id AS is_added,title,alt_title,img_link,num_episodes,rating,anime.`type`,`status`,season,score,`rank` FROM list_item INNER JOIN anime ON list_item.anime_id=anime.anime_id where list_item.user_id=?",
            [user_id]
        );
        // for (let i = 0; i < result.length; i++) {
        //     let genres = (
        //         await db.query("SELECT label FROM anime_genre WHERE anime_id=?", [result[i].anime_id])
        //     )[0].map((tuple) => tuple.label);
        //     result[i].genres = genres;
        // }
        // console.log(result);
        if (result) {
            return res.json({ success: true, data: result });
        } else {
            throw { success: false, msg: "Error in fetching data from database." };
        }
    } catch (err) {
        err.route = req.route;
        next(err);
    }
});

app.get("");

// add anime to watchlist
app.post("/user/:user_id/list/add", async (req, res, next) => {
    try {
        let { user_id } = req.params;
        let { item_status, anime_id } = req.body;
        const status_enum = ["CURRENT", "COMPLETED", "ON_HOLD", "DROPPED", "PLAN_TO_WATCH"];
        item_status = item_status?.toUpperCase() || status_enum[0];

        if (!status_enum.includes(item_status)) throwError("Invalid anime watchlist status");
        if (!anime_id) throwError("anime_id not provided");
        if (!(await idExists(db, "user", "user_id", user_id))) throwError("User does not exist");
        if (!(await idExists(db, "anime", "anime_id", anime_id))) throwError("Anime does not exists");

        await db.query("INSERT INTO list_item VALUE (?,?,?)", [user_id, item_status, anime_id]);

        return res.json({ success: true });
    } catch (err) {
        switch (err.code) {
            case "ER_DUP_ENTRY":
                return res.json({ success: false, msg: "Anime already exists in watchlist" });
                break;
            case "ER_NO_REFERENCED_ROW_2":
                return res.json({ success: false, msg: "Anime does not exist" });
                break;
        }
        next(err);
    }
});

// update anime status in watchlist
app.post("/user/:user_id/list/update", async (req, res, next) => {
    try {
        const status_enum = ["CURRENT", "COMPLETED", "ON_HOLD", "DROPPED", "PLAN_TO_WATCH"];
        let { user_id } = req.params;
        let { item_status, anime_id } = req.body;
        item_status = item_status.toUpperCase();

        if (!item_status) throwError("Anime watchlist status not provided");
        if (!status_enum.includes(item_status)) throwError("Invalid anime watchlist status");
        if (!anime_id) throwError("anime_id not provided");
        if (!(await idExists(db, "user", "user_id", user_id))) throwError("User does not exist");
        if (!(await idExists(db, "anime", "anime_id", anime_id))) throwError("Anime does not exists");
        if (!(await db.query("SELECT * FROM list_item WHERE anime_id=? AND user_id=?", [anime_id, user_id]))[0].length)
            throwError("Anime is not added to watchlist");

        await db.query("UPDATE list_item SET `type`= ? WHERE user_id = ? AND anime_id = ? ", [
            item_status,
            user_id,
            anime_id,
        ]);

        return res.json({ success: true });
    } catch (err) {
        switch (err.code) {
            case "ER_DUP_ENTRY":
                return res.json({ success: false, msg: "Anime already exists in watchlist" });
                break;
            case "ER_NO_REFERENCED_ROW_2":
                return res.json({ success: false, msg: "Anime does not exist" });
                break;
        }
        next(err);
    }
});

// delete anime from watchlist
app.delete("/user/:user_id/list/:anime_id/delete", async (req, res, next) => {
    try {
        let { user_id, anime_id } = req.params;

        if (!anime_id) throwError("anime_id not provided");
        if (!(await idExists(db, "user", "user_id", user_id))) throwError("User does not exist");
        if (!(await idExists(db, "anime", "anime_id", anime_id))) throwError("Anime does not exists");
        if (!(await db.query("SELECT * FROM list_item WHERE anime_id=? AND user_id=?", [anime_id, user_id]))[0].length)
            throwError("Anime is not added to watchlist");

        await db.query("DELETE FROM list_item WHERE user_id = ? AND anime_id = ? ", [user_id, anime_id]);

        return res.json({ success: true });
    } catch (err) {
        switch (err.code) {
            case "ER_DUP_ENTRY":
                return res.json({ success: false, msg: "Anime already exists in watchlist" });
                break;
            case "ER_NO_REFERENCED_ROW_2":
                return res.json({ success: false, msg: "Anime does not exist" });
                break;
        }
        next(err);
    }
});

// generic error handler
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ success: false, error: err });
});

app.listen(port, () => {
    console.log("Server running on port", port);
});
