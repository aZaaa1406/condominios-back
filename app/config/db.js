import { createPool } from "mysql2/promise";
import { conection } from "./config.js";


export const pool = createPool({
    port: conection.PORT,
    host: conection.HOST,
    user: conection.USER,
    password: conection.PASSWORD,
    database: conection.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, 
    connectTimeout: 15000
})

pool.getConnection().then(connection => {
    console.log("Database is connected");
    connection.release();
}).catch(error => {
    console.log(error);
})