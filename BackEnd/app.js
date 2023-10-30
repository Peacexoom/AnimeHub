const express = require("express");
const app = express();

app.use(require("cors")());
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

//Handle unhandled routes
app.all('*', (req,res,next)=>{
  next(`${req.originalUrl} route not found`)
})

// generic error handler
app.use(require("./middlewares/errorHandler.js"));

module.exports = app;
