 Day-05(09/09/2026)

functions which recieve function as Parameters(Dummy) are called First Class Function 

functions which are passed as Argument(Real) are called Callbacks. It controls when to call , how many times and with what arguments. 
ex-
button.addEventListener("click", function() {
  console.log("Button was clicked!");
});

A callback can be both synchronous and Asynchronous 

This: It behaves differently in strict and non strict mode

In Global Scope - depends on global object as in which we are running the code ex- Window in browser and global in node
ex- console.log(this);  // Window
Function Scope -  

ex-
function x(){
    console.log(this);  
}

x();    // will be undefined (strict) but in non-strict mode (this substitution) : If the value of this keyword is undefined or null , this keyword 
            will be replaced with global object only in non-strict mode

//This keyword value depends on how function is called
window.x(); // window in both modes

Method : when we make function as a part of an object

Inside Object's Method:

const obj ={
    a:10,
    x:function () {
        console.log(this.a);    //10
    },
};
obj.x(); // as it is called using obj. if not then undefined

Call/Apply/Bind Methods (sharing methods):
const student = {
    name: "Ashish",
    printName: function () {
        console.log(this.name);
    },
}

student.printName();    //Ashish

const student2 = {
    name: "Kundu",
}

//But if we have to print the name of student2 we have to use sharing methods as printing name depends on this keyword which can be over-ride
student.printName.call(student2); // Kundu  value of this = student2

Arrow functions: they dont provide their own This keyword binding.
                 It gets its value from enclosing lexical context {point towards -1's  scope or directly -2 will be this pointing towards}
ex-
const obj = {
    a:10,
    x:()=>{
        console.log(this);
    },
}
obj.x();    //window

This keyword inside nested arrow function
ex-

const obj2 = {
    b:10,
    y:()=>{
        console.log(this.b);
    },
}
obj2.y();   //10


This keyword inside DOM elements => reference to HTML element in which used



Callbacks and This :

const user = {
  name: "Ashish",
  greetLater: function() {
    setTimeout(function() {
      console.log(`Hello, ${this.name}`); //  undefined - regular function, this isn't user
    }, 1000);
  }
};

user.greetLater(); // "Hello, undefined"

So here function is called using user. so this keyword must point towards user But here setTimeout doesn't call your function like 
user.callbackFunction(). Internally, it just calls it plain. something closer to callbackFunction(), with no object before a dot at all. 

const user2 = {
  name: "Kundu",
  greetLater: function() {
    setTimeout(() => {
      console.log(`Hello, ${this.name}`); //  "Hello, Kundu" - arrow function inherits `this` from greetLater's scope {simply -2 scope}
    }, 1000);
  }
};

user2.greetLater(); // "Hello, Kundu"




Map : takes an array , runs a callback func. on every element and return a new array

It can recieve 3 (arguments element, index, array).It always return the new array of same length

Map vs forEach

const numbers = [1, 2, 3];

const forEachResult = numbers.forEach(n => n * 2);
console.log(forEachResult); // undefined - forEach ALWAYS returns undefined

const mapResult = numbers.map(n => n * 2);
console.log(mapResult); // [2, 4, 6] - map returns the transformed array

Filter : same as map but callback return only those element with truthy value.

filter() on an array that matches nothing returns an EMPTY array, not undefined or null


Find : searches in an array and return the first truthy element value without checking rest.

if no match found returns undefined, NOT an error or null