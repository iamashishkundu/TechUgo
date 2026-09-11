/*
Task 1: The Factory Function 
Goal: Write a function that returns newly created objects without accidental mutations.
*/

function createStudent (name,age,gender){
    return{
        name:name,
        age:age,
        gender:gender,
    }
}
const student1 = createStudent("Ashish",25,"Male");
const student2 = createStudent("Aryan",22,"Male");
const student3 = createStudent("Ankita",19,"Female");

console.table(student1);
console.table(student2);
console.table(student3);