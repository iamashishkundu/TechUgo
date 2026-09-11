Day-06(10/09/2026)


Object:
It consist of Key and value pair,Keys are always treated as string.

Dot vs Bracket Notation:

Both works same for accesing object value but bracket notation ([]) helps us in some edge cases like:
1:  we can use key which are not following naming rules as variables. If it starts with a letter/_/$, no spaces, no special characters, can't be a reserved word. all can be accesed using bracket only.
2: Even when the key is dynamic.
3: Bracket notation can also evaluate expression inside them.


Mutability with const:

const actually means fixed reference, its inside data can be changed but you cant reassign completely and change the reference

Object.freeze():
Prevents any mutation on shallow level but you can completely change the refference. 
ex:
let person = Object.freeze({ name: "Ashish", age: 25 });


to prevent copmlete mutation on shallow level use both const and Object.frezze() combined.
ex:
const person = Object.freeze({ name: "Ashish", age: 25 });


in Operator:
 It is mainly used to check the key exist in object or not. {"key" in object}

ex:
const person = { name: "Ashish", age: 25 };

console.log("name" in person);  // true

it also inherit the object prototype properties also like toString so it will give true for them also . to solve this we have
.hasOwn(object,"key") 
ex:
console.log(Object.hasOwn(person, "name")); // true

Object Utility Method :

these are the Object constructor methods used for object manipulation. Object.methodName(objectName);   

After getting object as an array we can perform different opertaions on them which are not accesible through object

Types:

1: Object.keys()  gives all keys in array
ex:
const person = { name: "Ashish", age: 25, city: "Delhi" };
console.log(Object.keys(person)); // ["name", "age", "city"]

2: Object.values() - gives all values in array
ex:
console.log(Object.values(person)); // ["Ashish", 25, "Delhi"]

3: Object.entries() - gives both, as an array of array [key, value] pairs
ex:
console.log(Object.entries(person));
// [["name", "Ashish"], ["age", 25], ["city", "Delhi"]]

4: Object.fromEntries() - the reverse of Object.entries()
ex:
const obj = Object.fromEntries(entries);
console.log(obj); // { name: "Ashish", age: 25, city: Delhi }

5: Object.assign() - merging objects together , empty object is given to merge in it if not given will merge in original array
ex:
const person = { name: "Ashish", age: 14 };
const updatedAge = { age: 25 };

const merged = Object.assign({}, person, updatedAge);
console.log(merged); // { name: "Ashish", age: 25 }

6: The spread operator ({ ...obj }) - the modern alternative to Object.assign() and it is prefffered because it uses shallow copy and in assign if we miss empty object then it directly operate on original object.
ex:
const merged2 = { ...person, ...updatedAge };
console.log(merged); // { name: "Ashish", age: 25 } same result as Object.assign()

7: Object.freeze() and Object.isFrozen() - freezes object shallow but can be completely reffered to another

8: Object.seal() and Object.isSealed()
ex:
object.seal(person);   // prevents adding/removing properties, but existing ones can be modified
console.log(Object.isSealed(person)); // true

