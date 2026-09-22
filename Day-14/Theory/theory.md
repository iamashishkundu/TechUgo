Day-14(22/09/2026)

## Database:

Database is used to design, store, retrive, survive restarts, manage data.

The database provides Persistence, Structure, Concurrent access, Querying.

**Relational Database:** Where data is stored in rows and columns with defined relation bw tables.
There are 4 types of relation:
- one to one
- one to many
- many to one
- many to many

**Non Relational Databases:** where data is stored in more flexible formats more close to json documents.

The reasons why we cant use json files:
1. Race Condotions
2. Everything requires loading the entire file into memory before querying
3. No enforced structure or data integrity
4. Performance collapses as the file grows
5. No safe way to handle partial failures

### Core Data Types:

**Numeric Types:**

| Type | Description |
|---|---|
| INT | -2 billion to 2 billion |
| BIGINT | much biggger |
| DECIMAL(10,2) | safe for currency |
| FLOAT/DOUBLE | unsafe uses approximation |

**String Types:**

| Type | Description |
|---|---|
| VARCHAR(255) | variable length automatically adjusts after assiggning,flexible |
| CHAR(2) | fixed , will use the exact mentioned even u store or not , ex: country code like IN,US |
| TEXT | generally used for large texts like description, articles |

**Date and Time Types:**

| Type | Description |
|---|---|
| DATE | just a date ex. "2026-09-19" |
| TIME | just a time ex. "14:30:00" |
| DATETIME | both together ex. "2026-09-19 14:30:00" |
| TIMESTAMP | similar to DATETIME but different in how it handles time zones internally |

**Boolean:**

| Type | Description |
|---|---|
| BOOLEAN | MySQL stores this as TINYINT(1) internally 0 or 1 |

**Primary Key** : It is a column or group of column which is unique to identify a unique row. any table can have only one primary key.we can't insert any duplicate or null value in it.

**AUTO_INCREMENT** : automatically generating primary key in increasing order for us and if in between any entry is deleted then its primary key value cant be reused it will be skipped.

### CRUD:

| Operation | SQL |
|---|---|
| Create | INSERT |
| Read | SELECT |
| Update | UPDATE |
| Delete | DELETE |

eg:

```sql
INSERT INTO tasks (title, completed) VALUES ('Buy groceries', FALSE);

SELECT * FROM tasks WHERE completed = FALSE;

UPDATE tasks SET completed = TRUE WHERE id = 3;

DELETE FROM tasks WHERE id = 3;
```

### Node communication with mysql:

Always define a pool instead of using a connection bcz it will let different users to handle it concurrently. In pool we always recieve and send data in array format. also we use parameterised queries (?) so that the sql injections can be prevented. as it tells specifically to use it as a value not a sql command to run to prevent string interpolation.

```js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "myapp",
  connectionLimit: 10 // maintains up to 10 reusable connections
});

const [users] = await pool.query("SELECT * FROM users");
```

instead of defining pool in every file we can imoprt it from a seprate defined file

eg:
```js
import express from "express";
import pool from "./db.js";

const app = express();
app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});
```