# Day-08 (14/09/2026)

## Object Destructuring:

Destructuring helps us extract keys from an object so that we dont have to use dot operator everytime we wnat to access obect values. 
IN Object destructuring we have to destructure with the exact names used as in the object as keys bcz they are not destructured using index unlike arrays. But if we want we can rename them also if needed and default values also can be provided.
ex:

```js
const person={
    name:"ashish",
    age:"25",

}

const { name, age } = person;
const { name:naam, age:umar} = person; //renaming
const { name, age:umar=22 , gender="Male"}=person; //renaming and default , default
```

## Array Destructuring:

It is index based destructuring unlike object which is name based. key we wont be using after destructuring have to left emty space for them 
ex:
```js
cosnt score =[12,79,27,2,82,78];
const [first,second,...rest]=score;
console.log(first)//12
console.log(second)//79
console.log(rest)//[27,2,82,78]
```

## The Spread Operator for Immutability:

The spread operator (...) expands (array, string, or object) into its individual elements.It helps us create new shallow copies instead of muttating the original values. It is also used foe commbining and merging arrays.
In React the changes are detected by comparing the references and chaing in object never changes the referrence so we need to make the shallow copy and add the change in this way the new reffernce is created and react can identify and render accordingly.

ex:
```js
function addToCartMutating(cart, item) {
  cart.items.push(item);
  return cart;
}

function addToCartImmutable(cart, item) {
  return {
    ...cart,
    items: [...cart.items, item]
  };
}

const cart = { items: ["Shoes"], total: 50 };
const newCart = addToCartImmutable(cart, "Hat");

console.log(cart.items);    // ["Shoes"] 
console.log(newCart.items); // ["Shoes", "Hat"] 
```

## Rest Operator: 
Same symbol but opposite job from spread. Collects individual elements back into a single array/object.

ex:
```js
// SPREAD 
const arr = [1, 2, 3];
console.log(...arr); // 1 2 3

// REST
function sum(...numbers) {
  console.log(numbers); // [1, 2, 3] 
}
sum(1, 2, 3);
```

## Enhanced Object Literals :

1: when the key name matches an existing variable name
ex:

```js
const name = "Ashish";
const age = 25;

// Old way repetitive
const person = { name: name, age: age };

// New Way when key and variable name match, just write it once
const person2 = { name, age };

console.log(person2); // { name: "Ashish", age: 25 } 
```

2: While defining method no need to use function keyword we can directly define it 
ex:
```js
// Old way
const calculator = {
  add: function(a, b) {
    return a + b;
  }
};

// New Way
const calculator2 = {
  add(a, b) {
    return a + b;
  }
};

console.log(calculator2.add(2, 3)); // 5 
```

3: If the object key is an expression we can drectly evaluate it inside object using []
ex:
```js
const propName = "age";

// Old way 
const obj = {};
obj[propName] = 25;

// New Way
const obj2 = { [propName]: 25 };

console.log(obj2); // { age: 25 }
```