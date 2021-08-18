const Room = require("../models/room");

module.exports = {
  index: (req, res, next) => {
    //console.log(`req.query in roomList: ${req.query.start_date}`);
    if (req.session.bookingConfirmed) {
      req.session.bookingConfirmed = false;
      req.session.booking = null;
    }

    if (req.session.loggedIn && req.session.user.admin) {
      //console.log(`Admin logged in!`);
      res.redirect("/admin");
    } else {
      Room.find({ location: req.query.location })
        .lean()
        .then((rooms) => {
          //  console.log(`rooms: ${rooms}`);
          res.locals.rooms = [];
          rooms.forEach((room) => {
            room.photos.filePath = room.photos.filePath.substring(6);
            res.locals.rooms.push(room);
          });

          res.render("room-listing", {
            layout: false,
            loggedIn: req.session.loggedIn,
            userFname: req.session.user,
            userRooms: res.locals.rooms,
            location: req.query.location,
            startDate: req.query.start_date,
            endDate: req.query.end_date,
            guest: req.query.guest,
          });
        })
        .catch((err) => {
          console.log(`Error occurred while fetching rooms - ${err.message}`);
        });
    }
  },
  logout: (req, res, next) => {
    req.logout();
    req.session.loggedIn = false;
    //console.log(`User logged out on room listing page ${req.baseUrl}`);
    //console.dir(req.baseUrl);
    res.locals.redirect = "/room-listing";
    next();
    // res.render("room-listing", {
    //   layout: false,
    //   loggedIn: req.session.loggedIn,
    // });
  },
  redirectView: (req, res, next) => {
    //console.log(`Login status: ${res.locals.loggedIn}`);
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      //console.log(`Redirecting to ${redirectPath}`);
      res.redirect(redirectPath);
    } else next();
  },
};
