/*
Task 1: Refactoring Promise Chains to async / await

Goal: Convert .then()/.catch() chains into clean, readable procedural code.
*/

// Promise Chain

function getData() {
    return Promise.resolve("Data received");
}

getData()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err.message);
    });


// Async / Await

async function run() {
    try {
        const data = await getData();
        console.log(data);
    } catch (err) {
        console.log(err.message);
    }
}

run();