/*

Task 4: Custom Asynchronous Utility Function 
Goal: Write a higher-order function that accepts and triggers an asynchronous callback.
 */
 
console.log("Start");

function delay(callback,time){
    setTimeout(()=>{
        callback("Asyncchronous completed")
    },time)
}


delay((message)=>{
    console.log(message);
},4000);

console.log("End");