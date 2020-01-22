let db = require("../db")
let moment = require('moment')

let comentarioDAO = {

    async getAll() {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from proyecto.comentarios",
                (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                }
            )
        })
    },
    crearTable() {
        console.log("Acceso a crear table comentarios")
        let prom = new Promise((resolve, reject) => {
            db.query("create table if not exists proyecto.comentarios (ID int(10) primary key auto_increment, eventoID int(10) , FOREIGN KEY (eventoID) REFERENCES proyecto.eventos(ID), usuarioID int(10),  FOREIGN KEY (usuarioID) REFERENCES proyecto.usuarios(ID), titulo VARCHAR(32), comentario TEXT, valoracion INT(2), recomendable BOOLEAN , fecha DATE)", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },
    insertarComentario(comentario) {
        let prom = new Promise((resolve, reject) => {
            let arrayValues = []
            comentario.fecha = new Date()
            for (const key in comentario) {
                arrayValues.push(comentario[key]);
            }
            console.log("boy a insertar", arrayValues)
            db.query("INSERT INTO proyecto.comentarios VALUES (null,?)", [arrayValues], (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },

    deleteComentario(id) {
        let prom = new Promise((resolve, reject) => {
            db.query("DELETE FROM proyecto.comentarios WHERE id=?", [id], (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom;
    },
    truncateTable() {
        return new Promise((resolve, reject) => {
            db.query("TRUNCATE table proyecto.comentarios", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    }
    ,
    getByID(ID) {
        let prom = new Promise((resolve, reject) => {
            db.query(`select * from proyecto.comentarios where ID =${ID}`,
                (err, results) => {
                    if (err) reject(err)
                    resolve(results)
                })
        })
        return prom
    },


    getByEventoID(ID) {
        let prom = new Promise((resolve, reject) => {
            db.query(`select * from proyecto.comentarios where eventoID =${ID}`,
                (err, results) => {
                    if (err) reject(err)
                    resolve(results)
                })
        })
        return prom
    },
    actualizarTabladeIndices(eventoID, comentarioID) {
        console.log("actualizando tabla de indices eventos - comentarios con ", eventoID, comentarioID)
        let prom = new Promise((resolve, reject) => {
            db.query("insert into proyecto.indiceseventoscomentarios values (null, ? , ?)", [eventoID, comentarioID],
                (err, results) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(results)
                })
        })
        return prom
    },

    getEventosComentarios() {
        console.log("get EventosComentarios")
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from proyecto.indiceseventoscomentarios", (err, res) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }

                resolve(res)
            })
        })
        return prom

    }
}

module.exports = { comentarioDAO: comentarioDAO }