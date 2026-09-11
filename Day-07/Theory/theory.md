## Complex Nested Structures

### Optional Chaining (?.)

It is used to check the object property exist or not. then checks is it null or undefined(missing) if one of them then return undefined
and stop the chain moving forward.otherwise chain continues forward.
To check the property you place ?. at the end of property

For arrays:

ex:
```js
const company2 = { name: "TechUgo" }; // no departments field at all

console.log(company2.departments[0].name); //  crashes
console.log(company2.departments?.[0]?.name); // undefined
```

### nullish fallback operator (??):

It is a fallback value when the value turns out to be null/undefined

ex:
```js
const city = user.address?.city ?? "City not provided";
console.log(city); // "City not provided"
```

### Destructuring nested structures:

ex:
```js
const { name, address: { city, zip } = {} } = user;
```

### Pass by Value vs Pass by Reference

pass by value for primitives. stored in stack
pass by reference for objects. stored in heap

mutation can change the original but reassignment doesn't

### Arrow Function Trap Returning Objects:

```js
const makeUser = (name) => { name: name };
console.log(makeUser("Ashish")); // undefined
```

here js doesnt treat it as a single expression but treat it as a block so as a function it doesnt return anything so it is undefined

Fix:
```js
const makeUser = (name) => ({ name: name });
console.log(makeUser("Ashish")); // { name: "Ashish" }
```
These parenthesis () helps js to teat it as a single expression

### Tabular Terminal Output

console.table():
It renders arrays ,objects as a formatted table
It Works on plain objects also keys become rows instead of columns

for filtering displayed columns use the second optional argument

ex:
```js
console.table(users, ["name", "age"]); // only shows these two columns
```

Nested objects inside table cells do not fully expand Instead they show as [Object]

### Pure Functions:

A pure function has two properties:

1: Giving the same input it will always return the same output. no randomness, no dependency on outside state that could change between calls.
2: It does not mutate its arguments. It does not uses variables outside its own scope. It does not log. It doesnot make network calls.