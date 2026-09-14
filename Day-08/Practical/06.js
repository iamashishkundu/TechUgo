/*
Task 6: Flexible Math Utility with Rest Parameters 
Goal: Write functions that accept an arbitrary number of arguments.
 */


function sum(...nums){
    let count=0;
    for(num of nums){
        count += num;
    }
    return count;
}
let nums=[1,4,245,643,3,53,3,4,5,6,5];
console.log(sum(...nums));