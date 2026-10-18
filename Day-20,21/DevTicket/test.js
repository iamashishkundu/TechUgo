import "dotenv/config";

const baseUrl = `http://localhost:3000`;
const apiKey = process.env.API_KEY;

let passed = 0;
let failed = 0;

async function sendRequest(url, options = {}) {
    const response = await fetch(`${baseUrl}${url}`, options);

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    return {
        status: response.status,
        data
    };
}

function check(test, result) {
    if (result) {
        console.log(`Test ${test}: PASS`);
        passed++;
    } else {
        console.log(`Test ${test}: FAIL`);
        failed++;
    }
}

async function runTests() {
    console.log("Running tests...\n");

    
    let response = await sendRequest("/health");

    check(1, response.status === 200);


    response = await sendRequest("/api/tickets");

    check(2, response.status === 401);

    
    response = await sendRequest("/api/tickets?page=1&limit=2", {
        headers: {
            "x-api-key": apiKey
        }
    });

    check(
        3,
        response.status === 200 &&
        response.data.success === true &&
        Array.isArray(response.data.data)
    );

    
    response = await sendRequest("/api/tickets?priority=CRITICAL", {
        headers: {
            "x-api-key": apiKey
        }
    });

    const correctPriority =
        Array.isArray(response.data.data) &&
        response.data.data.every(
            ticket => ticket.priority === "CRITICAL"
        );

    check(
        4,
        response.status === 200 &&
        correctPriority
    );


    response = await sendRequest("/api/tickets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            title: "Bug",
            description: "This is a valid description",
            priority: "HIGH"
        })
    });

    check(
        5,
        response.status === 400 &&
        Array.isArray(response.data.errors) &&
        response.data.errors.length > 0
    );


    response = await sendRequest("/api/tickets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            title: "Test ticket",
            description: "This ticket is created for testing",
            priority: "LOW"
        })
    });

    check(
        6,
        response.status === 201 &&
        response.data.success === true &&
        response.data.ticketId
    );

    
    response = await sendRequest("/api/tickets/1/status", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            status: "INVALID_STATUS"
        })
    });

    check(7, response.status === 400);

    
    response = await sendRequest("/api/tickets/9999/status", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey
        },
        body: JSON.stringify({
            status: "RESOLVED"
        })
    });

    check(8, response.status === 404);

    
    const firstDelete = await sendRequest("/api/tickets/1", {
        method: "DELETE",
        headers: {
            "x-api-key": apiKey
        }
    });

    const secondDelete = await sendRequest("/api/tickets/1", {
        method: "DELETE",
        headers: {
            "x-api-key": apiKey
        }
    });

    check(
        9,
        firstDelete.status === 200 &&
        secondDelete.status === 404
    );

    console.log("\n--------------------");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("--------------------");
}

runTests();