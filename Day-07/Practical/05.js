/*
Task 5: Class Query Filters 
Goal: Run advanced search and categorization queries on the enriched dataset.
*/


const students = [
    {
        name: "Rahul",
        marks: [78, 85, 92, 88],
        average: 85.75,
        grade: "B"
    },
    {
        name: "Amit",
        marks: [65, 72, 70, 68],
        average: 68.75,
        grade: "D"
    },
    {
        name: "Priya",
        marks: [91, 95, 89, 94],
        average: 92.25,
        grade: "A"
    },
    {
        name: "Neha",
        marks: [55, 62, 58, 60],
        average: 58.75,
        grade: "F"
    }
];



const aGradeStudents = students.filter(function(student) {
    return student.grade === "A";
});

console.log("A Grade Students:");

aGradeStudents.forEach(function(student) {
    console.log(student.name);
});


const studentsAbove80 = students.filter(function(student) {
    return student.average > 80;
});

console.log("\nStudents Above 80:");

studentsAbove80.forEach(function(student) {
    console.log(student.name);
});



const failingStudents = students.filter(function(student) {
    return student.grade === "F";
});

console.log("\nFailing Students:");

failingStudents.forEach(function(student) {
    console.log(student.name);
});


const studentsBetween70And90 = students.filter(function(student) {
    return student.average >= 70 && student.average <= 90;
});

console.log("\nStudents Between 70 and 90:");

studentsBetween70And90.forEach(function(student) {
    console.log(student.name);
});


const searchName = "Rahul";

const foundStudent = students.filter(function(student) {
    return student.name.toLowerCase() === searchName.toLowerCase();
});

console.log("\nStudent Search:");

if (foundStudent.length > 0) {
    foundStudent.forEach(function(student) {
        console.log(
            `${student.name} | Average: ${student.average} | Grade: ${student.grade}`
        );
    });
} else {
    console.log("Student not found.");
}