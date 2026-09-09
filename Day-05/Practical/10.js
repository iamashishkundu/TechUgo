/*
Task 10: Multi-Step Data Pipeline

Given an array of objects, use .filter(), .map(), and .length together to filter relevant data, transform it, and determine 
the final number of results.

You have a list of products. Find products costing more than ₹1,000, then apply a 10% discount and 
create an array containing their names and discounted prices.
*/


let products = [
    { name: "Keyboard", price: 800 },
    { name: "Monitor", price: 5000 },
    { name: "Mouse", price: 1200 },
    { name: "Headphones", price: 900 },
    { name: "Laptop", price: 60000 }
];

let ans = products.filter(product=>{
    if(product.price>1000){
        return product;
    }
}).map(product=>{
    let discountedPrice = product.price-product.price*10/100;
    product.DiscountedPrice=discountedPrice;
    return product;

});
console.log(ans);