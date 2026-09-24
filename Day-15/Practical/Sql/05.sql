USE school_db;

SELECT
    city,
    COUNT(*) AS total_students
FROM students
GROUP BY city;

SELECT
    city,
    SUM(fee_paid) AS total_fees
FROM students
GROUP BY city;

SELECT
    city,
    AVG(age) AS average_age
FROM students
GROUP BY city;

SELECT
    city,
    MIN(age) AS youngest_age,
    MAX(age) AS oldest_age
FROM students
GROUP BY city;

SELECT
    city,
    COUNT(*) AS total_students,
    SUM(fee_paid) AS total_fees,
    AVG(age) AS average_age,
    MIN(age) AS youngest_age,
    MAX(age) AS oldest_age
FROM students
GROUP BY city;