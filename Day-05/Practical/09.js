/*
Task 9: Inventory Audit with .some() and .every()

Given an inventory array containing product stock information, use .some() to check whether any product is out of stock and .every() 
to check whether all products are in stock.
*/

let inventory = [
    {"name":"lights","unit":75},
    {"name":"fan","unit":13},
    {"name":"ac","unit":5},
    {"name":"heater","unit":3},
    {"name":"microwave","unit":0},
    {"name":"oven","unit":31},
    {"name":"bell","unit":81},
    
];

let outOfStock = inventory.some(product=>product.unit<1);
let allInStock = inventory.every(product=>product.unit>0);

if(outOfStock){
    console.log(`Product out of Stock`);
}
if(allInStock){
    console.log(`All Products are in Stock`);
}
