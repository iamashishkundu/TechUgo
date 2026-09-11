/*
Task 4: Enriching Objects with .map()

Goal: Combine Task 2 and Task 3 into an immutable transformation pipeline.

*/

function calcAverage(arr, start, end) {

    let n = arr.length;

    if (n === 0) {
        return "Array cannot be empty";
    }

    if (start > end) {
        return "Invalid Start and End value.";
    }

    if (end >= n || end < 0) {
        return `Invalid End value. It must be between 0 and ${n - 1}`;
    }

    if (start >= n || start < 0) {
        return `Invalid Start value. It must be between 0 and ${n - 1}`;
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


const students = [
    {
        name: "Rahul",
        marks: [78, 85, 92, 88]
    },
    {
        name: "Amit",
        marks: [65, 72, 70, 68]
    },
    {
        name: "Priya",
        marks: [91, 95, 89, 94]
    },
    {
        name: "Neha",
        marks: [55, 62, 58, 60]
    }
];

const enrichedStudents = students.map(function(student) {

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


enrichedStudents.forEach(function(student) {
    console.log(
        `${student.name} | Average: ${student.average.toFixed(2)} | Grade: ${student.grade}`
    );
});