/*
Task 3: Word Search with .find()

Given an array of words, use .find() to locate the first word that matches a specified length criteria.
*/

let words = ["dasfadsf","edfsdgstgfee","edWDCSRGVFDer","asd","sdfgh","as","s"];

let ans = words.find(word=>word.length<=3);
console.log(ans);