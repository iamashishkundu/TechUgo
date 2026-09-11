/*
Task 2: Safe Configuration Getter 
Goal: Combine bracket notation, the in operator, and default fallbacks.
*/


const student = {
    firstName:"Ashish",
//  lastName:"Kundu",
    age:23,
    gender:"Male",
    bloodGroup:"B+",
    rollNo:1551,
};

console.log(`Age of ${student["firstName"]} is ${student["age"]}.`); 

const property = "lastName";

if (property in student) {
    console.log(`${student["firstName"]} has last name as ${student[property]}.`);
} else {
    const defaultLastName = "Unknown";
    console.log(`${student["firstName"]}'s last name is ${defaultLastName}.`);
}