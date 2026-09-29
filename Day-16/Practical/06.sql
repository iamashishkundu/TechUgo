/*
Task 6: Grouping with Joins 
Goal: Count how many students are enrolled in each course.
 
 */
USE school_db;

SELECT
    c.course_name,
    COUNT(s.id) AS total_students
FROM courses AS c
LEFT JOIN students AS s
ON c.id = s.course_id
GROUP BY c.id, c.course_name;