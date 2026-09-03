/*
Exercise 3: Simple Arithmetic Calculator
 Declare two numbers: const num1 = 20; and const num2 = 4;.
 Create variables to store:
 Addition (+)
 Subtraction (-)
 Multiplication (*)
 Division (/)
 Use a template literal (backticks) to log a formatted message for each:
 
*/

const num1 = 20;
const num2 = 4;

const sum = num1 + num2;
const difference = Math.abs(num1-num2);
const multiply = num1 * num2;
const divide = num1/num2;

console.log(`Addition = ${sum}`);
console.log(`Subtraction = ${difference}`);
console.log(`Multiplication = ${multiply}`);
console.log(`Division = ${divide}`);