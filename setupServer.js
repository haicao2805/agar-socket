// setup io
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(process.env.PORT || 5000, "0.0.0.0", (error) => {
    if (error) console.log(`Error: ${error}.............`);
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