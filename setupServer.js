// setup io
// const passport = require("passport");
const express = require("express");
// const googleAPI = require("./router/googleAPI");
const app = express();
// app.use(passport.initialize());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// app.use("/", googleAPI);

const expressServer = app.listen(5000 || process.env.PORT, "0.0.0.0", () => {
    console.log(`Running on PORT: ${process.env.PORT}................`);
});
const socketIO = require("socket.io");
const io = socketIO(expressServer, { cors: { origin: "*" } });
// more setup
const helmet = require("helmet");
app.use(helmet());


module.exports = {
    app,
    io
};