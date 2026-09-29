/*

Task 1: Create the Parent courses Table
Goal: Create the parent table and populate it with course offerings.
*/

use school_db;
CREATE TABLE IF NOT EXISTS courses(
id INT auto_increment PRIMARY KEY,
course_name varchar(100) not null,
instructor varchar(100) not null
);

insert into courses(course_name,instructor)
values
	('JavaScript', 'Rahul Sharma'),
    ('Python', 'Amit Verma'),
    ('Java', 'Neha Kapoor'),
    ('SQL', 'Vikram Singh'),
    ('React', 'Priya Mehta');

