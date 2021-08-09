const Room = require("../models/room");

module.exports = {
  index: (req, res) => {
    let roomId = req.params.id;

    Room.findById(roomId)
      .lean()
      .then((room) => {
        room.photos.filePath = room.photos.filePath.substring(6);
        req.session.bookingRoom = room;

        res.render("reserve", {
          layout: false,
          bookingRoom: room,
          userFname: req.session.user,
          loggedIn: req.session.loggedIn,
        });
      })
      .catch((err) => {
        console.log(
          `Error occurred while fetching requested room - ${err.message}`
        );
      });
  },
  validate: (req, res, next) => {
    if (!req.session.loggedIn) {
      req.flash("danger", "Please log in first");
      res.locals.redirect = `/reserve/${req.params.id}`;
      next();
    }
    req.check("startDate", "Start date must be entered!");
    req.check("endDate", "End date must be entered!");

    req.getValidationResult().then((err) => {
      if (!err.isEmpty()) {
        let errMessages = err.array().map((e) => e.msg);
        req.flash("danger", errMessages);
        req.skip = true;
        res.locals.redirect = `/reserve/${req.params.id}`;
        next();
      } else {
        next();
      }
    });
  },
  checkout: (req, res, next) => {
    console.log(`req.session.bookingRoom - ${req.session.bookingRoom}`);
    if (req.skip) return next();
    else {
      let startDate = Date.parse(req.body.startDate);
      let endDate = Date.parse(req.body.endDate);
      let days = (endDate - startDate) / (1000 * 60 * 60 * 24);
      let subTotal = req.session.bookingRoom.price * days;
      let serviceFee = subTotal * 0.1;
      let tax = (subTotal + serviceFee) * 0.1;
      let totalAfterTax = subTotal + serviceFee + tax;

      req.session.booking = {
        numStays: days,
        totalPriceBeforeTax: Math.round(subTotal),
        serviceFee: Math.round(serviceFee),
        tax: Math.round(tax),
        totalPriceAfterTax: Math.round(totalAfterTax),
      };
      res.render("reserve", {
        layout: false,
        bookingRoom: req.session.bookingRoom,
        bookingInfo: req.session.booking,
        userFname: req.session.user,
        loggedIn: req.session.loggedIn,
      });
    }
  },
  book: (req, res, next) => {
    console.log();

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
      subject: `Success! - Your booking for room ID - ${req.session.bookingRoom._id} has been made.`,
      text: `Dear, ${req.body.fname}.\nWe have received your booking request for room ID - ${req.session.bookingRoom._id}. We are happy to tell you that your booking has been complete successfully.\nNo further action is required now.\n\nBest regards`,
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
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else next();
  },
  logout: (req, res, next) => {
    let roomId = req.params.id;
    res.locals.redirect = `/reserve/${roomId}`;
    req.logout();
    req.session.loggedIn = false;
    next();
  },
};
