/*
Task 8: Capstone Mini-Engine — Resilient Order Fulfillment System (day11_task8.js)
Goal: Build an asynchronous e-commerce checkout engine featuring validation, concurrency, inventory checks, payment processing, error recovery, and audit logs.
*/
const order = {
    orderId: 101,
    name: "Ashish",
    product: "Laptop",
    quantity: 2,
    price: 50000
};

function validateOrder(order){
    const {product,quantity}=order;
    if(product&&quantity>0){
        return true;
    }else{
        throw new Error("Invalid Order!");
    }
}

function checkUser(order){
    return new Promise((resolve, reject)=>{
        const{orderId,name}=order;
        setTimeout(()=>{
            if(orderId && name){
            resolve("Verified User.");
        }else{
            reject(new Error("Unauthorised Access!"));
        }
        },2000)
    })
}

function checkInventory(order){
    return new Promise((resolve,reject)=>{
        const available =5;
        const {quantity}=order;
        setTimeout(()=>{
            if(quantity<=available){
                resolve("Inventory available.");
            }else{
                reject (new Error("Inventory unavailable!"));
            }
        },2000)
    })
}

function processPayment(order) {
    return new Promise((resolve, reject) => {
        const pay=true;
        setTimeout(() => {
            if(pay){
                
                resolve("Payment successful");
            }else{
                reject(new Error("Payment failed"));
            }

        }, 2000);
    });
}


async function done(order){
   try{
     validateOrder(order);
     console.log(`Order validated`);
    await Promise.all([checkUser(order),checkInventory(order)]);
    console.log(`User and Inventory checked`);
    await processPayment(order);
    console.log(`Payment processed`);
    console.log(`Order completed`);
    
   }catch(err){
    console.log(err);
   }
} 
done(order);