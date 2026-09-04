Techugo Fullstack Training
Day 01 (03/09/2026)

1. The Terminal and Node.js
Shell, PATH, REPL, Runtime Environment

the terminal is not a programming language it's a program that reads a line of text, interprets it as a command, and executes it.
( eg- bash, PowerShell)
pwd	print working directory, cd <path>	change directory, clear / cls	clear screen, mkdir	make directory

Node.js is a runtime environment. it takes the V8 JavaScript engine and lets it run outside the browser, on your machine or a server, with added capabilities.
That's why Node gives me fs, process, require, stuff to touch the file system and OS, but I lose window and document, since those are browser only APIs, not part of JS itself. Running node file.js executes it once and exits; nodemon watches the file and restarts the process whenever it changes.


2. Declarations: Memory Allocation
Stack vs Heap, Hoisting, Temporal Dead Zone

Every variable we declare has to live somewhere in memory. JavaScript engines (V8) use two main regions:

Stack:
Fixed-size, fast, LIFO (Last In First Out) structure.
Stores primitive values directly: number, string, boolean, undefined, null, symbol, bigint.
Also stores function call frames (this is why it's called a "call stack").
Memory size is known at compile time — fast allocation/deallocation.

Heap:
Large, unstructured region for dynamic memory.
Stores objects, arrays, functions — anything whose size could grow or change.
Slower to access than the stack, but flexible.

var, let, const 

JS execution happens in two  phases:

Creation phase (before any code runs line by line):

The engine scans the scope and allocates memory for every declared variable/function.
var declarations → allocated and initialized to undefined immediately.
let/const declarations → allocated but NOT initialized — they exist in a "Temporal Dead Zone" (TDZ).
Function declarations → allocated and fully hoisted with their entire body.

Execution phase: Code runs top to bottom, actual values get assigned.


3. Data Types and Representation
Primitives, Objects 

Primitive data types are the fundamental building block of data. they are immutable and stored by value. ex- number, string, boolean, undefined, null, symbol, bigint.
Non-Primitives data types are structured data built using primitive data types. they are mutable and stored by reference. ex-  object ( arrays, functions, dates, etc. all fall under).

 There's only one numeric type, represented as 64 bit floating point. Strings are immutable, methods like toUpperCase() return a new string rather than modifying the original. null is an explicitly no value assigned by the programmer. undefined is a declared but unassigned variable. typeof null returns object.

4. Type Inspection
typeof, instanceof, Array.isArray, toString.call

typeof - distinguishes primitives and functions, but every object based value, arrays, dates, plain objects, maps, all return object.
instanceof - checking against a prototype chain. instanceof fails for primitives and arrays 
Array.isArray() — the reliable array check, It checks an internal engine-level flag on the value, not the prototype chain. so it works correctly even across iframes/workers
Object.prototype.toString.call() — this method actually tells the truth. 
ex- console.log(Object.prototype.toString.call([1,2,3]));     // "[object Array]"
 


5. Data Types
Coercion, Conversion, Equality, ToPrimitive

Explicit conversion: you intentionally convert a type using a function.
Implicit coercion: JS converts types automatically behind the scenes, based on the operator/context.

The plus operator checks its operands: if either side is a string, it performs concatenation; otherwise it does numeric addition. Every other arithmetic operator (minus, multiply, divide) always coerces both operands to numbers, with no string concatenation mode. This is why form input values, which are always strings even from a number type field, need explicit Number() conversion before doing math, or plus will just glue the digits together as text.

Triple equals compares type and value with no coercion. It is also called loose equality.
Double equals coerces one or both operands to a common type first. It is also called strict equality.

6. Variables
Scope Chain, Shadowing, Closures

Scope: from this line of code, which variables can I see?
JavaScript has three kinds of scope:

Global scope — accessible everywhere in your program.
Function scope — accessible only inside the function it's declared in.
Block scope — accessible only inside the nearest { } block

scope lookup only goes inward to outward, never the reverse.

Closures: A closure is formed when a function "remembers" the variables from its outer scope, even after that outer function has finished executing.

7. String Interpolation
Template Literals, Tagged Templates

Use backticks (` `).
use any expression inside ${ }
${} always evaluates its content as an expression first, then converts the result to a string.
 Old way — needed explicit \n or string concatenation
 Template literal way — just press Enter


8. Checking Types with typeof
Type Tags, TDZ Exception, Feature Detection

typeof is a unary operator (not a function) that returns a string naming the type of its operand.
you can write it with or without parentheses both work same, as it's an operator, not a function call:

typeof function(){} → "function" — the one special case

Technically, functions ARE objects in JS but typeof special-cases them to return "function" instead of "object", because functions are callable.

it cannot see the difference between an Array, a Map, or a plain {}.
typeof returns exactly one of 8 fixed strings. 
typeof is the only operator that doesn't throw a ReferenceError on a completely undeclared variable, but it still throws if the variable exists in scope but is in the Temporal Dead Zone.