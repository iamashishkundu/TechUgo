import mysql from "mysql2/promise";
import pool from "./db.js";


try {
    const [rows] = await pool.query(`
        SELECT
            COUNT(*) AS total_students,
            SUM(fee_paid) AS total_fees,
            AVG(age) AS average_age,
            MIN(age) AS youngest_age,
            MAX(age) AS oldest_age
        FROM students
    `);

    const data = rows[0];

    console.log("School Summary:");
    console.log("Total students:", data.total_students);
    console.log("Total fees:", data.total_fees);
    console.log("Average age:", Number(data.average_age).toFixed(2));
    console.log("Youngest:", data.youngest_age);
    console.log("Oldest:", data.oldest_age);

} catch (err) {
    console.log("Error:", err);
} finally {
    await pool.end();
    console.log("Pool closed");
}