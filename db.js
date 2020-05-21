let mysql = require('mysql')

if (env) console.log("cargando db.js, global env definida ")
//VIVA EL VINO

let localhost = env.mode === "LOCAL"



// console.log("evn.hostname = ", env.HOSTNAME)
// console.log("password", env.PASSWORDDB)

console.log(env.HOSTNAME, env.USERDB, env.PASSWORDDB)
const db = mysql.createPool(

  {
    host: localhost ? env.HOSTNAMELOCAL : env.HOSTNAME,
    user: localhost ? env.USERDBLOCAL : env.USERDB,
    password: localhost ? env.PASSWORDDLOCAL : env.PASSWORDDB,
    port: env.PORTDB,
    database: localhost ? env.databaseLOCAL : env.DATABASE
  })

module.exports = { db }