var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var autoprefixer = require('express-autoprefixer');

var routes = require('./routes/index');

var app = express();

var root = __dirname + '/public/scss';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(autoprefixer({ browsers: 'last 2 versions', cascade: false })).use(express.static(root));

app
  .use(autoprefixer({ browsers: 'last 2 versions', cascade: false }))
  .use(express.static(root))
  .listen(1337);

app.use(
   sassMiddleware({
     src: __dirname + '/public/scss', //where the sass files are 
     dest: __dirname + '/public/css', //where css should go
     debug: true, // obvious
     outputStyle: 'compressed',
     prefix: '/css'
   })
 );

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
