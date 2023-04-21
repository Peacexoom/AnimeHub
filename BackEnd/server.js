const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "patelmoon",
    connectionLimit: 10000,
    database: "anime_hub",
});

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
app.listen(port, () => {
    console.log("Server running on port",port);
});