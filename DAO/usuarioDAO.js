let db = require("../db")
let bcrypt = require('bcryptjs')

let usuarioDAO = {

    getAll() {
        console.log("entramos en usuario getAll()")
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from proyecto.usuarios", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    }
    ,

    getByEmail(email = null) {
        console.log("buscando a ", email)

        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from proyecto.usuarios where email = ?", [email], (err, res) => {
                if (err) reject(err)
                console.log(res)
                resolve(res)
            })
        })
        return prom
    },
    getByUsername(username = null) {
        console.log("buscando a ", username)
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from proyecto.usuarios where username = ?", [username], (err, res) => {
                console.log("query hechas")

                if (err) reject(err)
                console.log(res.length)
                resolve(res)
            })
        })
        return prom
    },
    getByID(id = null) {
        console.log("buscando a user id ", id)
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from proyecto.usuarios where id = ?", [id], (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },
    registrarUsuario(usuario) {
        //username, email/password

        usuario.password = bcrypt.hashSync(usuario.password, 10)
        let arrayValues = []
        usuario.privilegios = 0;
        usuario.activado = false;
        usuario.fecha = new Date()
        usuario.avatar = 0;


        for (const key in usuario) {
            if (usuario.hasOwnProperty(key)) {
                arrayValues.push(usuario[key]);
            }
        }
        console.log("insertando usuario", arrayValues)

        let prom = new Promise((resolve, reject) => {
            db.query(`INSERT INTO proyecto.usuarios VALUES (null,?)`,
                [arrayValues],
                (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        })
        return prom
    },
    createUsuariosTable() {
        console.log("create usuarios Table")
        let prom = new Promise((resolve, reject) => {
            // db.query("drop table if exists proyecto.usuarios")
            db.query("create table if not exists proyecto.usuarios (ID INT(10) primary key auto_increment, username VARCHAR(16), email VARCHAR(24), password VARCHAR(255) , privilegios INT(2), activado BOOLEAN, fecha DATE , avatar INT(5));", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },
    updateFieldById(id, field, nuevoValor) {
        console.log(`update id ${id} campo ${field} nuevo valor ${nuevoValor}`)
        let prom = new Promise((resolve, reject) => {
            db.query(`update proyecto.usuarios set ${field}=${nuevoValor} where ID=${id}`, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    }



}

module.exports = { usuarioDAO: usuarioDAO }