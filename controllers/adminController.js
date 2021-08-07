const Room = require("../models/room"),
  multer = require("multer");

const getRoomParams = (body) => {
  return {
    title: body.title,
    price: body.price,
    description: body.description,
    location: body.location,
    photos: body.photos,
  };
};
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 bytes";
  }
  const dm = decimal || 2;
  const size = ["Bytes", "KB", "MB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + size[index]
  );
};

module.exports = {
  adminIndex: (req, res, next) => {
    if (req.session.loggedIn && req.session.user.admin) {
      // console.log(`userFname: ${req.session.user}`);
      // console.log(`formData: ${res.locals.newRoom}`);
      res.render("admin", {
        layout: false,
        userFname: req.session.user,
        newRoom: req.session.newRoom,
        title: "admin",
      });
    } else {
      //res.redirect("/");
      next();
    }
  },
  roomValidate: (req, res, next) => {
    console.log(`req.file: ${req}`);
    if (req.body.title.length > 0) {
      req
        .check("title", "Longer title will be appropriate")
        .trim()
        .isLength({ min: 5 });
    }
    req.check("title", "Room title cannot be empty").notEmpty();
    req.check("price", "Price must be a positive number").isInt();
    req
      .check("description", "Please describe the room more in detail")
      .isLength({ min: 10 });
    req.check("location", "Location cannot be empty").notEmpty();
    req.check("photos", "Please add one photo of your room").custom((value) => {
      return req.file;
    });

    req.session.newRoom = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      location: req.body.location,
    };

    if (req.file) {
      const image = {
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };

      req.session.newRoom.photos = image;
    }

    req.getValidationResult().then((err) => {
      console.log(err);
      if (!err.isEmpty()) {
        let errMessages = err.array().map((e) => e.msg);
        req.flash("danger", errMessages);
        req.skip = true;
        res.locals.redirect = "/admin";
        next();
      } else {
        //console.log(`req.locals.newRoom in validate: ${req.session.newRoom}`);
        next();
      }
    });
  },
  addRoom: (req, res, next) => {
    //console.log(`res.locals.newRoom in addRoom: ${res.locals.newRoom}`);
    if (req.skip) return next();
    else {
      let newRoom = new Room(getRoomParams(req.session.newRoom));

      //console.log(`newRoom: ${newRoom}`);
      newRoom.save((err, room) => {
        if (room) {
          console.log(`Saved room: ${room}`);
          req.flash("success", "successfully added");
          res.locals.redirect = "/admin/view";
          req.session.newRoom = null;
          next();
        } else {
          req.flash(
            "danger",
            `An error occurred while posting the room... ${err}`
          );
          res.locals.redirect = "/admin";
          next();
        }
      });
    }
  },
  editRoom: (req, res, next) => {
    let roomId = req.params.id;
    Room.findById(roomId)
      .lean()
      .then((room) => {
        room.photos.filePath = room.photos.filePath.substring(6);

        res.render("edit", {
          layout: "adminLayout",
          css: "admin",
          updatingRoom: room,
          userFname: req.session.user,
          buttonName: "View All List",
          buttonPath: "/admin/view",
        });
      })
      .catch((err) => {
        console.log(
          `Error occurred while fetching the room by ID - ${err.message}`
        );
      });
  },
  update: (req, res, next) => {
    console.log(`Updating the room: ${req.params}`);

    let roomId = req.params.id;
    let roomUpdateParams;
    if (req.file) {
      roomUpdateParams = getRoomParams(req.params);
    } else {
      roomUpdateParams = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        location: req.body.location,
      };
    }

    Room.findByIdAndUpdate(roomId, { $set: roomUpdateParams })
      .lean()
      .then((room) => {
        //console.log(`Updating room: ${room}`);
        res.locals.redirect = "/admin/view";
        next();
      })
      .catch((err) => {
        console.log(`Error occurred while updating the room - ${err.message}`);
      });
  },

  redirectView: (req, res, next) => {
    //console.log(`res.locals.newRoom in redirect: ${res.locals.newRoom}`);
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      //console.log(`Redirecting to ${redirectPath}`);
      res.redirect(redirectPath);
    } else next();
  },
  viewList: (req, res, next) => {
    Room.find()
      .lean()
      .then((rooms) => {
        res.locals.rooms = [];
        rooms.forEach((room) => {
          room.photos.filePath = room.photos.filePath.substring(6);
          res.locals.rooms.push(room);
          //return room;
        });
        console.log(`req.user: ${req.session.user}`);
        console.log(res.locals.rooms);
        res.render("view-list", {
          layout: "adminLayout",
          userFname: req.session.user,
          adminRooms: res.locals.rooms,
          css: "view-list",
          buttonName: "List New Room",
          buttonPath: "/admin",
        });
      })
      .catch((err) => {
        console.log(`Error while fetching rooms: ${err.message}`);
        next(err);
      });
  },
  deleteRoom: (req, res, next) => {
    let roomId = req.params.id;
    Room.findByIdAndRemove(roomId)
      .then(() => {
        res.locals.redirect = "/admin/view";
        next();
      })
      .catch((err) => {
        console.log(`Error occurred while removing the room: ${err.message}`);
        next();
      });
  },
  logout: (req, res, next) => {
    //console.log(`Admin logout - ${req.session.userFname}`);
    req.logout();
    //consoel.log(`req.session: ${req.session}`);
    res.locals.redirect = "/";
    next();
  },
};
