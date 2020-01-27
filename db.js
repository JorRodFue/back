let mysql = require('mysql')
require("dotenv").config();

let env = process.env
let localhost
console.log("HEROKUMODE VALE", env.herokuMode)
console.log("ENVCARGADO : ", env.ENVCARGADO)

if (env.herokuMode !== "1") localhost = true


console.log("evn.hostname = ", process.env.HOSTNAME)
console.log("password", env.PASSWORDDB)

console.log("conectamos via", localhost ? env.HOSTNAMELOCAL : env.HOSTNAME)

myDB = mysql.createPool(

    {
        host: localhost ? env.HOSTNAMELOCAL : env.HOSTNAME,
        user: localhost ? env.USERDBLOCAL : env.USERDB,
        password: localhost ? env.PASSWORDDLOCAL : env.PASSWORDDB,
        port: env.PORTDB,
        database: localhost ? env.databaseLOCAL : env.DATABASE
    })
module.exports = { myDB: myDB, env: env };