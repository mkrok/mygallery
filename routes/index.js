var config = require('../config');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Gallery', 
  	                     folder: config.rootFolder,
  	                     galeria: galeria,
  	                     tytul: config.tytul,
  	                     opis: config.opis });
});

module.exports = router;
