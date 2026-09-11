/*
Task 3: Grade Scale Mapping Function
Goal: Implement strict boundary conditionals inside a pure function.
*/

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

let marks = [95, 87, 74, 63, 45, 90, 80, 70, 60, 59, -5, 105];

for (let mark of marks) {
    console.log(`${mark} => ${getGrade(mark)}`);
}