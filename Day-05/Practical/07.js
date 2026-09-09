/*
Task 7: Strict Keyword Filter

Given an array of strings, use .filter() to keep only the strings that contain a specific keyword.
*/

let arrs = ["ashish kundu","aryan tiwari","aditya kundu","arjun rampal","karan mehra"];

let ans = arrs.filter(arr=>arr.includes("kundu"));
console.log(ans);