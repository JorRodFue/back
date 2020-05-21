var express = require('express');
var router = express.Router();

let accionesDB = require('../../accionesDB/accionesDBEventos').accionesDB
let eventoDAO = require("../../DAO/eventoDAO").eventoDAO
const { PerformanceObserver, performance } = require('perf_hooks');


/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log(req.url)
  let finalResults

  if (req.query['ID']) {
    console.log("ha llegado un get con query " + req.query['ID'])
    let results = await eventoDAO.getByID([req.query['ID']])
    console.log("encontrados", results.length)
    res.json(results) //devuelve array de comentarios

  }
  else if (req.query['AnyField']) {
    console.log("ha llegado un get con query " + req.query['AnyField'])
    eventoDAO.getByAny([req.query['AnyField']]).then((results) => {
      console.log("encontrados", results.length)
      res.json(filtrarDuplicados(results)) //devuelve array de comentarios)
    }).catch(err => console.log(err))

  }
  else {
    console.log("hicieron get en /api/eventos")
    await eventoDAO.getAll().then((results) => {
      console.log("encontrados", results.length)
      finalResults = filtrarDuplicados(results)
      console.log("devuelvo array filtrado tamaño", finalResults.length)
      res.json(finalResults)
    })
  }


});

router.post('/buscador/', async (req, res) => {
  console.log("ha llegado un post a buscador", req.body)
  let results = "algo ha ido mal"
  if (req.body.query) results = await eventoDAO.getByAnyFieldsString(req.body)
  else results = await eventoDAO.getByAnyFieldsObject(req.body)
  console.log("encontrados", results.length)

  finalResults = filtrarDuplicados(results)
  console.log("devuelvo array filtrado tamaño", finalResults.length)
  res.json(finalResults)

})

router.post('/select/', async (req, res) => {
  console.log("ha llegado un post a select")
  res.json(filtrarDuplicados(await eventoDAO.getByField(req.body.field, req.body.value)))

})


router.post('/create/', async (req, res) => {
  console.log("ha llegado un /post a create")
  await eventoDAO.dropEventosTable() //promesa que tira la table si existe
  await eventoDAO.createEventosTable() //promesa que crea la table si no exist 

  // cuando acaba el ambito de estos await??

  res.redirect("/")
})

router.post('/truncate/', async (req, res) => {
  console.log("ha llegado un post a truncate")
  await eventoDAO.truncateTable()
  console.log("truncando tabla enventos")
  res.redirect("/")
})

router.post('/fill/', async (req, res) => {
  console.log("ha llegado un post a fill")
  await accionesDB.rellenarDB()
  res.redirect("/")
})

router.post('/reimaginar/', async (req, res) => {
  console.log("ha llegado un post a reimaginar")
  await accionesDB.hacerScrapeo()
  res.redirect("/")
})

router.post('/geoCoding/', async (req, res) => {
  console.log("ha llegado un post a geocoding")
  await accionesDB.hacerGeocoding()
  res.redirect("/")
})

router.post('/resetScrap/', async (req, res) => {
  console.log("ha llegado un post a resetscrap")

  let arrayObjetos = [
    { field: "imagen", valor: null },
    { field: "direccionScrap", valor: null },

    { field: "barrioScrap", valor: null },

    { field: "scrapeado", valor: false },
    { field: "imagenSecundariaScrap", valor: null }]

  await eventoDAO.updateAnyFieldsById("id", arrayObjetos)

  res.redirect("/")
})

router.post('/buscarDuplicados/', async (req, res) => {
  console.log("ha llegado un post a buscarDuplicados")


  eventoDAO.actualizarDuplicados().then((results) => { console.log(results) }).catch((error) => { console.log(error) })
});

function filtrarDuplicados(arrayEntrada, propiedad = "nombre") {
  let arrayFiltrado = []
  var t0 = performance.now();
  const map = new Map();
  for (const item of arrayEntrada) {
    if (!map.has(item[propiedad].toUpperCase().trim())) {
      map.set(item[propiedad].toUpperCase().trim(), true);
      arrayFiltrado.push(item)

    }
    // else console.log(`${item.nombre} está duplicado`)
  }

  // let arrayNombres = []
  // for (const elemento of arrayEntrada) {

  //     if (!arrayNombres.find((nombres) => { return elemento.nombre == nombres })) {
  //         arrayNombres.push(elemento.nombre)
  //         arrayFiltrado.push(elemento)
  //     }

  // }
  var t1 = performance.now();
  console.log("The algorithm took " + (t1 - t0) + " milliseconds.");

  console.log("EL filtro dice", arrayFiltrado.filter((item) => item.superindex != 99).length)
  return arrayFiltrado
}


module.exports = router;

