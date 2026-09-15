/*
Task 3: The Blocking Loop Demonstration 
Goal: Prove experimentally that long-running synchronous code blocks the Event Loop.
 */
 
console.log("Start");
let i =0;
while(i<10000000000){
    i++;
}
console.log("End");