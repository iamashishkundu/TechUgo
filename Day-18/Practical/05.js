
import express from "express";
import pool from "./db.js";
import validateStudentId from "./validateStudentId.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/students/:id", validateStudentId, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            "SELECT * FROM students WHERE id = ? AND is_deleted = FALSE",
            [id]
        );

        if (rows.length === 0) {
            return res.json({
                success: false,
                message: "Student not found"
            });
        }

        return res.json({
            success: true,
            data: rows[0]
        });

    } catch (err) {
        console.error("Database error:", err);

        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});