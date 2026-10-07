import  "dotenv/config";

function auth(req,res,next){
    const apiKey = req.headers["x-api-key"];

    if(!apiKey || apiKey !== process.env.API_KEY){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }
    next();

}

export default auth;