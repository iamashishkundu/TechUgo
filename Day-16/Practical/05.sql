/*

Task 5: The LEFT JOIN Audit 
Goal: Find courses that have zero enrolled students.
 
 */

USE school_db;

SELECT
    c.id,
    c.course_name,
    c.instructor
FROM courses AS c
LEFT JOIN students AS s
ON c.id = s.course_id
WHERE s.id IS NULL;