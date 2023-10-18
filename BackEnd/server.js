require("dotenv").config();

// constants
const PORT = 5000;

// attah globals
global.throwError = (msg) => {
  throw { success: false, msg };
};

async function main() {
  const app = require("./app.js");
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}

(async (callback) => {
  await require("./db.js").connectToDB();
  await callback();
})(main);
