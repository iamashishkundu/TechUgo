/*
Task 5: Text Sanitizer with .map()

Given an array of messy strings containing extra spaces and inconsistent capitalization, use .map() to clean and standardize each string.
*/

let messy = ["dsASDCTbgdvf     ","sefsvsVSDsGbvfgvFS    ","wsfAWSFascfSF  "];

let clean = messy.map(st=>st.trim().toLowerCase());
console.log(clean);