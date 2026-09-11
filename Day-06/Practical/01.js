/*
Task 1: Student Record & Updates 
Goal: Practice object literal creation, dot notation, and in-place updates.
 */

const student = {
    name:"Ashish Kundu",
    age:23,
    gender:"Male",
    bloodGroup:"B+",
    rollNo:1551,
}

console.log(`${student.name} previous roll no. is ${student.rollNo} and  updated roll no. is ${student.rollNo=15150}.`);