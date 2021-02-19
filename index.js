const { initDB } = require("./db");
require("dotenv").config()
require("./expressStuff/expressMain");
initDB();
// LOGIN GOOGLE
// require("./service/passport");
require("./socket/socketMain");