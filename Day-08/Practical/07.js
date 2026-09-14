/*
 
Task 7: Sensitive Data Stripper
Goal: Use the rest pattern during destructuring to sanitize records.
*/

const user ={
    name:"Ashish",
    age:25,
    email:"ashishkundu@gmail.com",
    password:"Ashish*123",
}

const{password,...safeUser}=user;
console.log(safeUser);
