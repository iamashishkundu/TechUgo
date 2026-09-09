/*
Task 4: Chaining Methods

Given an array of numbers, use .filter() and .map() together to select values that meet a condition and then transform the selected values.
*/

let students = [{"name":"Ashish","marks":80,},{"name":"Aryan","marks":2,},{"name":"Aditya","marks":50,},{"name":"Arjun","marks":20,},{"name":"karan","marks":90,}];

let graceMarks = students.filter(student=>student.marks<30)
.map(std=>{
    std.marks+=10
    return std;
});

console.log(`Grace Marks provided to ${graceMarks.map(st=>st.name)} `);