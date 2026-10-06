T1: Why is app.use(express.json()) necessary before route definitions?

sol: So that it will be used by every route and in every route we can access our json body,

T2: Predict the extracted values from req.params and req.query:

```js
app.get("/api/courses/:courseId/students", (req, res) => { ... });
```

sol: req.params -> courseId

T3: What is the bug in this async route handler?

```js
app.get("/api/students/:id", async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM students WHERE id = ?", [req.params.id]);
  if (rows.length === 0) {
    res.status(404).json({ error: "Student not found" });
  }
  res.status(200).json(rows[0]);
});
```

sol: function cant send two res so in first res it must return at that time.

T4: How should database errors be caught inside Express routes?

sol: Use try, catch inside an async route handler to catch database errors then pass the error to Express error handling middleware using next(err) or handle the response directly.