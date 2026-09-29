T1: What happens if you run this query when the courses table only has IDs 1 and 2?

```sql
INSERT INTO students (name, course_id) VALUES ('Deepak', 5);
```

sol:
If these include foreign key referencing then the insert will fail Otherwise The value will be stored simply but reference wont work which is called orphaned Record.

T2: What is the difference between an INNER JOIN and a LEFT JOIN in this specific scenario?

sol:
INNER JOIN: Deepak will not appear
LEFT JOIN: Deepak will appear but it will refer to null

T3: Predict the console output of this query structure:

```sql
SELECT 
  s.name, 
  c.course_name 
FROM students AS s
INNER JOIN courses AS c ON s.course_id = c.id
WHERE c.course_name = 'Python';
```

sol:
It will print name, course_name of students whose course_id matches a course with the name Python.

T4: What is an "Orphaned Record"?

sol: When it is referencing the table where its record doesnt exist.