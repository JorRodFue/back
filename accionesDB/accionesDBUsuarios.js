let usuarioDAO = require("../DAO/usuarioDAO").usuarioDAO
//capa intermediaria que YA devuelve resultados, resolviendo promesas de la capa DB



let accionesDB = {
    getAll() {
        usuarioDAO.getAll()
            .then((results) => { return results })
            .catch((error) => { return error })
    },
    createUsuariosDB() {
        usuarioDAO.createUsuariosDB()
            .then((results) => {
                console.log(results)
                return results
            })
            .catch((error) => {
                // console.log(error)
                return error
            })
    }
}

module.exports = { accionesDB: accionesDB }