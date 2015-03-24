var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Food truck finder' });
   //res.render('index.jade', { title: 'My Site' });
});

module.exports = router;
