/*
Task 2: Sum & Average Calculator (day4_task2.js)
Goal: Use a loop with an accumulator variable.
 */

let sum=0;
let nums=[1,2,3,45,6,78,9];

for(let i=0;i<nums.length;i++){
    sum+=nums[i];
}
console.log(`Sum:${sum}`);
console.log(`Average:${sum/nums.length}`);
