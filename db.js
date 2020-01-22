let mysql = require('mysql')
require("dotenv").config();

let env = process.env
let localhost
console.log("HEROKUMODE VALE", env.herokuMode)

if (env.herokuMode !== "1") localhost = true



console.log(env.hostnamelocal)
let myDB = mysql.createPool(

    {
        host: localhost ? env.HOSTNAMELOCAL : env.hostname,
        user: localhost ? env.USERDBLOCAL : env.hostname,
        password: localhost ? env.PASSWORDDLOCAL : env.passworddb,
        port: env.portdb,
        database: localhost ? env.databaseLOCAL : env.database
    })
module.exports = myDB;