Day-18(05/10/2026)

## Completing the CRUD Cycle: Updating and Deleting

We can simply update and delete using req handler to extract info then by using SQL queries to make the changes possible but there are some
edge cases:

1: DELETE's foreign key interaction
```js
if (err.code === "ER_ROW_IS_REFERENCED_2") {
  return res.status(409).json({ error: "Cannot delete — customer has existing orders" });
}
```

2: UPDATE with a partial body: So here if we didnt give the email then it is undefined which will further set to null causing the problem that it will make the existing email set to null bcz here we are deleberately setting both name and email

```js
const [result] = await pool.query(
  "UPDATE users SET name = ?, email = ? WHERE id = ?",
  [req.body.name, req.body.email, id] // req.body.email is undefined 
);
```

### PUT vs PATCH: Total Replacement vs Partial Modification

`PUT`: It modifies everthing so we need to send every data otherwise it will set those to null.
`PATCH`: It modifies only the selected data so we dont need to send whole data, It is preffered where small changes matters like dynamic sites.

### Using affectedRows to Drive HTTP Status Codes:

a query can succeed while genuinely doing nothing ie. if the user doesnt exist

```js
if (result.affectedRows === 0) {
  return res.status(404).json({ error: "User not found" }); 
}
```

But on UPDATE query if we are updating with the exact same value then affected rows will return 0
for this edge case we have two fix

1: Update this in conection pool
```js
const pool = mysql.createPool({

  multipleStatements: false,
  
});
```

2: query-level: checking existence seperately from the update, using a dedicated SELECT first

**Choosing the right status code based on affectedRows**

| Operation | affectedRows | Status Code |
|---|---|---|
| UPDATE/DELETE | 0 (no match found) | 404 Not Found |
| UPDATE/DELETE | 1 or more (success) | 200 OK (or 204 for DELETE) |
| INSERT | 1 (success) | 201 Created |
| Any query | Throws an error | 500 Server Error |

## The Express Middleware Pipeline:

The request follow the exact sequential order they were registered, every middleware function has next which will send us to next function if didnt called then the requrst will be hung there

Passing data forward through the pipeline by attaching properties to req

ex:
```js
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

app.get("/users", (req, res) => {
  console.log(req.requestTime);
  res.send("Users");
});
```

**Errors in the pipeline:** next(err) skips directly to error handling middleware

if next(err) is called in any request then it will directly fall into the error handling middleware which have 4 arguments (err, req, res, next)

### Types of Middleware in Express:

1: Application level middleware: applied via app.use() or app.METHOD()

ex:
```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

2: Router level middleware: identical but scoped to an express.Router() instance

ex:
```js
router.use((req, res, next) => { 
  console.log("router specific middleware");
  next();
});
```

3: Built in middleware: comes directly with Express no separate installation needed

ex:
```js
app.use(express.json());          
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));   
```

4: Third party middleware: installed via npm

ex:
```js
import cors from "cors";
import cookieParser from "cookie-parser"; 

app.use(cors());      
app.use(cookieParser());
```

5: Route specific middleware: applied to just ONE route

ex:
```js
app.get("/profile", requireAuth, (req, res) => { 
  res.json({ user: req.user });
});
```

ex: Multiple route-specific middleware chained together
```js
app.post("/admin/users", requireAuth, requireAdminRole, createUserHandler);
```

6: Error-handling middleware

ex:
```js
app.use((err, req, res, next) => { 
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});
```

7: Built in Express error handling : If we didnt apply any custom error handling even then express has its own defalut error handling which responds with a generic 500