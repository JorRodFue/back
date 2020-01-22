let mysql = require('mysql')
require("dotenv").config();

let env = process.env

console.log(env.hostname)
let myDB = mysql.createPool(

    {
        host: env.hostname,
        user: env.userdb,
        password: env.passworddb,
        port: env.portdb,
        database: env.database
    })
module.exports = myDB;