let { comentarioDAO } = require("../DAO/comentarioDAO.js")
//capa intermediaria que YA devuelve resultados, resolviendo promesas de la capa DB

let accionesDB = {
    getAll() {
        let datos = "null"
        comentarioDAO.getAll().then((results) => {
            datos = results
            console.log(datos)

        })

            .catch((err) => { return err })
        console.log(datos, "antes del while")
        while (datos == "null")

            return
    },
    crearDB() {
        comentarioDAO.crearDB()
            .then((result) => { console.log("Exito creando COMENTARIOS DB") })
            .catch((err) => { console.log(err) })
    },


    insertarComentario(comentario) {
        console.log("accionesDBComentarios")
        comentarioDAO.insertarComentario(comentario)
            .then((result) => {
                console.log("EXITO INSERTANDO COMENTARIOS")
                return result
            })
            .catch((err) => {
                console.log(err)
                return err
            })
    },
    deleteComentario(id) {
        console.log("delete comentario")
        comentarioDAO.deleteComentario(id).then((result) => {
            console.log("EXITO BORRANDO")
            return result
        })
            .catch((err) => {
                console.log(err);
                return err
            })
    }
}
module.exports = { accionesDB: accionesDB }