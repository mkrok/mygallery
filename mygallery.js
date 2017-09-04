const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('./config');
const logger = require('morgan');
const fs = require('fs');
const path = require('path');
galeria = [];  // global variable
var foldery = [];
const rootFolder = config.rootFolder || path.join(__dirname, 'public/photo');
const port = process.env.PORT || '3001';

http.listen(port, () => {
  console.log('server listening on port ' + port);
});

function budujGalerie(folder, callback) {
  foldery = [];
  galeria = [];
  var counter = 0;

  fs.readdir(folder, function(err, katalogi){
    if (err) return console.error(err);
    //console.log(Date() + 'ilosc folderow: ' + katalogi.length);

    katalogi.forEach( function (katalog){
      fs.stat(folder + '/' + katalog, function(err, stats){
        if ( stats.isDirectory() ) {
          foldery.push('/' + katalog);
          // dodaję katalog: config.rootFolder + '/'+ katalog
          // wczytuje zdjecia z foldera "katalog"
          this[katalog+'-zdjecia'] = [];
          galeria.push( { folder: katalog,
                          zdjecia: this[katalog+'-zdjecia']});

          // szukam zdjęć w: ' + folder + '/' + katalog

          fs.readdir( (folder + '/' + katalog), function(err, pliki){
            if (err) return console.error(err);

            pliki.forEach( function (plik){
              fs.stat(folder + '/' + katalog + '/' + plik, function(err, stats){
                if ( stats.isFile() && path.extname(plik).toLowerCase()==='.jpg') {
                  this[katalog+'-zdjecia'].push(plik);
                  //console.log(Date() + 'dodaję zdjęcie ' + plik +
                  //             ' do folderu ' + katalog);
                };
              });
            });

          });
        };
      });
    });
  });

  setTimeout( function() {
    if (callback) callback();
  }, 1000);

};

io.sockets.on('connection', (socket) => {

  socket.on('hello', () => {
    console.log(socket.handshake.address.substr(7) + ' has connected on: ' + Date());
    budujGalerie(rootFolder, () => {
      //console.log(galeria[0].zdjecia);
      socket.emit('galeria', galeria);
    });
  });

  socket.on('refresh', () => {
    console.log('refreshing...');
    socket.emit('galeria', galeria);
  });

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(rootFolder));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  res.render('index', {
    folder: config.rootFolder,
  	tytul: config.tytul,
  	opis: config.opis
  });
})
