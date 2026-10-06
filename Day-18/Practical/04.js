
import express from "express";
import pool from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.patch("/api/students/:id/archive", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            "UPDATE students SET is_deleted = TRUE WHERE id = ? AND is_deleted = FALSE",
            [id]
        );

        if (result.affectedRows === 0) {
            const [rows] = await pool.execute(
                "SELECT id FROM students WHERE id = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    message: "Student not found"
                });
            }

            return res.json({
                success: false,
                message: "Student is already archived"
            });
        }

        return res.json({
            success: true,
            message: "Student archived successfully"
        });

    } catch (err) {
        console.error("Database error:", err);

        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.patch("/api/students/:id/restore", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            "UPDATE students SET is_deleted = FALSE WHERE id = ? AND is_deleted = TRUE",
            [id]
        );

        if (result.affectedRows === 0) {
            const [rows] = await pool.execute(
                "SELECT id, is_deleted FROM students WHERE id = ?",
                [id]
            );

            if (rows.length === 0) {
                return res.json({
                    success: false,
                    message: "Student not found"
                });
            }

            return res.json({
                success: false,
                message: "Student is already active"
            });
        }

        return res.json({
            success: true,
            message: "Student restored successfully"
        });

    } catch (err) {
        console.error("Database error:", err);

        return res.json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.get("/api/students", async (req, res) => {
    try {
        const [rows] = await pool.execute(
            "SELECT * FROM students WHERE is_deleted = FALSE"
        );

        return res.json({
            success: true,
            count: rows.length,
            data: rows
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