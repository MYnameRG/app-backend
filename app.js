// Load environment variables from .env file
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const validateToken = require('./middlewares/auth.middleware');

const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const dataFrameRouter = require('./routes/dataframe.route');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Enable CORS with the specified options
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// API Calls
app.use('/api/user', userRouter);
app.use('/api/auth', validateToken, authRouter);
app.use('/api/data-table', validateToken, dataFrameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err)
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
