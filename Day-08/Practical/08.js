/*
 
Task 8: Capstone Mini-Engine — Payload Normalizer (day8_task8.js)
Goal: Combine destructuring, renaming, defaults, spread, rest, and shorthand.
*/

const user={
    name:"Ashish",
    email:"ashishkundu@gmail.com",
    age:25,
    gende:"Male",

};

const{name:firstName,email,autoSave=true,...basic}=user;

const user2={firstName, email,autoSave,...basic};
console.log(user2);