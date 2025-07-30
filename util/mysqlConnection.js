
const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host:process.env.DB_HOST || "localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_PASSWORD || "",
    database:process.env.DB_NAME || "database"
})


const checkConnection = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    console.log("Połączenie z MySQL powiodło się!");
    conn.release();
  } catch (err) {
    console.error("Błąd połączenia z MySQL:", err.code);
    process.exit(1);
  }
};
checkConnection()

module.exports = pool;