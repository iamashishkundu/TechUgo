/*
Task 3: Driving Eligibility (day2_task3.js)
 
Goal: Practice logical operators (&&, ||, !).
A person can legally drive if:
 They are at least 18 years old, AND
 They have a valid license, AND
 They are not suspended.
Create the variables:
 userAge = 20
 hasLicense = true
 isSuspended = false
Write an if / else block:
 If all 3 conditions are satisfied, print: "Allowed to drive."
 Otherwise, print: "Not allowed to drive."
 Change hasLicense to false and run it again to verify your condition fails properly.
 
 
 */

 let userAge=20;
 let hasLicense=false;
 let isSuspended=false;

 if(userAge>=18 && hasLicense && !isSuspended){
    console.log(`Allowed to drive.`);
 }else{
    console.log(`Not allowed to drive.`);
 }