function logger(req,res,next){
    const startTime = Date.now();
    res.on("finish",()=>{
        const latency = Date.now()-startTime;
        console.log(`log: ${req.method}/${req.path} | Status: ${req.statusCode} | ${latency}ms`);

    });
    next();

}

export default logger;