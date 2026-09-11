/*
Task 7: Shopping Cart Summary 
Goal: Combine object properties, array methods, and calculations.
*/

const cart = [
    {
        name: "Laptop",
        price: 55000,
        quantity: 1
    },
    {
        name: "Mouse",
        price: 1200,
        quantity: 2
    },
    {
        name: "Keyboard",
        price: 2500,
        quantity: 1
    },
    {
        name: "Headphones",
        price: 3000,
        quantity: 2
    }
];

console.log(`Shopping Cart Summary`);

    let total = 0;
    let count =0;
    let quantity = 0;


cart.forEach(item=>{
    const subTotal = item.price * item.quantity;
    total += subTotal;
    count++;
    quantity += item.quantity;
    console.log(`${item.name} : ₹${subTotal} `)
});

console.log(`Different Products: ${count}`);
console.log(`Total Quantity: ${quantity}`);
console.log(`Total Cart Value: ₹${total}`);