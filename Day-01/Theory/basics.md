Techugo Fullstack Training
Day 01 (03/09/2026)

1. The Terminal and Node.js
Shell, PATH, REPL, Runtime Environment

Terminal is a program (shell) that reads a command I type, looks through my PATH for a matching program, and runs it. Node isn't a language, it's a runtime that takes Chrome's JS engine (V8) and lets it execute outside a browser. That's why Node gives me fs, process, require, stuff to touch the file system and OS, but I lose window and document, since those are browser only APIs, not part of JS itself. Running node file.js executes it once and exits; nodemon watches the file and restarts the process whenever it changes.

2. Declarations: Memory Allocation
Stack vs Heap, Hoisting, Temporal Dead Zone

Primitives (numbers, strings, booleans, etc.) get stored on the stack and copied by value, each variable owns its own slot. Objects and arrays live on the heap; the variable just holds a reference (an address) to that heap location. So let b = a copies the address, not the object, both variables point at the same thing, and mutating through either one shows up on both. On declarations: during the creation phase (before code runs line by line), var gets hoisted and auto set to undefined; let and const get hoisted too but stay uninitialized in the Temporal Dead Zone until their actual line executes, touching them before that throws a ReferenceError. var is scoped to the nearest function (or global), ignoring blocks entirely; let and const are block scoped. const prevents reassigning the variable binding, not mutation of what it points to, so const arr equals an empty array still allows arr.push().

3. Data Types and Representation
Primitives, Objects, IEEE 754, Falsy Values

JS has 8 types total: 7 primitives (number, string, boolean, undefined, null, symbol, bigint) and one reference type, object (which arrays, functions, dates, etc. all fall under). There's only one numeric type, represented as 64 bit floating point (IEEE 754), which is why 0.1 + 0.2 can't be stored exactly in binary and gives 0.30000000000000004. Strings are immutable, methods like toUpperCase() return a brand new string rather than modifying the original. null is an explicit, deliberate no value, assigned by the programmer. undefined is the default state, a declared but unassigned variable, a missing object property, or a function with no return. typeof null returns object due to a bug in the original 1995 engine implementation (both used the same internal type tag), it's permanent now for backward compatibility.

4. Type Inspection
typeof, instanceof, Array.isArray, toString.call

typeof distinguishes primitives and functions, but every object based value, arrays, dates, plain objects, maps, all return object. Array.isArray() exists specifically to detect arrays reliably, including across different execution contexts (iframes or workers), where instanceof Array can fail because each context has its own separate Array constructor.

5. Data Types
Coercion, Conversion, Equality, ToPrimitive

The plus operator checks its operands: if either side is a string, it performs concatenation; otherwise it does numeric addition. Every other arithmetic operator (minus, multiply, divide) always coerces both operands to numbers, with no string concatenation mode. This is why form input values, which are always strings even from a number type field, need explicit Number() conversion before doing math, or plus will just glue the digits together as text. Triple equals compares type and value with no coercion. Double equals coerces one or both operands to a common type first, following the spec's algorithm, which is why empty string equals 0 and 0 equals "0" are both true, but empty string equals "0" is false (no coercion happens when both sides are already the same type).

6. Variables
Scope Chain, Shadowing, Closures

Scope determines variable visibility. Lookup only travels inward to outward through the scope chain: an inner function can access its outer function's variables, but not vice versa. A closure forms when a function retains a live reference to variables from its enclosing scope even after that outer function has finished executing, normally those variables would be garbage collected once the function returns, but the closure keeps them reachable on the heap.

7. String Interpolation
Template Literals, Tagged Templates, toString

Backtick delimited strings where the expression inside dollar curly braces is evaluated first, then converted to a string via the same ToString and ToPrimitive rules as elsewhere, meaning objects without a custom toString() will interpolate as "[object Object]". Multi line template literals preserve all whitespace exactly as typed, including indentation.

8. Checking Types with typeof
Type Tags, TDZ Exception, Feature Detection

typeof returns exactly one of 8 fixed strings. All callable values, regular functions, arrow functions, classes, generators, async functions, return function, even though classes are technically functions under the hood. typeof is the only operator that doesn't throw a ReferenceError on a completely undeclared variable, though it still throws if the variable exists in scope but is in the Temporal Dead Zone.