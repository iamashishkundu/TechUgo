/*
Task 4: Budget Audit with Object.entries()

Goal: Iterate through keys and values simultaneously.
*/

const budget = {
    development: 100000,
    marketing: 75000,
    operations: 50000,
    infrastructure: 80000
};

const data = Object.entries(budget);
let total=0;
for(const [category,amount] of data){
    console.log(`${category}:${amount}`);
    total += amount;
}
console.log(`Total Budget: ${total}`);
