
import pool from "./db.js";

async function setupSoftDelete() {
    try {
        await pool.execute(`
            ALTER TABLE students
            ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE
        `);

        console.log("Soft-delete column added successfully.");
    } catch (err) {
        console.error("Setup failed:", err.message);
    } finally {
        await pool.end();
    }
}

setupSoftDelete();