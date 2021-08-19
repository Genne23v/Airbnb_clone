const nodeMailer = require('nodemailer');
const passport = require('passport');

const User = require('../models/user');
const Room = require('../models/room');

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
  index: async (req, res) => {
    const locations = await Room.find().distinct('location').exec();

    if (req.session.loggedIn) {
      if (req.session.user.admin) {
        res.render('admin', {
          layout: false,
          userFname: req.session.user,
          newRoom: req.session.newRoom,
        });
      } else {
        res.render('main', {
          layout: false,
          loggedIn: req.session.loggedIn,
          userFname: req.session.user,
          locations,
        });
      }
    } else {
      res.render('main', {
        layout: false,
        locations,
      });
    }
  },

  validate: (req, res, next) => {
    const userName = req.body.fname;

    if (req.body.email.length > 0) {
      req.check('email', 'Email is invalid').trim().isEmail();
    }
    req.check('email', 'Email cannot be empty').notEmpty();
    req.check('fname', 'First name cannot be empty').notEmpty();
    req.check('lname', 'Last name cannot be empty').notEmpty();
    req.check('password', 'Password cannot be empty').notEmpty();

    if (req.body.password.length > 0) {
      req.check('password', 'Password must be 6 to 12 characters').isLength({
        min: 6,
        max: 12,
      });
      req
        .check(
          'password',
          'Password must contain alphabetic/numeric values only',
        )
        .matches(/^[a-zA-Z0-9]+$/);
    }

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const errMessages = error.array().map((e) => e.msg);

        res.locals.flashMessages = {
          type: 'danger',
          message: errMessages,
        };
        res.json(res.locals.flashMessages);
      } else {
        res.locals.flashMessages = {
          type: 'success',
          message: `Account for ${userName} has been created successfully!`,
        };
        next();
      }
    });
  },
  create: (req, res, next) => {
    const newUser = new User(getUserParams(req.body));
    User.create(newUser, (err, user) => {
      if (user) {
        res.locals.redirect = '/';
        next();
      } else {
        res.locals.flashMessages = {
          type: 'danger',
          message: `Account for ${req.body.email} already exists.`,
        };
        res.json(res.locals.flashMessages);
      }
    });
  },
  sendEmail: (req, res) => {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PW,
      },
    });
    const mailOptions = {
      from: 'd642f85f6d-9ae820@inbox.mailtrap.io',
      to: req.body.email,
      subject: 'You have submitted a sign-up form to Airbnb',
      text: `Dear, ${req.body.fname}. You have recently submitted a registration form to Airbnb`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log('Error' + err);
      } else {
        console.log(`Email sent to ${req.body.email} successfully.`);
      }
    });
    res.json(res.locals.flashMessages);
  },

  logInValidate: (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    if (req.body.email.length > 0) {
      req.check('email', 'Email is invalid').trim().isEmail();
    }
    req.check('email', 'Email cannot be empty').notEmpty();
    req.check('password', 'Password cannot be empty').notEmpty();

    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        const errMessages = error.array().map((e) => e.msg);
        req.skip = true;
        res.locals.flashMessages = {
          type: 'danger',
          message: errMessages,
        };
        res.json(res.locals.flashMessages);
      } else {
        res.locals.currentUser = req.user;

        User.findOne({ email: userEmail }, (err, user) => {
          if (!user) {
            res.locals.flashMessages = {
              type: 'danger',
              message: 'Email does not exist',
            };
            res.send(res.locals.flashMessages);
          } else if (err) {
            console.log('Something wrong while checking email', err);
            res.locals.flashMessages = {
              type: 'danger',
              message:
                'Sorry, an error occurred during finding the user email...',
            };
            res.send(res.locals.flashMessages);
          } else {
            user.comparePasswords(userPassword).then((isMatch) => {
              if (isMatch) {
                res.locals.flashMessages = {
                  type: 'success',
                  message: `Welcome back, ${userEmail}!`,
                };
                req.session.user = user;
                req.session.loggedIn = true;
                res.send(res.locals.flashMessages);
              } else {
                res.locals.flashMessages = {
                  type: 'danger',
                  message: 'Password does not match',
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
    res.locals.redirect = '/';
    next();
  },
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else next();
  },
};
