const express = require("express");
const router = express.Router();
const passport = require("passport");

//----------GOOGLE---------//
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    }
);

module.exports = router;