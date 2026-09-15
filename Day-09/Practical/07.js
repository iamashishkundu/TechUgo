/*
Task 7: Polling Worker with Status Checks (day9_task7.js)
Goal: Use intervals to check a changing state asynchronously.
*/

let status = "pending";

const worker = setInterval(() => {
    console.log(`Current Status: ${status}`);

    if (status === "completed" || status === "failed") {
        clearInterval(worker);
        console.log(`Worker stopped with status: ${status}`);
    }
}, 1000);

setTimeout(() => {
    status = "processing";
}, 2000);

setTimeout(() => {
    status = "completed";
}, 5000);