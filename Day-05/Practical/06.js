/*
Task 6: Length Extractor

Given an array of strings, use .map() to transform each string into its length, producing an array of numbers.*/

let alpha =["qefrvbgfgrt","rfds","frcedf","iyuftrsxdcfg","gdtrgfcvjbnfwuhef","ekhdkwuenc"];

let ans = alpha.map(st=>st.length);
console.log(ans);