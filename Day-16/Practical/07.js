/*

Task 7: Node.js Related Query Script 
Goal: Fetch and format joined records using mysql2/promise.
 */

import pool from "./db.js";

try {
    const [rows] = await pool.query(`
        SELECT
            s.name,
            c.course_name,
            c.instructor
        FROM students AS s
        INNER JOIN courses AS c
        ON s.course_id = c.id
        ORDER BY c.course_name, s.name
    `);

    console.log("Student Courses:");

    for (const row of rows) {
        console.log(
            `${row.name} - ${row.course_name} - ${row.instructor}`
        );
    }

} catch (err) {
    console.log("Error:", err);
} finally {
    await pool.end();
}