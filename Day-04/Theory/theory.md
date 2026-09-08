Day-04(08/09/2026)


Array : It contains the list of values. It is ordered, In JS arrays can contain mix values of different types 
        Accesing intential empty value of array will be undefined.
Two ways to create:
1: let nums = [1,2,3]; // standard way
2: let nums = new Array(1,2,3);//Constructor
Edge case: can't use constructor way for single element otherwise it will take it as the length of the array and the values will be set to undefined
ex- let nums = new Array(4);
console.log(nums.length);//4
console.log(nums[0]);//undefined

As we know that array is object so changing the duplicate will also change the original because the array is stored in heap only the reference is passed . So while copying array use spread operator to Shallow Copy ex: let nums2 = [...nums];
but while doing Shallow Copy only outer array values or outer objects are copied new but inner objects or inner array of array are shared same . So in this case we use Deep Copy  to copy nested objects completely new ex: let nums3 = structuredCopy(nums);

Array is 0 based indexing and .length is used to calc. the size of an array

Operates on Front of array: .shift()    ->remove an element /.unshift()     ->adds an element
Operates on Back of array:  .pop()                          /.push()
push and pop are generally faster than shift and unshift because removing or adding an element from start will cause reindexing whole array 

Loops :

1: for loop : full control

const fruits = ["apple", "banana", "cherry"];

for (let i = 0; i < fruits.length; i++) {
  console.log(fruits[i]); // "apple", "banana", "cherry"
}


2: for of : modern and cleaner

for (const fruit of fruits) {
  console.log(fruit); // "apple", "banana", "cherry"
}

3: for in : iterates over keys,not values ,it is for objects not arrays but if used will give index in string not number

for (const index in fruits) {
  console.log(index + 1); // "01", "11", "21" — STRING concatenation
}

4: while and do while : these dependes on condition not on count

let i = 5;
do {
  console.log(i); 
  i++;
} while (i < 3);

5: for each : special for iteration

const fruits = ["apple", "banana", "cherry"];

fruits.forEach((fruit, index) => {
  console.log(index, fruit); // 0 "apple", 1 "banana", 2 "cherry"
});

we can't break from this loop because internally it uses callback func. for every element so break and continue doesnt work here.
