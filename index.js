const { initDB } = require("./db");
require("dotenv").config()
require("./expressStuff/expressMain");
initDB();
require("./socket/socketMain");