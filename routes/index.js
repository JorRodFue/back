var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(env)

  console.log(env.MODE)
  res.render('index', { title: 'Express', envMode: (env.MODE == "LOCAL") ? "LOCALHOST" : "ONLINE" });
});

module.exports = router;
