Q1: What are the distinct roles of .map(), .filter(), and .find() when working with arrays?

Q2: When is bracket notation (obj[key]) mandatory over dot notation (obj.key)?

Q3: Explain the shallow copy limitation when duplicating objects using the spread operator (...).

Q4: How do you differentiate between the Spread operator and the Rest pattern when both use ... syntax?

Q5: Describe the execution hierarchy between the Call Stack, Microtask Queue, and Macrotask Queue in the Node.js Event Loop.

Q6: What is the operational difference between Promise.all() and Promise.allSettled()?

Q7: Why does writing await inside an array.forEach() callback fail to pause execution, and how do you fix it?

Q8: Reference Mutation Trace
What prints to the console when executing this script?

```js
const original = {
  title: "Dev Guide",
  tags: ["javascript", "node"],
  meta: { views: 100 }
};

const clone = { ...original };
clone.title = "Master Guide";
clone.tags.push("express");
clone.meta.views += 50;

console.log(original.title);
console.log(original.tags.length);
console.log(original.meta.views);
```

Q9: Destructuring, Renaming & Rest Evaluation
What prints to the console?

```js
const response = {
  code: 200,
  data: {
    userId: "USR_10",
    profile: { email: "dev@example.com" }
  },
  cached: true,
  timestamp: 1700000000
};

const {
  code: statusCode,
  data: {
    profile: { email, verified = false }
  },
  retries = 3,
  ...metadata
} = response;

console.log(statusCode);
console.log(email);
console.log(verified);
console.log(retries);
console.log(Object.keys(metadata));
```

Q10: Event Loop Priority Ordering
What is the exact logged order of this execution?

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3");
    return "4";
  })
  .then((val) => {
    console.log(val);
  });

console.log("5");
```

Q11: Async Error Catching and Flow Control
What prints to the console?

```js
const serviceCall = async (shouldError) => {
  if (shouldError) {
    throw new Error("Service unreachable");
  }
  return "Data received";
};

const orchestrator = async () => {
  try {
    const res = await serviceCall(true);
    console.log("Step A:", res);
  } catch (err) {
    console.log("Step B:", err.message);
    return "Fallback payload";
  } finally {
    console.log("Step C: Process finalized");
  }
};

orchestrator().then((result) => console.log("Step D:", result));
```

Challenge 1: Functional E-Commerce Pipeline

Write a pure function analyzeOrders(orderHistory) that:

Filters for orders where status === "delivered".

Uses .map() to enrich each order with:

itemCount: total quantity of all items in that order.

totalValue: calculated sum of (price * quantity) for all items in that order.

Calculates the cumulative revenue generated across all delivered orders.

Returns an object: { deliveredOrders: [...], totalRevenue: number }. Ensure the input array is not mutated.

Challenge 2: Promisifying Error-First Asynchronous Callbacks
Convert this legacy callback-based function into a Promise-returning function readConfigPromise(filePath):

```js
const legacyReadConfig = (filePath, callback) => {
  setTimeout(() => {
    if (!filePath.endsWith(".json")) {
      callback(new Error("Unsupported file format: expected JSON"), null);
    } else {
      callback(null, JSON.stringify({ app: "CoreAPI", port: 5000 }));
    }
  }, 100);
};
```

Requirements:

1. If the callback returns an error, reject the Promise with that error.

2. If successful, parse the JSON string (JSON.parse) and resolve with the resulting object.

Challenge 3: Safe Async Batch Processor with Enforced Timeouts
Write an async function executeBatchWithDeadline(tasks, deadlineMs) that:

Accepts an array of functions returning Promises (tasks) and an overall timeout in milliseconds (deadlineMs).

Creates an enforced deadline Promise that rejects after deadlineMs with new Error("Batch processing timed out").

Runs all tasks concurrently using Promise.all(tasks.map(fn => fn())).

Uses Promise.race() between the concurrent tasks and the deadline Promise.

If the tasks finish inside the deadline, returns { status: "SUCCESS", results }.

If the deadline expires or any task fails, catches the error and returns { status: "FAILED", error: err.message }.