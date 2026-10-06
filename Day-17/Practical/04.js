import express from "express";
import pool from "./db.js";

const app = express();
const PORT =3000;

app.use(express.json());

app.get("/api/students",async(req,res)=>{
    try{
        const{city,age} = req.query;
    let query = "select * from students where 1=1";
    const values =[];

    if(city){
        query +=" and city = ?";
        values.push(city);
    }
    if(age){
        query+=" and age = ?";
        values.push(age);
    }
    const [rows]=await pool.execute(query,values);

    res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        console.error("Database error:", err);
        res.json({
            success: false,
            error: "Internal server error"
        });
    }
});

app.listen(PORT,()=>{
    console.log(`Server Listening on Port ${PORT}`);
});