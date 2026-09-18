/*
Task 7: Request Timeout Racing 
Goal: Prevent hanging asynchronous calls by enforcing strict time limits.
 
*/
function fetchData(){
    
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve("Data Received.");
        },3000);
       
    })
}

function timeOut(){
   
    return new Promise((resolve,reject)=>{
         setTimeout(()=>{
            reject(new Error("Request Time Out."));
         },1000);
        
    })
}

async function check(){
    try{
    let result = await Promise.race([fetchData(),timeOut()]);
    console.log(result);
}catch(err){
    console.log(err);
}
}

check();