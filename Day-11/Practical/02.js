/*
Task 2: Graceful Error Interception & Recovery

Goal: Catch specific network failures and provide sensible fallbacks without crashing.
*/

function fetchData() {
    return Promise.reject(new Error("Network Error"));
}

async function run() {
    try {
        const data = await fetchData();
        console.log("Data:", data);
    } catch (err) {
        if (err.message === "Network Error") {
            console.log("Using fallback data");
            console.log("Data: Default Data");
        } else {
            console.log("Error:", err.message);
        }
    }
}

run();