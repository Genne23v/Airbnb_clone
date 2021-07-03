const homeController = require("./controllers/homeController");

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express"),
  app = express(),
  router = require("./routes/index"),
  handlebars = require("express-handlebars"),
  expressValidator = require("express-validator"),
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
app.use(expressValidator());
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

app.use("/", router);

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(HTTP_PORT, () => {
  console.log(`The server is running... to port ${HTTP_PORT}`);
});
