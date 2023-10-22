require("dotenv").config();
const { connectToDB, closeConnection } = require('./db');

// constants
const PORT = 5000;

// attah globals
global.throwError = (msg) => {
  throw { success: false, msg };
};

async function main() {
  const app = require("./app.js");
  const server = app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('SIGTERM close server');
    });
    closeConnection();
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('SIGINT close server');
    });
    closeConnection();
  });
}

(async (callback) => {
  await connectToDB();
  await callback();
})(main);
