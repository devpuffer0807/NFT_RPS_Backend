var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var formData = require('express-form-data');
var os = require('os');
var mongoose = require('mongoose');

var authRouter = require('./routes/auth');
var chatRouter = require('./routes/chat');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(formData.parse({ 
  uploadDir: os.tmpdir(), 
  autoClean: true 
}));

/**
 * Server Routing configuration
 */

app.use("/auth", authRouter);
app.use("/chat", chatRouter);

/** ----------------------------------------- */

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
  res.json({ error: err })
});


mongoose.connect('mongodb://localhost:27017/nft_rps')
// mongoose.connect('mongodb+srv://doadmin:76U12GRb0HCg4W85@db-mongodb-nyc3-73883-4aef1b0f.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-nyc3-73883&readPreference=secondary')
  .then(function (result, second) {
    console.log("mongodb connect success");
  })
  .catch(function (err) {
    console.log("Error", err);
  });

module.exports = app;
