const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { getDB } = require("../db");

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile, cb) {
            const data = {
                id: profile.id,
                name: profile.displayName,
                email: profile._json.email

            }
            await getDB().collection("googlePlayer").insertOne(data);
            cb(null, data);
            //   const db = getDB().collection("user");
            //   const user = await db.findOne({ googleId: profile.id });
            //   if (!user) cb("error", null);
            //   cb(null, user);
        }
    )
);
