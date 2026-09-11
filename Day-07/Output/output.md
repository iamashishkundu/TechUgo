1: Predict the output of this code:

```js
const original = [1, 2, 3];
const copy = original;

copy.push(4);

console.log(original.length);
console.log(copy.length);
```

sol:
4
4


2: What will print to the console?

```js
const student = { name: "Riya", marks: [80, 90] };

const addMark = (record, newMark) => {
  record.marks.push(newMark);
};

addMark(student, 95);
console.log(student.marks);
```

sol:
[80, 90, 95]



3: What is the output of this array method sequence?

```js
const items = [
  { name: "Pen", cost: 10 },
  { name: "Notebook", cost: 50 },
  { name: "Bag", cost: 300 }
];

const result = items
  .filter((item) => item.cost > 20)
  .map((item) => item.name);

console.log(result);
```

sol:
["Notebook","Bag"]



4: Predict the console output:

```js
const values = [10, 20, 30];
let total = 0;

values.forEach((val) => {
  total += val;
});

const isHigh = total > 50 ? "High" : "Low";
console.log(isHigh);
```

sol:
High