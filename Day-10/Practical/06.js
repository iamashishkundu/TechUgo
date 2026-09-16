/*
Task 6: Concurrent Execution with Promise.all()

Goal: Fetch multiple independent resources in parallel and compute an aggregated metric.
*/

function getUsers() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(10);
        }, 1000);
    });
}

function getOrders() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(25);
        }, 1500);
    });
}

function getProducts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(15);
        }, 500);
    });
}

Promise.all([
    getUsers(),
    getOrders(),
    getProducts()
])
.then((results) => {
    console.log("Results:", results);

    const total = results.reduce((sum, value) => sum + value, 0);

    console.log("Total:", total);
})
.catch((err) => {
    console.error("Error:", err.message);
});