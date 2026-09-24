USE school_db;

SELECT COUNT(*) AS total_students
FROM students;

SELECT SUM(fee_paid) AS total_fees
FROM students;

SELECT AVG(age) AS average_age
FROM students;

SELECT MIN(age) AS youngest_age
FROM students;

SELECT MAX(age) AS oldest_age
FROM students;

SELECT
    COUNT(*) AS total_students,
    SUM(fee_paid) AS total_fees,
    AVG(age) AS average_age,
    MIN(age) AS youngest_age,
    MAX(age) AS oldest_age
FROM students;