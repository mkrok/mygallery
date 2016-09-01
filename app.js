var config = require('./config');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var fs = require('fs');
var path = require('path');
var routes = require('./routes/index');
var users = require('./routes/users');
galeria = [];  //global
var foldery = [];
var rootFolder = path.join(__dirname, 'public', config.rootFolder);
var app = express();

// Socket.io
var io = socket_io();
app.io = io;

function budujGalerie(folder, callback) {
 foldery = [];
 galeria = [];
 fs.readdir(folder, function(err, katalogi){
    if (err) return console.error(err);
    katalogi.forEach( function (katalog){
      fs.stat(folder + '/' + katalog, function(err, stats){
        if ( stats.isDirectory() ) {
          foldery.push(config.rootFolder + '/' + katalog); 
          //console.log('dodaję katalog: ' + config.rootFolder + '/'+ katalog);
          //wczytuje zdjecia z foldera "katalog"
          this[katalog+'-zdjecia'] = [];
          //console.log('szukam zdjęć w: ' + folder + '/' + katalog);
          fs.readdir( (folder + '/' + katalog), function(err, pliki){
            if (err) return console.error(err);
            pliki.forEach( function (plik){
              fs.stat(folder + '/' + katalog + '/' + plik, function(err, stats){
                if ( stats.isFile() && path.extname(plik).toLowerCase()==='.jpg') {
                  this[katalog+'-zdjecia'].push(plik); 
                };
              });
            });
            galeria.push( { folder: katalog,
                            zdjecia: this[katalog+'-zdjecia']});
          });  
        };
      });
    });
  });
  setTimeout( function() {
    if (callback) callback();
  }, 2000);
};

io.sockets.on('connection', function (socket) {

  socket.on('hello', function(){
    console.log(socket.conn.remoteAddress + ' has connected on: ' + Date());
    budujGalerie(rootFolder, function() {
      socket.emit('galeria', galeria);
    });
  });

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
