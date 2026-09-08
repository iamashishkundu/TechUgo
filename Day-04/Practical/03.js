/*
Task 3: Filtering with Loops (day4_task3.js)
Goal: Separate values into different arrays based on a condition.
 */

let nums =[1,2,3,4,5,6,7,8,9,10];
let even =[];
let odd =[];

for(let i=0;i<nums.length;i++){
    if(nums[i]%2==0){
        even.push(nums[i]);
    }
    else{
        odd.push(nums[i]);
    }
}

console.log(`Even:${even}`);
console.log(`Odd:${odd}`);
