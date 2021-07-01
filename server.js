const {
  validate,
  register,
  redirectView,
  logInValidate,
} = require("./controllers/usersController");
const usersController = require("./controllers/usersController");

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express"),
  app = express(),
  handlebars = require("express-handlebars"),
  { check, validationResult } = require("express-validator"),
  bodyParser = require("body-parser"),
  //connectFlash = require("connect-flash"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  path = require("path");

app.use(express.static("public"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultLayout: "main",
    layoutDir: __dirname + "/views/layouts",
    partialsDir: path.join(__dirname, "/views/partials"),
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(expressValidator());
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: null,
    },
    resave: false,
    saveUninitialized: false,
  })
);
//app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.message = req.session.message; //flash();
  delete req.session.message;
  next();
});

app.get("/", (req, res) => {
  res.render("main", {
    layout: false,
  });
});

app.post("/register", (req, res) => {
  validate(req, res);
});

app.post("/logIn", (req, res) => {
  console.log("login start");
  logInValidate(req, res);
});

app.get("/room-listing", (req, res) => {
  res.render("room-listing", {
    layout: false,
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, () => {
  console.log(`The server is running... to port ${HTTP_PORT}`);
});
