let mysql = require('mysql')

if (env) console.log("cargando db.js, global env definida ")
//VIVA EL VINO

let localhost = env.mode === "LOCAL"
console.log(env.mode);



// console.log("evn.hostname = ", env.HOSTNAME)
// console.log("password", env.PASSWORDDB)


const database = {
  host: localhost ? env.HOSTNAMELOCAL : env.HOSTNAME,
  user: localhost ? env.USERDBLOCAL : env.USERDB,
  password: localhost ? env.PASSWORDDLOCAL : env.PASSWORDDB,
  port: env.PORTDB || 3306,
  database: localhost ? env.databaseLOCAL : env.DATABASE
}

console.log(database)
const db = mysql.createPool(

  {
    host: localhost ? env.HOSTNAMELOCAL : env.HOSTNAME,
    user: localhost ? env.USERDBLOCAL : env.USERDB,
    password: localhost ? env.PASSWORDDLOCAL : env.PASSWORDDB,
    port: env.PORTDB || 3306,
    database: localhost ? env.databaseLOCAL : env.DATABASE
  })

module.exports = { db }