 /*
Task 1: Basic & Renamed Object Destructuring 
Goal: Extract properties directly into clean variable names.
*/

let person={
    "name": "ashish",
    "age": 25,

};

let { name, age:umar=22 , gender="Male"}=person; //renaming and default , default
console.log(name,umar,gender);