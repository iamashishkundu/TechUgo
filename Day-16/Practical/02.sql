/*

Task 2: Update students Table with a Foreign Key 
Goal: Link the existing students table to the courses table.
*/

USE school_db;

ALTER TABLE students
ADD COLUMN course_id INT;

ALTER TABLE students
ADD CONSTRAINT fk_students_course
FOREIGN KEY (course_id)
REFERENCES courses(id);