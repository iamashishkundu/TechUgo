/*

Task 4: Your First INNER JOIN 
Goal: Retrieve combined records showing student names alongside their course title and instructor.
 */

use school_db;

select s.name , c.course_name , c.instructor
from students s
INNER JOIN
courses c
on s.course_id = c.id;
