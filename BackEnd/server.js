require("dotenv").config();

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
}

(async (callback) => {
  await require("./db.js").connectToDB();
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