require("dotenv").config();
const { connectToDB, closeConnection } = require('./db');

//Handling uncaught exception 
process.on('uncaughtException', err =>{
  console.log(`Error: ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  process.exit(1)
})

// constants
const PORT = 5000;

// attach globals
global.throwError = (msg) => {
  throw { success: false, msg };
};

let server;

async function main() {
    const app = require("./app.js");
    server = app.listen(PORT, () => {
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
})(main)

//Handling unhandled server errors
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`)
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
})