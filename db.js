const mongodb = require("mongodb");

let _db;

module.exports.initDB = async function () {
    return await mongodb.connect(process.env.DATABASE_URL, { useUnifiedTopology: true }, async (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }

        _db = result.db("agar");

        return _db;
    });
}

module.exports.getDB = () => {
    if (!_db) {
        console.log("Please, init database");
        return;
    }
    return _db
}