Day-16(24/09/2026)

## Multiple Tables:

They are needed to handle the duplicates and update anomaly.

### Primary Key vs. Foreign Key

Primary key is the column that represent a row uniqueley whereas foreign key is a column in one table that references the primary key of another table. It can have duplicates values. a foreign key column's data type must match the referenced primary key's type.

ex:
```sql
CREATE TABLE customers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100)
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_id INT,
  product_name VARCHAR(100),
  price DECIMAL(10,2),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

`ON DELETED`: controlling happens when we delete the referenced row. By default it is restriced to delete.

`ON DELETE CASCADE`: will delete

```sql
FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
```

`ON DELETE SET NULL`: will set to null instead of deleting

```sql
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
```

`ON DELETE RESTRICT`: The default behaviour

```sql
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
```

### Adding a foreign key to an ALREADY existing table

```sql
ALTER TABLE orders
ADD FOREIGN KEY (customer_id) REFERENCES customers(id);
```

Alter lets us modify the table after its been created.

## JOIN:

It helps us to query data from multiple related tables at once.

**Types:**

1: `INNER JOIN`: default, It gives the common in both tables

ex:
```sql
SELECT orders.id, customers.name, orders.product_name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
```

`ON` : specifying exactly how the two tables relate

**Table aliases:**

```sql
SELECT o.id, c.name, o.product_name
FROM orders o
JOIN customers c ON o.customer_id = c.id;
```

2: `LEFT JOIN`: Include all from left table and only matching from right

ex:
```sql
SELECT customers.name, orders.product_name
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;
```

3: `RIGHT JOIN`: Include all from right table and only matching from left

ex:
```sql
SELECT customers.name, orders.product_name
FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.id;
```

4: `FULL OUTER JOIN`: left join + right join

ex:
```sql
SELECT c.name, o.product_name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id
UNION
SELECT c.name, o.product_name FROM customers c RIGHT JOIN orders o ON c.id = o.customer_id;
```

5: `SELF JOIN`: a table joined to itself

ex:
```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  manager_id INT, -- references ANOTHER row in this SAME table
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

### Joining more than 2 tables

ex:
```sql
SELECT o.id, c.name AS customer_name, p.name AS product_name, o.quantity
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id;
```

### USING:

If both the column names are same then instead of ON we can use USING

ex:
```sql
SELECT * FROM orders JOIN customer_id_map ON orders.customer_id = customer_id_map.customer_id;
SELECT * FROM orders JOIN customer_id_map USING (customer_id);
```