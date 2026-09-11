/*
Task 7: The Capstone Project — Terminal Gradebook Engine 
Combine all of today's functions and logic into a single production-style terminal application.
*/

function createStudent(name, age, marks) {

    return {
        name: name,
        age: age,
        marks: marks
    };

}


function calcAverage(arr, start, end) {

    let n = arr.length;

    if (n === 0) {
        return null;
    }

    if (start > end) {
        return null;
    }

    if (start < 0 || start >= n) {
        return null;
    }

    if (end < 0 || end >= n) {
        return null;
    }

    let total = 0;

    for (let i = start; i <= end; i++) {
        total += arr[i];
    }

    return total / (end - start + 1);
}


function getGrade(marks) {

    if (marks < 0 || marks > 100) {
        return "Invalid Marks";
    }

    if (marks >= 90) {
        return "A";
    }
    else if (marks >= 80) {
        return "B";
    }
    else if (marks >= 70) {
        return "C";
    }
    else if (marks >= 60) {
        return "D";
    }
    else {
        return "F";
    }

}


const rawStudents = [

    createStudent("Rahul", 20, [78, 85, 92, 88]),

    createStudent("Amit", 21, [65, 72, 70, 68]),

    createStudent("Priya", 19, [91, 95, 89, 94]),

    createStudent("Neha", 20, [55, 62, 58, 60])

];


const students = rawStudents.map(function(student) {

    let average = calcAverage(
        student.marks,
        0,
        student.marks.length - 1
    );

    let grade = getGrade(average);

    return {
        ...student,
        average: average,
        grade: grade
    };

});



console.log(" ALL STUDENTS \n");

students.forEach(function(student) {

    console.log(
        `${student.name} | Age: ${student.age} | ` +
        `Average: ${student.average.toFixed(2)} | ` +
        `Grade: ${student.grade}`
    );

});


const aStudents = students.filter(function(student) {

    return student.grade === "A";

});

console.log("\n A GRADE STUDENTS \n");

aStudents.forEach(function(student) {

    console.log(student.name);

});



const above80 = students.filter(function(student) {

    return student.average > 80;

});

console.log("\n STUDENTS ABOVE 80 \n");

above80.forEach(function(student) {

    console.log(student.name);

});




const failingStudents = students.filter(function(student) {

    return student.grade === "F";

});

console.log("\n FAILING STUDENTS \n");

failingStudents.forEach(function(student) {

    console.log(student.name);

});




const totalAverage = students.reduce(function(total, student) {

    return total + student.average;

}, 0);

const classAverage = totalAverage / students.length;



const topPerformer = students.reduce(function(top, student) {

    if (student.average > top.average) {
        return student;
    }

    return top;

});



const lowestPerformer = students.reduce(function(lowest, student) {

    if (student.average < lowest.average) {
        return student;
    }

    return lowest;

});



const passedStudents = students.filter(function(student) {

    return student.grade !== "F";

});



const failedStudents = students.filter(function(student) {

    return student.grade === "F";

});



const passPercentage =
    (passedStudents.length / students.length) * 100;



const gradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
};


students.forEach(function(student) {

    gradeDistribution[student.grade]++;

});


console.log("CLASS PERFORMANCE");
console.log(`\nClass Average: ${classAverage.toFixed(2)}`);

console.log("\nTop Performer:");
console.log(
    `${topPerformer.name} - ` +
    `${topPerformer.average.toFixed(2)} - ` +
    `${topPerformer.grade}`
);

console.log("\nLowest Performer:");
console.log(
    `${lowestPerformer.name} - ` +
    `${lowestPerformer.average.toFixed(2)} - ` +
    `${lowestPerformer.grade}`
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