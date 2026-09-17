/*
Task 3: Execution Benchmarking: Parallel vs. Sequential

Goal: Measure the performance difference between serial await and Promise.all.
*/

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function sequential() {
    console.time("Sequential");

    await delay(1000);
    await delay(1000);

    console.timeEnd("Sequential");
}

async function parallel() {
    console.time("Parallel");

    await Promise.all([
        delay(1000),
        delay(1000)
    ]);

    console.timeEnd("Parallel");
}

sequential();
parallel();