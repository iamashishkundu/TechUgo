/*
Task 1: Price Tag Formatter with .map()
Create an array of product prices and use .map() to add the $ symbol and format each price as a price tag.
*/

let price =[100,150,354,156,156,865,982];

let priceTag=price.map(p=>`$${p}`);
console.log(price);