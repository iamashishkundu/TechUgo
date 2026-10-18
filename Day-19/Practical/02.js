
import express from "express";
import pool from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.patch("/api/students/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const allowedFields = ["name", "age", "city", "fee_paid"];

        const entries = Object.entries(req.body)
            .filter(([field]) => allowedFields.includes(field));

        if (entries.length === 0) {
            return res.json({
                success: false,
                error: "No valid fields provided"
            });
        }

        const updates = entries.map(([field]) => `${field} = ?`);
        const values = entries.map(([, value]) => value);

        values.push(id);

        const [result] = await pool.execute(
            `UPDATE students SET ${updates.join(", ")} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            const [rows] = await pool.execute(
                "SELECT id FROM students WHERE id = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    error: "Student not found"
                });
            }
        }

        return res.json({
            success: true,
            message: "Student updated successfully"
        });

    } catch (err) {
        console.error("Database error:", err);

        return res.json({
            success: false,
            error: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});