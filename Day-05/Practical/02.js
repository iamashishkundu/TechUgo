/*
Task 2: Pass/Fail Split with .filter()

Given an array of student marks, use .filter() to create separate arrays for students who passed and failed. Do not use loops or .push().
*/
let students = [{"name":"Ashish","marks":80,},{"name":"Aryan","marks":2,},{"name":"Aditya","marks":50,},{"name":"Arjun","marks":20,},{"name":"karan","marks":90,},];

let pass = students.filter(student=>student.marks>=30);
let fail = students.filter(student=>student.marks<30);

console.log(pass.map(st=>st.name));
console.log(fail.map(st=>st.name));