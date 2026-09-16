/*
Task 1: Basic Promise Construction 
Goal: Practice new Promise, resolve, and reject conditionally.
*/

function check(num){
return new Promise((resolve,reject)=>{
    if(num%2==0){
        resolve("Even no.");
    }
    else{
        reject(new Error("Not Even no."));
    }
})
}

const ans = check(5);
ans.then((result)=>{
    console.log(result);
}).catch((err)=>{
    console.log(err.message);
})