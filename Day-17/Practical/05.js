
import express from "express";
import pool from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            "SELECT * FROM students WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (err) {
        console.error("Database error:", err);

        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});