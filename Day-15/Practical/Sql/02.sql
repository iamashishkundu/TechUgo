USE school_db;

SELECT *
FROM students
ORDER BY age ASC;

SELECT *
FROM students
ORDER BY age DESC;

SELECT *
FROM students
ORDER BY age ASC
LIMIT 3;

SELECT *
FROM students
ORDER BY age DESC
LIMIT 3;

SELECT *
FROM students
ORDER BY age ASC
LIMIT 3 OFFSET 3;

SELECT *
FROM students
ORDER BY fee_paid DESC
LIMIT 5;