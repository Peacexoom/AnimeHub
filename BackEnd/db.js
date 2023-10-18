const mysql = require("mysql2/promise");

exports.connectToDB = async () => {
  const connParam = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
  };
  const db = await mysql.createConnection(connParam);
  console.log("Connected to DB");
  return db;
};