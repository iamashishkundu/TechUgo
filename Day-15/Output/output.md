 
T1: What is the output of running this query on a table of 10 students?
SELECT name FROM students ORDER BY age ASC LIMIT 2;

sol: It will display 2 students with lowest age in assecending order.
 
T2: What does LIMIT 3 OFFSET 3 return on a table with 8 rows?

sol: It will give us from row 4 to row 6.

T3: What is the difference between COUNT(*) and SUM(fee_paid)?

sol: COUNT: It is the total no. of rows.
     SUM(fee_paid): It will add every non null fee_paid entry and give us the total.

T4: Predict which names match WHERE name LIKE '%an%':
 "Aman Gupta"
 "Priya Sharma"
 "Rohan Verma"
 
sol: Aman Gupta
     Rohan Verma