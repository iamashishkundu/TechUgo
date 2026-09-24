Day-15(23/09/2026)

## Sorting Records (ORDER BY)

It sorts the rows in accending by default and DESC ie descending applied to the column returned by select

eg:
```sql
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age DESC;
```

Without Order by it is not gauranted that it will be returned in the insertion order , might happen in small table but not in large data.

sorting by the multiple columns will be used if there is tie in the first column

eg:
```sql
SELECT * FROM users ORDER BY age DESC, name ASC;
```

if age is same then by name they will be sorted , simillarly we can use more than 2 also if we want.

We can sort with the column which is not even in the output ie. we can be choosy what we want to show internally it uses the column through which we want to sort.

eg:
```sql
SELECT name, email FROM users ORDER BY age DESC;
```

Instead of giving column name we can give the position of the selected column also but generally not preffered

eg:
```sql
SELECT name, email, age FROM users ORDER BY 3 DESC;  -- sorts by the 3rd selected column (age)
```

`LIMIT`: Limits the rows upto given no.
`OFFSET`: skip upto the given no.

**LIMIT and ORDER BY combined:**
```sql
SELECT name, score FROM players ORDER BY score DESC LIMIT 3; -- top 3 highest scorers
```

**OFFSET and LIMIT combined:**
```sql
SELECT * FROM users ORDER BY id LIMIT 5 OFFSET 10;  -- will skip the first ten and then give comming 5's
```

as the data increase then OFFSET is not recommended bcz it will have to go through that large no. of skipped first then return the result so the performance degrades

## Text Searching with Wildcards (LIKE):

`LIKE`: It performs pattern based text matching using wildcards. It is case insensitive.

eg:
```sql
SELECT * FROM users WHERE name LIKE 'Alex';     -- name = 'Alex' no wildcards used yet
```

**Wildcards:**

1: `%`

```sql
SELECT * FROM users WHERE name LIKE 'A%';   -- starts with "A" -> This is faster  bcz internally uses algo and have smaller dataset as compared.
SELECT * FROM users WHERE name LIKE '%x';    -- ends with "x"  -> This is slower as compared bcz it will go through every set
SELECT * FROM users WHERE name LIKE '%le%';  -- CONTAINS "le" anywhere
```

2: `_`

```sql
SELECT * FROM users WHERE name LIKE 'J_n';  -- matches "Jan",etc
```

## Aggregate Functions:

It performs the calc. on the selected rows and give the single value instead of a row which is in a normal SELECT.

1: `COUNT()`: Counting
```sql
SELECT COUNT(*) FROM users;  -- total number of rows in the table
```

2: `SUM()`:
```sql
SELECT SUM(price) FROM orders WHERE status = 'completed';
```

3: `AVG()`:
```sql
SELECT AVG(age) FROM users;
```

4: `MIN()` and `MAX()`: smallest and largest values, they can operate on more than no. like DATE/DATETIME, text.
```sql
SELECT AVG(age) FROM users;
```

aggregate functions IGNORE NULL values (except COUNT(*))

**Combining multiple aggregates in one query:**
`AS`: to store the value in

```sql
SELECT 
  COUNT(*) AS total_orders,
  SUM(price) AS total_revenue,
  AVG(price) AS average_order_value,
  MAX(price) AS largest_order
FROM orders
WHERE status = 'completed';
```

## Grouping Data (GROUP BY) :

GROUP BY splits rows into group based on their shared column value and then allow us to apply aggregate functions to each group seprately.

ex:
```sql
SELECT category, COUNT(*) FROM products GROUP BY category;
```

every non-aggregated column in SELECT MUST appear in GROUP BY

ex:
```sql
SELECT category, name, COUNT(*) FROM products GROUP BY category;  --  ERROR "name" is not  aggregated and is not in GROUP BY
```

`HAVING`: It filters group after aggregation happened.unlike WHERE which filter before aggregation.

ex:
```sql
SELECT category, COUNT(*) AS product_count
FROM products
GROUP BY category
HAVING product_count > 10;    -- only show categories with MORE than 10 products
```

ex:
```sql
SELECT category, AVG(price) AS avg_price
FROM products
WHERE in_stock = TRUE        
GROUP BY category              
HAVING avg_price > 50;         
```

## Safely Passing Values from Node.js (Parameterized Placeholders):

The main motive to use placeholders(?) is to protect from sql injection and string interpolation.

```js
const [rows] = await pool.query(
  "SELECT * FROM users WHERE email = ? AND age > ?",
  [userEmail, minAge]
);
```

Array is used bcz it works sequentially and indexing
Every dynamic value in a query should be parameterized not just ones from untrusted sources.
placeholders work for values but not for table/column names themselves.

**Named Placeholder:** alternative for queries with many positional parameters,paired with an object instead of an array.

```js
const [rows] = await pool.query(
  "SELECT * FROM users WHERE name = :name AND age > :age",
  { name: "Ashish", age: 25 }
);
```