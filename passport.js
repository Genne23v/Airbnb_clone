const LocalStrategy = require("passport-local").Strategy,
  mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  User = require("./models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ email: "email" }, (email, password, done) => {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            console.log("Email not registered");
            return done(null, false, { message: "Email is not registered" });
          }
          bcrypt.compare(password, user.password, (err, match) => {
            if (err) throw err;

            if (match) {
              console.log("User login success");
              return done(null, user);
            } else {
              console.log("Password not matched");
              return done(null, false, { message: "Password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );
};
