const Room = require('../models/room');

module.exports = {
  index: (req, res) => {
    if (req.session.bookingConfirmed) {
      req.session.bookingConfirmed = false;
      req.session.booking = null;
    }

    if (req.session.loggedIn && req.session.user.admin) {
      res.redirect('/admin');
    } else {
      Room.find({ location: req.query.location })
        .lean()
        .then((rooms) => {
          res.locals.rooms = [];
          rooms.forEach((room) => {
            room.photos.filePath = room.photos.filePath.substring(6);
            res.locals.rooms.push(room);
          });

          res.render('room-listing', {
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
    req.session.destroy();
    res.locals.redirect = '/room-listing';
    next();
  },
  redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) {
      res.redirect(redirectPath);
    } else next();
  },
};
