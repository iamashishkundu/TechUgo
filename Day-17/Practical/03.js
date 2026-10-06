import express from "express";
const app = express();
const PORT =3000;

app.use(express.json());

app.post("/user",(req,res)=>{
    const {name,age}=req.body;
    if(name==="Ashish"&&age===23){
       return res.json("User Verified.");
    }else{
        return res.json("User Invalid!");
    }
});

app.listen(PORT,()=>{
    console.log(`Server Listening on Port ${PORT}`);
});