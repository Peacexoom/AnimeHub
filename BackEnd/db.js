const mysql = require("mysql2/promise");

let db;

exports.connectToDB = async () => {
  const connParam = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
  db = await mysql.createConnection(connParam);
  console.log("Connected to DB");
};

exports.getDatabaseInstance = () => {
  return db;
};

exports.idExists = async (db, tableName, ID_key, ID) => {
  try {
    let queryString = `SELECT ${ID_key} FROM ${tableName} WHERE ${ID_key} = ?`;
    let result = (await db.query(queryString, [parseInt(ID)]))[0];
    return result ? true : false;
  } catch (err) {
    throw err;
  }
};

exports.closeConnection = async () => {
  await db.end();
  console.log("DB Connection Closed");
}
