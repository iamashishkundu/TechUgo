/*
Task 4: Safe Asynchronous Iteration

Goal: Iterate through records sequentially using for...of to preserve processing order.
*/

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const users = ["Ashish", "Rahul", "Amit"];

async function processUsers() {

    for (const user of users) {
        await delay(1000);
        console.log("Processed:", user);
    }

}

processUsers();