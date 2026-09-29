/*

Task 8: Capstone Mini-Engine — Course Enrollment Dashboard 
Goal: Build an automated Node.js reporting script that computes relational enrollment metrics.

*/

import pool from "./db.js";

try {
    const [rows] = await pool.query(`
        SELECT
            c.course_name,
            c.instructor,
            COUNT(s.id) AS total_students
        FROM courses AS c
        LEFT JOIN students AS s
        ON c.id = s.course_id
        GROUP BY c.id, c.course_name, c.instructor
        ORDER BY total_students DESC
    `);

    console.log("Course Enrollment Report:");

    for (const row of rows) {
        console.log(
            `${row.course_name} - ${row.instructor} - ${row.total_students} students`
        );
    }

} catch (err) {
    console.log("Error:", err);
} finally {
    await pool.end();
}