/*
Task 8: Capstone Mini-Engine — Asynchronous Task Queue (day9_task8.js)
Goal: Build an asynchronous queue processor that runs multiple independent tasks
with variable completion times and aggregates results.
*/

const tasks = [
    { name: "Download File", delay: 2000 },
    { name: "Process Data", delay: 1000 },
    { name: "Send Email", delay: 3000 }
];

const results = [];
let completed = 0;

function runTask(task, callback) {
    setTimeout(() => {
        const result = `${task.name} completed`;
        callback(null, result);
    }, task.delay);
}

tasks.forEach((task) => {
    runTask(task, (err, result) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }

        console.log(result);

        results.push(result);
        completed++;

        if (completed === tasks.length) {
            console.log("All tasks completed");
            console.log(results);
        }
    });
});