 /*
Task 1: Delayed Execution Engine 
Goal: Practice setTimeout, passing parameters through timers, and clearTimeout.
 */


function delayedPrint(message,time){
    let print = setTimeout(()=>{
        console.log(message);
    },time)
    if(time>5000){
        clearTimeout(print);
    }
}

delayedPrint("Hello",6000);

