const HTTP_PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();
const router = require('./routes/index');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const multer = require('multer');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const path = require('path');

require('dotenv').config();

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutDir: __dirname + '/views/layouts',
    partialsDir: path.join(__dirname, '/views/partials'),
    helpers: {
      ifThird: function (index, options) {
        if (index % 3 === 0) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
    },
  }),
);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.connection
  .once('open', () => {
    console.log('Successfully connected to MongdoDB using Mongoose!');
  })
  .on('error', (err) => {
    console.log('MongoDB connection error: ', err);
  });
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  }),
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
app.use(multer({ storage: storage }).single('photos'));

app.use(express.json());
app.use(expressValidator());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(
  session({
    name: 'session',
    secret: process.env.SECRET_KEY,
    cookie: {
      maxAge: 1000 * 60 * 23,
    },
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', router);

app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(HTTP_PORT, () => {
  console.log(`The server is running... to port: ${HTTP_PORT}`);
});
