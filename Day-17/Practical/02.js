import express from "express";

const app = express();

const PORT =3000;

app.get("/user/:id",(req,res)=>{
    const id = req.params.id;
    const {name , age} = req.query;
    res.json({id,name,age});
});

app.listen(PORT,()=>{
    console.log(`Server listening on Port ${PORT}`);
});