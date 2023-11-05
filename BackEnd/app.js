const express = require("express");
const app = express();


const option={
  origin:'http://172.16.0.4:5173'
}

app.use(require("cors")(option));
// requset logger
app.use(require("./middlewares/requestLogger.js"));
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("HELLO");
});

app.use(require("./middlewares/urlLogger.js"));
app.use("/", require("./api/authRouter.js"));
app.use("/anime", require("./api/animeRouter.js"));
app.use("/genres", require("./api/genreRouter.js"));
app.use("/user", require("./api/userRouter.js"));

// generic error handler
app.use(require("./middlewares/errorHandler.js"));

module.exports = app;
