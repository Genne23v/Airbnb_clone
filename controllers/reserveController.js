const nodeMailer = require('nodemailer');
const passport = require('passport');
const Room = require('../models/room');

module.exports = {
  index: (req, res) => {
    const roomId = req.params.id;

    Room.findById(roomId)
      .lean()
      .then((room) => {
        room.photos.filePath = room.photos.filePath.substring(6);
        req.session.bookingRoom = room;

        res.render('reserve', {
          layout: false,
          bookingRoom: room,
          userFname: req.session.user,
          loggedIn: req.session.loggedIn,
          bookingInfo: req.session.booking,
        });
      })
      .catch((err) => {
        console.log(
          `Error occurred while fetching requested room - ${err.message}`,
        );
      });
  },
  validate: (req, res, next) => {
    if (!req.session.loggedIn) {
      req.flash('danger', 'Please log in first');
      req.skip = true;
      res.locals.redirect = `/reserve/${req.params.id}`;
      next();
    }
    req.check('startDate', 'Start date must be entered!').notEmpty();
    req.check('endDate', 'End date must be entered!').notEmpty();

    req.getValidationResult().then((err) => {
      if (!err.isEmpty()) {
        const errMessages = err.array().map((e) => e.msg);
        req.flash('danger', errMessages);
        req.skip = true;
        res.locals.redirect = `/reserve/${req.params.id}`;
        next();
      } else {
        next();
      }
    });
  },
  checkout: (req, res, next) => {
    if (req.skip) return next();
    else {
      const startDate = Date.parse(req.body.startDate);
      const endDate = Date.parse(req.body.endDate);
      const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const subTotal = req.session.bookingRoom.price * days;
      const serviceFee = subTotal * 0.1;
      const tax = (subTotal + serviceFee) * 0.1;
      const totalAfterTax = subTotal + serviceFee + tax;

      req.session.booking = {
        numStays: days,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        totalPriceBeforeTax: Math.round(subTotal),
        serviceFee: Math.round(serviceFee),
        tax: Math.round(tax),
        totalPriceAfterTax: Math.round(totalAfterTax),
      };

      res.render('reserve', {
        layout: false,
        bookingRoom: req.session.bookingRoom,
        bookingInfo: req.session.booking,
        userFname: req.session.user,
        loggedIn: req.session.loggedIn,
      });
    }
  },
  book: (req, res, next) => {
    const roomId = req.params.id;

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
      to: req.session.user.email,
      subject: `Success! - Your booking for room ID - ${req.session.bookingRoom._id} has been made.`,
      text: `Dear, ${req.session.user.name.fname}.\nWe have received your booking request for room ID - ${req.session.bookingRoom._id}. We are happy to tell you that your booking has been complete successfully.\nNo further action is required now.\n\nBest regards`,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log('Error' + err);
      } else {
        console.log(`Email sent to ${req.session.user.email} successfully.`);
      }
    });

    req.session.bookingConfirmed = true;
    res.locals.redirect = `/reserve/${roomId}/summary`;
    next();
  },
  summaryView: (req, res) => {
    const roomId = req.params.id;

    Room.findById(roomId)
      .lean()
      .then((room) => {
        room.photos.filePath = room.photos.filePath.substring(6);
        req.session.bookingRoom = room;

        res.render('reserve', {
          layout: false,
          bookingRoom: room,
          userFname: req.session.user,
          loggedIn: req.session.loggedIn,
          bookingConfirmed: req.session.bookingConfirmed,
          bookingInfo: req.session.booking,
        });
      })
      .catch((err) => {
        console.log(
          `Error occurred while fetching requested room - ${err.message}`,
        );
      });
  },
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else next();
  },
  logout: (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.locals.redirect = '/';
    next();
  },
};
