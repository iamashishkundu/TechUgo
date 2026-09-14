/*
Task 4: Immutable Array Updates with Spread 
Goal: Add, insert, and remove array elements without using .push() or .splice().
*/

const nums=[1,2,3,4,5];

function add(a,...nums){
    return[...nums,a];
}

function remove(i,...nums){
    return[...nums.slice(0,i),...nums.slice(i+1)];   
}
function insert(c,i,...nums){
    return[...nums.slice(0,i),c,...nums.slice(i+1)];
}
console.log(add(6,...nums));
console.log(remove(3,...nums));
console.log(insert(7,5,...nums));