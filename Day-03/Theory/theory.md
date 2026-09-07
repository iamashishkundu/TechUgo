Day 03 (07/09/2026)


Functions are reusable block of code. functions are completely hoisted. they have there own "This". and "This" always point towards how the function is called ie left of the dot .

Arguments are the real values we pass while calling the func.
Parameters are those dummy values while defining the func. 

//  functions declarations
function square(num) {
  return num * num;
}

//  function expression
const square = function (num) {
  return num * num;
};

console.log(square(5));

Arrow functions is a modern way of writing function but they are hoisted same as let/const as they are just equal to an expression and hoisted as undefined . they dont have there own "This" they inherit it (looking in its scope if declared earlier so can use it ) 

// const square =  (num) => {
   num * num;
};

first class function are those which takes other function as the input.
//  first class function 
function square(num) {
  return num * num;
}

function displaySquare(fn) {
  console.log("Square is " + fn(5));
}

displaySquare(square);

//  IIFE (Immediately Invoked Function Expression)
(function square(num) {
  console.log(num * num);
})(5);


Arguments: Instead of reciving long argumentsin parameter we can directly use "arguments." in function which holds all arguments value in array like structure not actual array

Rest paramenters: Modern replacement of Arguments but it holds values in real array form. eg- (...numbers) . It also works in arrow func.
 rest parameter must be the last parameter.

-> all the non primitive data types are passed by reference as they are stored in heap so chaning them will change the original also.

Default parameters: are the default values defined in parameter when no arguments are passed or explicitly undefined passed.

Return: It does two things stop the function moving ahead and returns a value to where the function is called. if nothing returned it will be undefined by default.
BLock: code wrapped inside curly brackets.
and block scope is what can be accesed inside block ex-let/const except var.
