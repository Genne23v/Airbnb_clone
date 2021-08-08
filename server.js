// const User = require("./models/user");
// const homeController = require("./controllers/homeController");

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  mongoose = require("mongoose"),
  //bcrypt = require("bcrypt"),
  handlebars = require("express-handlebars"),
  multer = require("multer"),
  expressValidator = require("express-validator"),
  bodyParser = require("body-parser"),
  connectFlash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  methodOverride = require("method-override"),
  path = require("path");

require("dotenv").config();

app.use(express.static("public"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "main",
    layoutDir: __dirname + "/views/layouts",
    partialsDir: path.join(__dirname, "/views/partials"),
    helpers: {
      ifThird: function (index, options) {
        if (index % 3 === 0) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
    },
  })
);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection
  .once("open", () => {
    console.log("Successfully connected to MongdoDB using Mongoose!");
  })
  .on("error", (err) => {
    console.log("MongoDB connection error: ", err);
  });
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
app.use(multer({ storage: storage }).single("photos"));
//const upload = multer({ storage: storage }).array('photos', 3); //filter files

app.use(express.json());
app.use(expressValidator());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(
  session({
    name: "session",
    secret: process.env.SECRET_KEY,
    cookie: {
      maxAge: 1000 * 60 * 23,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(passport.initialize());
// app.use(passport.session());

//AUTHENTICATION STRATEGY TEST
// passport.use(new LocalStrategy(User.authenticate()));
// passport.use(
//   new LocalStrategy((email, password, done) => {
//     User.findOne({ username: email }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false);
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     });
//   })
// );

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.newRoom;
  res.locals.rooms;
  res.locals.flashMessages = req.flash();
  next();
});

app.use("/", router);

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, () => {
  console.log(`The server is running... to port: ${HTTP_PORT}`);
});
