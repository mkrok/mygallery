var config = require('../config');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Gallery', 
  	                     folder: config.rootFolder,
  	                     tytul: config.tytul,
  	                     opis: config.opis });
});

router.get('/test', function(req, res, next) {
  var io = req.io;
  io.emit('test', 'test');
});



module.exports = router;
