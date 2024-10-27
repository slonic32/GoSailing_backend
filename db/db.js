import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();
let db_pool = null;
// connect to MySQL DB
try {
  db_pool = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("connected to database");
} catch (err) {
  console.log("db error: ", err);
}

export default db_pool;
