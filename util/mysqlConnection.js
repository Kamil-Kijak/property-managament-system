
const mysql = require("mysql2")

const connection = mysql.createConnection({
    host:"localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_PASSWORD || "",
    database:process.env.DB_NAME || "database"
})

connection.connect((err) => {
    if(err) {
        return console.log("Wystąpił bład z połączeniem z MYSQL ->", err)
    }
    console.log("Usługa MYSQL została poprawnie połączona")
})

module.exports = connection;