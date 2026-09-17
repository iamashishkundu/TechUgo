/*
Task 5: Resilient Retry Mechanism with Exponential Backoff

Goal: Automatically retry an unstable network call before failing.
*/

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let attempts = 0;

async function fetchData() {
    attempts++;

    if (attempts < 3) {
        throw new Error("Network Error");
    }

    return "Success";
}

async function retry() {
    for (let i = 1; i <= 3; i++) {
        try {
            const result = await fetchData();
            console.log(result);
            return;
        } catch (err) {
            console.log(`Attempt ${i} failed`);

            if (i < 3) {
                await delay(1000 * 2 ** (i - 1));
            }
        }
    }

    console.log("Failed after 3 attempts");
}

retry();