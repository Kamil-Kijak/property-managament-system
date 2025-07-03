
const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host:"localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_PASSWORD || "",
    database:process.env.DB_NAME || "database"
})


module.exports = pool;