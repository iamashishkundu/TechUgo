/*
Task 4: Max Number Finder Function (day4_task4.js)
Goal: Combine functions, loops, and condition tracking.
*/

let nums = [1,34,65,23,67,98,2,46,76];

function maxNum(nums){
    let maxi=nums[0];
    for(let i=0;i<nums.length;i++){
        if(maxi<nums[i]){
            maxi=nums[i];
        }
    }

    return maxi;
}

let maxi=maxNum(nums);
console.log(`Largest number:${maxi}`);