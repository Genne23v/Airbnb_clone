nodeMailer = require("nodemailer");
const passport = require("passport"),
  User = require("../models/user"),
  Room = require("../models/room");

const getUserParams = (body) => {
  return {
    name: {
      fname: body.fname,
      lname: body.lname,
    },
    email: body.email,
    password: body.password,
  };
};

module.exports = {
  index: (req, res, next) => {
    // console.log(`Logged In: ${req.session.loggedIn}`);
    // console.log(`User: ${req.session.user}`);
    Room.find()
      .distinct("location", (err, result) => {
        res.locals.locations = result;
      })
      .then(() => {
        if (req.session.loggedIn) {
          if (req.session.user.admin) {
            // console.log(`Admin logged in!`);
            // console.log(`req.session.newRoom in admin: ${req.session.newRoom}`);
            // //res.redirect("/admin");
            res.render("admin", {
              layout: false,
              userFname: req.session.user,
              newRoom: req.session.newRoom,
            });
          } else {
            res.render("main", {
              layout: false,
              loggedIn: req.session.loggedIn,
              userFname: req.session.user,
              locations: res.locals.locations,
            });
          }
        } else {
          res.render("main", {
            layout: false,
            locations: res.locals.locations,
          });
        }
      })
      .catch((err) => {
        console.log(
          `Error occurred while fetching room locations - ${err.message}`
        );
      });
  },

  validate: (req, res, next) => {
    const userName = req.body.fname;

    if (req.body.email.length > 0) {
      req.check("email", "Email is invalid").trim().isEmail();
    }
    req.check("email", "Email cannot be empty").notEmpty();
    req.check("fname", "First name cannot be empty").notEmpty();
    req.check("lname", "Last name cannot be empty").notEmpty();
    req.check("password", "Password cannot be empty").notEmpty();

    if (req.body.password.length > 0) {
      req.check("password", "Password must be 6 to 12 characters").isLength({
        min: 6,
        max: 12,
      });
      req
        .check(
          "password",
          "Password must contain alphabetic/numeric values only"
        )
        .matches(/^[a-zA-Z0-9]+$/);
    }

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let errMessages = error.array().map((e) => e.msg);

        res.locals.flashMessages = {
          type: "danger",
          message: errMessages,
        };
        res.json(res.locals.flashMessages);
      } else {
        res.locals.flashMessages = {
          type: "success",
          message: `Account for ${userName} has been created successfully!`,
        };
        next();
      }
    });
  },
  create: (req, res, next) => {
    //console.log(`create start`);

    let newUser = new User(getUserParams(req.body));
    User.create(newUser, (err, user) => {
      // User.register(newUser, req.body.password, (err, user) => {
      //console.log(`User: ${user}`);
      if (user) {
        res.locals.redirect = "/";
        next();
      } else {
        console.log(`Register error: ${err}`);
        res.locals.flashMessages = {
          type: "danger",
          message: `Account for ${req.body.email} already exists.`,
        };
        res.json(res.locals.flashMessages);
      }
    });
  },
  sendEmail: (req, res, next) => {
    //console.log("Sending email"); // TO BE REMOVED
    //SENDING A WELCOME EMAIL TO USER
    let transporter = nodeMailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PW,
      },
    });
    let mailOptions = {
      from: "d642f85f6d-9ae820@inbox.mailtrap.io",
      to: req.body.email,
      subject: "You have submitted a sign-up form to Airbnb",
      text: `Dear, ${req.body.fname}. You have recently submitted a registration form to Airbnb`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error" + err);
      } else {
        console.log(`Email sent to ${req.body.email} successfully.`);
      }
    });
    res.json(res.locals.flashMessages);
  },

  logInValidate: (req, res, next) => {
    console.log("Login validating");
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if (req.body.email.length > 0) {
      req.check("email", "Email is invalid").trim().isEmail();
    }
    req.check("email", "Email cannot be empty").notEmpty();
    req.check("password", "Password cannot be empty").notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let errMessages = error.array().map((e) => e.msg);
        req.skip = true;
        res.locals.flashMessages = {
          type: "danger",
          message: errMessages,
        };
        res.json(res.locals.flashMessages);
      } else {
        res.locals.currentUser = req.user;
        //console.log(`req.user: ${req.body.email}`);
        //next();

        //WORKING CODE WITHOUT PASSPORT
        //console.log("Searching for the user..."); //TO BE REMOVED
        User.findOne({ email: userEmail }, (err, user) => {
          if (!user) {
            res.locals.flashMessages = {
              type: "danger",
              message: "Email does not exist",
            };
            res.send(res.locals.flashMessages);
          } else if (err) {
            console.log("Something wrong while checking email", err);
            res.locals.flashMessages = {
              type: "danger",
              message:
                "Sorry, an error occurred during finding the user email...",
            };
            res.send(res.locals.flashMessages);
          } else {
            //console.log(`Pre-compare: ${user}`); //TO BE REMOVED

            user.comparePasswords(userPassword).then((isMatch) => {
              //console.log("Comparing passwords"); //TO BE REMOVED
              if (isMatch) {
                console.log("User login success!"); //TO BE REMOVED
                res.locals.flashMessages = {
                  type: "success",
                  message: `Welcome back, ${userEmail}!`,
                };
                req.session.user = user;
                req.session.loggedIn = true;
                //console.log(`req.session.user: ${req.session.user}`);
                //console.log(`baseUrl: ${req.baseUrl}`);
                res.send(res.locals.flashMessages);
              } else {
                console.log("Password not match"); //TO BE REMOVED
                res.locals.flashMessages = {
                  type: "danger",
                  message: "Password does not match",
                };
                res.send(res.locals.flashMessages);
              }
            });
          }
        });
      }
    });
  },

  logout: (req, res, next) => {
    req.logout();
    req.session.destroy();
    //console.log(`req.session: ${req.session}`);
    //req.session.loggedIn = false;
    //console.log(`User has been logged out on ${req.baseUrl}`);
    //console.dir(req.baseUrl);

    res.locals.redirect = "/";
    next();
  },
  redirectView: (req, res, next) => {
    //console.log(`Login status: ${res.locals.loggedIn}`);
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      //console.log(`Redirecting to ${redirectPath}`);
      res.redirect(redirectPath);
    } else next();
  },

  authenticate: (req, res, next) => {
    //console.log("Authentication started");
    const userPassword = req.body.email;

    passport.authenticate(userPassword, (err, user, info) => {
      //console.log("User authenticating...");
      if (err) {
        res.locals.flashMessages = {
          type: "danger",
          message: "Error occurs during login",
        };
        res.json(res.locals.flashMessages);
      } else {
        //console.log(`Authentication: ${user}`);
        if (!user) {
          res.locals.flashMessages = {
            type: "danger",
            message: "Invalid email or password",
          };
          res.json(res.locals.flashMessages);
        } else {
          //console.log(`Login status: ${res.locals.loggedIn}`);
          res.locals.flashMessages = {
            type: "success",
            message: `Hello, ${user.name.fname}`,
            loggedIn: true,
          };
          res.locals.loggedIn = true;
          res.json(res.locals.flashMessages);
        }
      }
    })(req, res, next);
    //console.log(`Authenticated: ${req.isAuthenticated()} `);
  },
  searchRooms: (req, res, next) => {
    console.log("searching requested rooms...");

    Room.find()
      .lean()
      .then((rooms) => {})
      .catch((err) => {
        console.log(`Error occurred while searching rooms - ${err.message}`);
      });
  },
};
