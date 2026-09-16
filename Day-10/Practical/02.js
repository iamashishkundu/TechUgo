/*
Task 2: Building a Promisified Delay Utility

Goal: Convert callback-based setTimeout into a clean, reusable Promise.
*/

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Delay completed");
        }, ms);
    });
}

delay(2000)
    .then((result) => {
        console.log(result);
    });