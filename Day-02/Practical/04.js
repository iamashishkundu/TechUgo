/*

 
Task 4: Truthy/Falsy Input Checker (day2_task4.js)
 
Goal: Master truthy and falsy checks.
 Declare a variable inputName = "".
 Write an if / else condition checking inputName:
 If truthy, print: "Input accepted: <name>".
 If falsy, print: "Error: No name provided.".
 Test it with "", then test it with "Alex".

 */

 var inputName = "Alex";

 if(inputName.trim().length){
    console.log(`Input accepted: ${inputName}`);
 }else{
    console.log(`Error: No name provided.`)
 }