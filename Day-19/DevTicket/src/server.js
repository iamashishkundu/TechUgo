import express from "express";
import logger from "./middleware/logger.js";
import auth from "./middleware/auth.js";
import pool from "../db.js";
import validateTicket from "./middleware/validate.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timeStamp: new Date().toLocaleString()
    });
});

app.get("/api/tickets", auth, async (req, res, next) => {
    try {
        const {
            search,
            priority,
            status,
            page = 1,
            limit = 10
        } = req.query;

        let query = "SELECT * FROM tickets WHERE 1=1";
        const values = [];

        if (search) {
            query += " AND (title LIKE ? OR description LIKE ?)";
            values.push(`%${search}%`, `%${search}%`);
        }

        if (priority) {
            query += " AND priority = ?";
            values.push(priority);
        }

        if (status) {
            query += " AND status = ?";
            values.push(status);
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const offset = (pageNumber - 1) * limitNumber;

        query += " LIMIT ? OFFSET ?";
        values.push(limitNumber, offset);

        const [rows] = await pool.execute(query, values);

        res.status(200).json({
            success: true,
            data: rows
        });

    } catch (err) {
        next(err);
    }
});

app.get("/api/tickets/stats", auth, async (req, res, next) => {
    try {
        const [totalRows] = await pool.execute(
            "SELECT COUNT(*) AS total FROM tickets"
        );

        const [statusRows] = await pool.execute(
            "SELECT status, COUNT(*) AS count FROM tickets GROUP BY status"
        );

        const [priorityRows] = await pool.execute(
            "SELECT priority, COUNT(*) AS count FROM tickets GROUP BY priority"
        );

        res.status(200).json({
            success: true,
            data: {
                total: totalRows[0].total,
                byStatus: statusRows,
                byPriority: priorityRows
            }
        });

    } catch (err) {
        next(err);
    }
});

app.get("/api/tickets/:id", auth, async (req, res, next) => {
    try {
        const id = req.params.id;

        const [rows] = await pool.execute(
            "SELECT * FROM tickets WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (err) {
        next(err);
    }
});

app.post("/api/tickets", auth, validateTicket, async (req, res, next) => {
    try {
        const {
            title,
            description,
            priority = "MEDIUM"
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO tickets (title, description, priority)
             VALUES (?, ?, ?)`,
            [title, description, priority]
        );

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticketId: result.insertId
        });

    } catch (err) {
        next(err);
    }
});

app.patch("/api/tickets/:id/status", auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "OPEN",
            "IN_PROGRESS",
            "RESOLVED",
            "CLOSED"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const [result] = await pool.execute(
            "UPDATE tickets SET status = ? WHERE id = ?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ticket status updated successfully"
        });

    } catch (err) {
        next(err);
    }
});

app.patch("/api/tickets/:id/assign", auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;

        if (!assigned_to) {
            return res.status(400).json({
                success: false,
                message: "assigned_to is required"
            });
        }

        const [result] = await pool.execute(
            "UPDATE tickets SET assigned_to = ? WHERE id = ?",
            [assigned_to, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ticket assigned successfully"
        });

    } catch (err) {
        next(err);
    }
});

app.delete("/api/tickets/:id", auth, async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            "DELETE FROM tickets WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully"
        });

    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


async function startServer() {
    try {
        await pool.query("SELECT 1");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
}

startServer();