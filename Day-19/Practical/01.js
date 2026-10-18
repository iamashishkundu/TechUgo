import express from "express";
import pool from "./db.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.put("/api/students/:id",async(req,res)=>{
    try{
    const id = req.params.id;
    const {name,age,city,fee_paid} = req.body;

    if(
        !Number.isInteger(Number(id)) ||
        Number(id)<=0 ||
        typeof(name) !== "string" ||
        name.trim() === "" ||
        !Number.isInteger(Number(age)) ||
        Number(age)<=0 ||
        typeof(city) !== "string" ||
        city.trim() === "" ||
        typeof(fee_paid) !== "number" ||
        fee_paid < 0
    ){
        return res.json({
            success: false,
            error: "Invalid input. Provide a valid ID, name, age, city, and fee_paid."

        });
    }

    const [result]=await pool.execute(`update students set name = ?, age = ?, city = ?, fee_paid = ? where id = ? `, [name.trim(), age, city.trim(), fee_paid, Number(id)]);

    if(result.affectedRows === 0){
            return res.json({
                success: false,
                error: "Student not found"
            });
    }

    
    return res.json({
        success: true,
        message: "Student updated successfully"
    });
    }catch (err) {
        console.error("Database error:", err);

        return res.json({
            success: false,
            error: "Internal server error"
        });
    }

});

app.listen(PORT,()=>{
    console.log(`Server listening on Port ${PORT}`);
});