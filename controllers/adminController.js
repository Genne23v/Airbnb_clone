const Room = require("../models/room");
// multer = require("multer"),
// { storage } = require("../server");

const getRoomParams = (body) => {
  return {
    title: body.title,
    price: body.price,
    description: body.description,
    location: body.location,
    photos: files,
  };
};

module.exports = {
  index: (req, res) => {
    console.log(`userFname: ${req.session.user}`);
    console.log(`formData: ${res.locals.newRoom}`);
    res.render("admin", {
      layout: false,
      userFname: req.session.user,
      formData: res.locals.newRoom,
    });
  },
  roomValidate: (req, res, next) => {
    const roomTitle = req.body.title,
      price = req.body.price,
      description = req.body.description,
      location = req.body.location;

    if (req.body.title.length < 3) {
      req.check("title", "Room title should be longer...").trim();
    }
    req.check("title", "Room title cannot be empty").notEmpty();
    req.check("price", "Price must be a number").isInt({ min: 0 });
    req.check("description", "Description cannot be empty").notEmpty();
    req.check("location", "Location cannot be empty").notEmpty();

    req.getValidationResult().then((err) => {
      console.log(err);
      if (!err.isEmpty()) {
        console.log("An error occurred while validating room info");
        let errMessages = err.array().map((e) => e.msg);
        req.flash("danger", errMessages);
        req.skip = true;
        res.locals.redirect = "/admin";

        res.locals.newRoom = {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          location: req.body.location,
        };
        next();
      } else {
        next();
      }
    });
  },
  addRoom: (req, res, next) => {
    console.log(`req.file: ${req.file}`);
    console.log(`res.locals.newRoom: ${res.locals.newRoom.title}`);
    if (req.skip) return next();
    else {
      let newRoom = new Room(getRoomParams(req.body));

      newRoom.save((err, room) => {
        if (room) {
          req.flash("success", "successfully added");
          //res.locals.flashMessages("success", "successfully added");
          res.locals.redirect = "/admin/view";
          next();
        } else {
          req.flash("danger", "something's wrong");
          //res.locals.flashMessages("danger", "something's wrong");
          res.locals.redirect = "/admin/";
          next();
        }
      });
    }
  },
  editRoom: (req, res, next) => {},
  update: (req, res, next) => {},
  deleteRoom: (req, res, next) => {},
  redirectView: (req, res, next) => {
    console.log(`res.locals.newRoom: ${res.locals.newRoom.title}`);
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      console.log(`Redirecting to ${redirectPath}`);
      res.redirect(redirectPath);
    } else next();
  },
  viewList: (req, res, next) => {},
  logout: (req, res, next) => {
    console.log(`Admin logout - ${req.session.userFname}`);
    req.logout();
    consoel.log(`req.session: ${req.session}`);
    res.locals.redirect = "/";
    next();
  },
};
