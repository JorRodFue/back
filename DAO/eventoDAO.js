let db = require("../db").myDB
let eventoDAO = {

    getAll() {
        console.log("entramos en evento getAll()")
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from eventos", (err, res) => {
                if (err) reject(err)
                if (res) console.log("voy a devolver un array tamaño", res.length)
                resolve(res)
            })
        })
        return prom
    }
    ,
    getByID(ID) {

        console.log("eventoDAO voy a hacer un GETBYID a : " + ID)
        let prom = new Promise((resolve, reject) => {
            db.query("SELECT * from eventos WHERE id = ?", [ID], (err, res) => {
                if (err) reject(err)
                if (res) resolve(res[0])
            })
        })
        return prom
    },

    getByAnyFieldsString(query) {
        console.log("soy  getByAnyFieldsString me ha llegado", query.query)
        queryfinal = "SELECT * from eventos WHERE " + query.query;
        console.log("voy a hacer estar query", queryfinal)
        let prom = new Promise((resolve, reject) => {

            db.query(queryfinal, (err, res) => {

                // res = comprobarDuplicado(res)
                if (err) reject(err)
                console.log("voy a devolver un array de ", res.length)
                resolve(res)
            })
        })
        return prom
    },

    getByAnyFieldsObject(arrayObjetos, and = true) {
        console.log("soy  getByAnyFieldsObject y  me ha llegado", arrayObjetos)
        let i = 1;
        let queryParcial = ""
        for (const objeto of arrayObjetos) {
            let operador = (objeto.operador) ? objeto.operador : ""
            field = objeto.field
            valor = objeto.valor

            queryParcial += `${operador} UPPER(${field}) like '%${valor.trim()}%' `
            i++
        }
        let query = `SELECT * FROM eventos WHERE ${queryParcial};`
        console.log(query)
        let prom = new Promise((resolve, reject) => {
            db.query(query, (err, res) => {
                if (err) reject(err)
                resolve(res)
                console.log("voy a devolver un array de ", res.length)

            })
        })
        return prom
    },


    buscarDuplicados() {
        let query = `select * from eventos where MadridID in (select MadridID as MadridRepes FROM eventos group by MadridID having count(*) >1)`
        let prom = new Promise((resolve, reject) => {
            db.query(query, (err, res) => {
                if (err) {

                    console.log("ERROR AL BUSCAR DUPLICADOS")
                    reject(err)
                }
                resolve(res)
            })
        })
        return prom
    },

    async actualizarDuplicados() {

        let prom = new Promise((resolve, reject) => {
            db.query(`CREATE TABLE  if NOT EXISTS duplicados SELECT  MadridID as MadridID FROM eventos group by MadridID having count(*) >1;`, (err, res) => {
                setTimeout(() => {
                    db.query("UPDATE eventos set duplicado = 1 where MadridID in (SELECT *  from duplicados)", (err, res) => {
                        setTimeout(() => {
                            db.query(`DROP TABLE duplicados`, (err, res) => {
                                if (err) reject(err)
                                resolve(res)
                            })
                        }, 288)

                    });
                }, 288)

            })
        })
        return prom
    },





    insertData(evento) {
        // console.log("han llamado a insert data")

        let arrayValues = []
        let stringValues = "null"
        for (const key in evento) {
            if (evento.hasOwnProperty(key)) {
                arrayValues.push(evento[key]);
                stringValues += ",?"
            }
        }
        let prom = new Promise((resolve, reject) => {
            db.query(`INSERT INTO eventos VALUES (null,?)`,
                // `INSERT INTO eventos VALUES (null, ?,?, ?, ?,?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?, ?)`,
                [arrayValues]
                // [evento.nombre, evento.superindex, evento.supertipo, evento.tipo, evento.ubicacion, evento.barrio, evento.latitude, evento.longitude, evento.address, evento.postalcode, evento.description, evento.audience, evento.MadridID, evento.fecha_inicio, evento.fecha_final, evento.dia, evento.excepto_dias, evento.frecuencia, evento.link, evento.duplicado]

                ,
                (err, res) => {
                    if (err) reject(err)
                    resolve(res)
                })
        })
        return prom
    }
    ,
    truncateTable() {
        return new Promise((resolve, reject) => {
            db.query("TRUNCATE table eventos", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
    },
    dropEventosTable() {
        let prom = new Promise((resolve, reject) => {
            db.query("drop table if exists events", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },

    createEventosTable() {
        console.log("createEventosDB")
        let prom = new Promise((resolve, reject) => {
            db.query("create table if not exists eventos (ID INT(10)  primary key auto_increment,  nombre VARCHAR(256), superindex INT(4), supertipo VARCHAR(256), tipo VARCHAR(128) , ubicacion VARCHAR(128) , distrito VARCHAR (192), area VARCHAR(192), latitude FLOAT, longitude FLOAT,  direccion TEXT, direccionScrap TEXT, direccionGeocoding TEXT, barrioScrap TEXT, codigoPostal VARCHAR(12), codigo_postalGeocoding VARCHAR (16), descripcion TEXT, descripcionScrap TEXT, organization_desc TEXT, audience VARCHAR(48),  MadridID INT(20) , fecha_inicio DATE , fecha_final DATE, dia VARCHAR(24) , excepto_dias VARCHAR(30) , frecuencia VARCHAR(10) , link TEXT, relation TEXT, imagen VARCHAR(333), imagenSecundariaScrap TEXT, duplicado INT(2) , scrapeado BOOLEAN, lugar BOOLEAN)", (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom

    },

    getByField(field = 'id', value) {
        console.log("buscando where " + field + " = " + value)
        let prom = new Promise((resolve, reject) => {
            let query = `SELECT * from eventos where ${field} = '${value}'`
            console.log(query)
            db.query(query, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom;

    },

    getNull(field) {
        let prom = new Promise((resolve, reject) => {
            let query = `SELECT * from eventos where ${field} IS NULL`
            console.log(query)
            db.query(query, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom;
    },

    updateFieldById(id, field, nuevoValor) {
        // console.log("update " + field + " to " + nuevoValor + "where id = " + id)
        let prom = new Promise((resolve, reject) => {
            query = `UPDATE eventos SET ${field} = '${nuevoValor}' WHERE id =${id};`
            // console.log(query)
            db.query(query, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },

    updateTwoFieldsById(id, field1, field2, nuevoValor1, nuevoValor2) {
        console.log("update " + field + " to " + nuevoValor + "where id = " + id)
        let prom = new Promise((resolve, reject) => {
            query = `UPDATE eventos SET ${field1} = '${nuevoValor1}' , ${field2} = '${nuevoValor2}' WHERE id =${id};`
            db.query(query, (err, res) => {
                console.log(res)
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },

    updateAnyFieldsById(id, arrayObjetos) {
        console.log("updatingAnyFieldsbyId")
        let i = 1;
        let queryParcial = ""
        for (const objeto of arrayObjetos) {
            field = objeto.field
            valor = objeto.valor
            queryParcial += ` ${field} = '${valor}' `
            if (i < arrayObjetos.length) queryParcial += " ,"
            i++
        }
        let query = `UPDATE eventos SET ${queryParcial}  WHERE id =${id};`

        // console.log(query)
        let prom = new Promise((resolve, reject) => {

            db.query(query, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })
        return prom
    },

    getByAny(string) {

        console.log(string, typeof (string))
        string = string[0].toUpperCase().trim()

        return new Promise((resolve, reject) => {
            db.query(`SELECT * from eventos WHERE UPPER (nombre) like "%${string}%" or  UPPER (supertipo) like "%${string}%" or UPPER(tipo) like "%${string}%"  or UPPER(ubicacion) like "%${string}%" or UPPER(distrito) like "%${string}%" or  UPPER(area) like "%${string}%" or UPPER(direccion) like "%${string}%" or  UPPER(direccionScrap) like "%${string}%" or  UPPER(direccionGeocoding) like "%${string}%" or UPPER(barrioScrap) like "%${string}%" or codigoPostal like "%${string}%" or codigo_postalGeocoding  like "%${string}%" or UPPER(descripcion) like "%${string}%" or UPPER(organization_desc) like "%${string}%"  or UPPER(audience) like "%${string}%" or   fecha_inicio like "%${string}%" or  fecha_final like "%${string}%" or UPPER(link) like "%${string}%" or UPPER(relation) like "%${string}%" or UPPER(imagen) like "%${string}%" or UPPER(imagenSecundariaScrap) like "%${string}%"`, (err, res) => {
                if (err) reject(err)
                resolve(res)
            })
        })

    }
}



module.exports = { eventoDAO: eventoDAO }