/*
Task 6: Data Enrichment Pipeline with Promise.all

Goal: Combine array transformation (.map), async/await, and concurrent execution.
*/

const users = [1, 2, 3];

function getUser(id) {
    return Promise.resolve({
        id: id,
        userId: `User ${id}`
    });
}

async function run() {

    const promises = users.map((id) => getUser(id));

    const results = await Promise.all(promises);

    console.log(results);
}

run();