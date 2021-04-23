const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { User } = require("../../models/user.model");
// const {}=require("../../config")

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.error(
        "There was an error accessing the records of" + " user with id: " + id
      );
    
      return done(error);
    }
    return done(null, user);
  });
});

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

module.exports = passport;
