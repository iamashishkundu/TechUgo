import express from "express";
const app =express();
const port =3000;
app.get("/users",(req,res)=>{
    res.json([{id:1,name:"Ashish kundu"}]);
})

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});

