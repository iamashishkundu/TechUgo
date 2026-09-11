/*
Task 6: Class Performance Analytics 
Goal: Calculate aggregate summary statistics across an entire group.
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




let totalAverage = students.reduce(function(total, student) {
    return total + student.average;
}, 0);

let classAverage = totalAverage / students.length;




let topPerformer = students.reduce(function(topStudent, student) {

    if (student.average > topStudent.average) {
        return student;
    }

    return topStudent;

});



let lowestPerformer = students.reduce(function(lowestStudent, student) {

    if (student.average < lowestStudent.average) {
        return student;
    }

    return lowestStudent;

});



let gradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
};

students.forEach(function(student) {
    gradeDistribution[student.grade]++;
});



let passedStudents = students.filter(function(student) {
    return student.grade !== "F";
});

let failedStudents = students.filter(function(student) {
    return student.grade === "F";
});



let passPercentage =
    (passedStudents.length / students.length) * 100;



console.log("CLASS PERFORMANCE");

console.log(`\nClass Average: ${classAverage.toFixed(2)}`);

console.log("\nTop Performer:");
console.log(
    `${topPerformer.name} - ${topPerformer.average.toFixed(2)} (${topPerformer.grade})`
);

console.log("\nLowest Performer:");
console.log(
    `${lowestPerformer.name} - ${lowestPerformer.average.toFixed(2)} (${lowestPerformer.grade})`
);

console.log("\nGrade Distribution:");
console.log(`A: ${gradeDistribution.A}`);
console.log(`B: ${gradeDistribution.B}`);
console.log(`C: ${gradeDistribution.C}`);
console.log(`D: ${gradeDistribution.D}`);
console.log(`F: ${gradeDistribution.F}`);

console.log(`\nPassed: ${passedStudents.length}`);
console.log(`Failed: ${failedStudents.length}`);
console.log(`Pass Percentage: ${passPercentage}%`);