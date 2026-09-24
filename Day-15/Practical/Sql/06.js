import mysql from "mysql2/promise";
import pool from "./db.js";


const search = "Sharma";

try {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM students
        WHERE name LIKE ?
        `,
        [`%${search}%`]
    );

    console.log("Search Results:");
    console.log(rows);

} catch (err) {
    console.log("Error:", err);
} finally {
    await pool.end();
    console.log("Pool Closed");
}