var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var sessions = require('express-session');

var indexRouter = require('./routes/index');
var cardInfoRouter = require('./routes/card-info');
var authRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var profileFormRouter = require('./routes/profile-form');
var adminRouter = require('./routes/admin');
var profileRouter = require('./routes/profile');
var searchRouter = require('./routes/search');
var resultsRouter = require('./routes/results');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use(sessions({
  cookieName: 'session',
  secret: process.env.SECRET,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: false
  }));


app.use('/', indexRouter);
app.use('/card-info', cardInfoRouter);
app.use('/login', authRouter);
app.use('/signup', signupRouter);
app.use('/profile-form', profileFormRouter);
app.use('/admin', adminRouter);
app.use('/profile', profileRouter);
app.use('/search', searchRouter);
app.use('/results', resultsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
