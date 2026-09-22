**Q1:** What is the difference between a Database and a Table?

**sol:** A table consist of rows and column but in database we can have as many as tables relational, database helps us to store, style, retrive, survive restart and manage data. mainly database provides Persistence, Structure, Concurrent access, Querying.

---

**Q2:** What is a `PRIMARY KEY`, and why is it bad practice to use a user's name as a primary key?

**sol:** a primary key is a column or a group of column to identify a row uniquely. a table can have only one primary key. and it is bad to use a user's name as a primary key bcz user's can have same name and we cant have the duplicate values in primary key.

---

**Q3:** What does the asterisk (`*`) mean in `SELECT * FROM students;`?

**sol:** `*` means all columns. So `SELECT * FROM students` retrieves all columns and all rows from the students table.

---

**Q4:** What is the danger of running this command: `DELETE FROM users;`? How do you fix it?

**sol:** it will delete all rows from the users table to fix it we must have to use the `where` clause to specify the cond properly.