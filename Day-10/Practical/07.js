/*
Task 7: Resilient Batch Processing with Promise.allSettled()

Goal: Process an array of operations where some fail, without aborting the rest.
*/

const task1 = Promise.resolve("Task 1 completed");

const task2 = Promise.reject(new Error("Task 2 failed"));

const task3 = Promise.resolve("Task 3 completed");

const task4 = Promise.reject(new Error("Task 4 failed"));

Promise.allSettled([task1, task2, task3, task4])
    .then((results) => {

        results.forEach((result) => {

            if (result.status === "fulfilled") {
                console.log(result.value);
            } else {
                console.log(result.reason.message);
            }

        });

    });