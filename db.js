let mysql = require('mysql')
require("dotenv").config();

let env = process.env

if (env.mode === "LOCAL") {

    console.log("BASE DE DATOS LOCAL")

    env.hostname = env.HOSTNAMELOCAL
    env.hostname = env.userLOCAL
    env.passworddb = env.PASSWORDDBLOCAL
    env.database = env.DATABASELOCAL
}

console.log(env.hostnamelocal)
let myDB = mysql.createPool(

    {
        host: (env.mode === "LOCAL") ? env.HOSTNAMELOCAL : env.hostname,
        user: (env.mode === "LOCAL") ? env.USERDBLOCAL : env.hostname,
        password: (env.mode === "LOCAL") ? env.PASSWORDDLOCAL : env.passworddb,
        port: env.portdb,
        database: (env.mode === "LOCAL") ? env.databaseLOCAL : env.database
    })
module.exports = myDB;