/*
Task 5: Inventory Query Engine

Goal: Process an array of objects using .filter(), .map(), and .find().
*/

const products = [
    {
        name: "Laptop",
        category: "Electronics",
        price: 55000,
        stock: 10
    },
    {
        name: "Mouse",
        category: "Electronics",
        price: 1200,
        stock: 25
    },
    {
        name: "Keyboard",
        category: "Electronics",
        price: 2500,
        stock: 15
    },
    {
        name: "Office Chair",
        category: "Furniture",
        price: 8500,
        stock: 5
    },
    {
        name: "Notebook",
        category: "Stationery",
        price: 150,
        stock: 50
    }
];

let ans = products.filter(product=>{
    if(product.price>1000 && product.stock>0){
        return product;
    }
}).map(product=>{
    return{
        name: product.name,
        price: product.price
    };
});
console.log(`Filtered the products price greater than 1000 and showing only there name and price.`);
console.log(ans);

let Mouse = products.find(product=>product.name=="Mouse");

console.log(Mouse);