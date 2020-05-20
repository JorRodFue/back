var express = require('express');
var router = express.Router();

let eventosRouter = require('./api/eventos.js')
let comentariosRouter = require('./api/comentarios.js')
let usuariosRouter = require("./api/usuarios.js")


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("hicieron get en /api")
});

router.use('/eventos', eventosRouter)
router.use('/comentarios', comentariosRouter)
router.use("/usuarios", usuariosRouter)


module.exports = router;

