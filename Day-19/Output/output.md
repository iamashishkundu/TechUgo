T1: Why must route-level middleware use return res.status(...).json(...) when rejecting bad input?

sol: To avoid the error of sending multiple response

T2: What will print to the console when executing this update flow on a student that does not exist?

```js
app.put("/api/students/:id", async (req, res) => {
  const { name, city } = req.body;
  const [result] = await pool.execute(
    "UPDATE students SET name = ?, city = ? WHERE id = ?",
    [name, city, req.params.id]
  );

  console.log("Affected:", result.affectedRows);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.status(200).json({ success: true });
});
```

sol: Affected: 0

T3: How does Express recognize that a middleware function is specifically an error handler?

sol: It have four arguments (err,req,res,next)

T4: Trace what happens when a route calls next(error):

sol: when it is called the request directly fall backs to the error handling middleware.