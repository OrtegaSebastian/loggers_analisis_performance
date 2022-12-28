const knex= require ('knex'); 

const DB_HOST = process.env.DB_HOST || "containers-us-west-107.railway.app";
const DB_NAME = process.env.DB_USER || "railway";
const DB_PASSWORD =process.env.DB_PASSWORD || "GFbb35Qkftq5uXcQj3OJ";
const DB_USER = process.env.DB_USER ||"root";
const DB_PORT= process.env.DB_PORT ||"7950";

const pool = knex({
    client:'mysql2',
    connection:{
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME
    }
})

module.exports= {
    pool}