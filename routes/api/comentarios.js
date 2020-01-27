var express = require('express');
var router = express.Router();
// let accionesDB = require('../../accionesDB/accionesDBComentarios').accionesDB
let comentarioDAO = require('../../DAO/comentarioDAO').comentarioDAO
jwt = require('jwt-simple')
require("dotenv").config();

let env = process.env

//router.use(middleware)
// function middleware(req, res, next) {
//     console.log("pasa por el middleware con token")
//     let token = req.headers.token
//     console.log("El token ", token)
//     try { jwt.decode(token, env.TOKEN_KEY) } //token y la clave de codificaion
//     catch (err) {
//         console.log("bloqueado por middleware por falta de token")
//         return res.json({ exito: false, loginError: true })
//     }
//     next()

// }


/* GET home page. */
router.get('/', async function (req, res, next) {
    if (req.query['ID']) {
        console.log("ha llegado un get con query " + req.query['ID'])
        let results = await comentarioDAO.getByID([req.query['ID']])
        res.json(results) //devuelve array de comentarios
    }
    if (req.query['EventoID']) {
        console.log("ha llegado un get con query " + req.query['EventoID'])
        let results = await comentarioDAO.getByEventoID([req.query['EventoID']])
        res.json(results) //devuelve array de comentarios
    }
    else {
        console.log("hicieron get en /api/comentarios")
        let results = await comentarioDAO.getAll()
        res.json(results)
    }

});

router.post('/create', async (req, res) => {
    console.log("ha llegado un post a creeate", req.body)
    await comentarioDAO.crearTable()
    res.redirect("/")
})

router.post('/truncate/', async (req, res) => {
    console.log("ha llegado un post a truncate")
    await comentarioDAO.truncateTable()
    res.redirect("/")
})

router.post('/add/', async (req, res) => {
    // console.log("le paso al dao ", req.body)
    console.log("ha llegado un post a add")
    let mensaje
    comentarioDAO.insertarComentario(req.body)
        .then(async (result) => {
            mensaje = { exito: true, contenido: result }
            // console.log(req.body.eventoID, result.insertId)

            await comentarioDAO.actualizarTabladeIndices(req.body.eventoID, result.insertId)

        })
        .catch((err) => { mensaje = { exito: false, contenido: err } })
        .finally(() => { // VOID??? tener variable que haya pasado then y catch aparte de haberla declarado antes???
            res.json(mensaje)
        })


})

router.get("/tablaIndices/", async (req, res) => {
    console.log("get a tabla de indices")
    let results = await comentarioDAO.getEventosComentarios()
    res.json(results)
})

module.exports = router;

