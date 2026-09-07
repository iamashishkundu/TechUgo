/*
 
Task 2: Bill Splitter with Default Tip (day3_task2.js)
Goal: Practice multiple parameters, default values, and returning math.
*/

function splitter(n,sum,tip=500){
    let total = sum + tip;
    return (total/n);
}

let people =4;
let bill = 5000;

let split = splitter(people,bill);
console.log(`split for each person is ${split}`);
