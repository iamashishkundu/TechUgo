/*
 
Task 3: Assign Students to Courses 
Goal: Link existing student rows to specific course IDs.
 */

USE school_db;

UPDATE students SET course_id = 1 WHERE id IN (1, 6, 11);
UPDATE students SET course_id = 2 WHERE id IN (2, 7, 12);
UPDATE students SET course_id = 3 WHERE id IN (3, 8);
UPDATE students SET course_id = 4 WHERE id IN (4, 9);
UPDATE students SET course_id = 5 WHERE id IN (5, 10);