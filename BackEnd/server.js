const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());

const connectToDB = async () => {
    let db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "Solanki@11",
        connectionLimit: 10000,
        database: "anime_hub",
    });
    console.log('Connected to DB');
    return db;
};

connectToDB();

app.post("/signup", (req, res) => {
    const sql = "INSERT INTO user(name,email,password_hash,created_at,is_admin) VALUES (?,?,?,curdate(),0)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    });
});

app.post(
    "/login",
    [
        check("email", "Email length error").isEmail().isLength({ min: 10, max: 30 }),
        check("password", "password length 8-10").isLength({ min: 8 }),
    ],
    (req, res) => {
        console.log(req.body);
        const sql = "SELECT * FROM user WHERE email = ? AND password_hash = ?";
        console.log(req.body.email, req.body.password);
        db.query(sql, [req.body.email, req.body.password], (err, data) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.json(errors);
            } else {
                if (err) {
                    return res.json("Error");
                }
                if (data.length > 0) {
                    return res.json("Success");
                } else {
                    return res.json("Failed");
                }
            }
        });
    }
);

app.get("anime/:anime_id", async (req, res) => {
    let { anime_id } = req.params;
    try {
        let anime = (await db.query("SELECT * FROM anime WHERE anime_id=?", [anime_id]))[0];
        let genres = (await db.query("SELECT genre FROM anime_genre WHERE anime_id = ?", [anime_id]))[0].map(
            (tuple) => tuple.genre
        );
        let characters = await db.query("SELECT * FROM ");
    } catch (err) {}
});

app.get("/anime/:section/:limit", async (req, res) => {
    let { section, limit } = req.params;
    if (section in ["popular", "ongoing", "newest"]) {
        let result;
        switch (section) {
            case "popular":
                [result] = await db.query("SELECT * FROM anime ORDER BY `rank` limit ?", [limit]);
            case "ongoing":
                [result] = await db.query(
                    "SELECT * FROM anime WHERE status='CURRENTLY_AIRING' ORDER BY `rank` limit ?",
                    [limit]
                );
            case "newest":
                [result] = await db.query(
                    "SELECT * FROM anime WHERE start_date NOT NULL ORDER BY start_date desc limit ?",
                    [limit]
                );
        }
        return res.json({ success: true, data: result });
    } else {
        return res.status(404).send({ success: false, msg: "Error! Unknown section requested" });
    }
});

app.get("/anime/filter", async (req, res) => {});

app.post("/user/:user_id", async (req, res) => {
    let { user_id } = req.params;
    let [result] = await db.query("SELECT * FROM `user` WHERE user_id = ?",[user_id]);

    if(result) return res.json({success:true,data:result});
    else return res.status(404).json({success:false,msg:"User not found"});
});

app.get("/user/:user_id/list", async (req,res) => {
    let {user_id} = req.params;
    let [result] = await db.query("SELECT * FROM (SELECT * FROM (SELECT * FROM `user` WHERE user_id = ?) INNER JOIN list_item ON `user`.user_id = list_item.user_id) INNER JOIN anime ON list_item.anime_id=anime.anime_id",[user_id])

})

app.use((err, req, res, next) => {
    return res.status(500).json({ success: false, error: err });
});

app.listen(port, () => {
    console.log("Server running on port", port);
});
