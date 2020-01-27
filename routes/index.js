var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', envMode: (env.herokuMode == "1") ? "ONLINE" : "LOCALHOST" });
});

module.exports = router;
