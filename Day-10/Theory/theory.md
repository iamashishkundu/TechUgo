Day-10(16/09/2026)

## Promises:

Promises is an object that holds the eventual completion or failure of an event. It was introduced to solve the callback hell problem.
It solves the callback hell readability issue , and error handling by single .catch()a

It has 3 states:

1. Pending: It is the initial state. The async operation is not solved yet.
2. Fullfilled/Resolved: The operation completed succesfully and promise have the result value.
3. Reject: The operation Failed and the promise have the reason for failure.

Settled means it is no more pending either it is Fullfilled or Rejected.

there should be only one resolve and as many reject . If no resolve and reject then the promise stays permanent pending.

A Promise will be resolved or rejected only once. it can't be reversed , we can use its instance multiple time like attaching multiple .then() to same promise , here promise is solved once not again and again so the result will be same but we can use different isntance for different cases.

### Creating a Promise - The Executor Function: (resolve,reject)=>{}

It is a function which we into new Promise() . It handles the aasync operation and when the promise settles by calling resolve or reject.

Resolve and reject are itself a function provided by js
The executor function itself is a synchronous func. it runs immediately and synchronously. we define async task in it to handle them nicely
as it is a synchronous so throwing an error using throw and catching it will reject the promise automatically but if it is done inside async then it will fail to reject using try catch .
If we just resolve it without passing anything then it will resolve succesfully but hold undefined.

### Consuming Promises - .then(), .catch(), and .finally()

1. `.then()` : It handles the fullfilled cases. It accepts TWO callbacks

   ```js
   promise.then(
     (result) => console.log("Success:", result),
     (error) => console.log("Failure:", error.message)
   );
   ```

2. `.catch()` : It handles the rejected cases. It is generally prefered then using .then() second error argument bcz

   1. It catches any synchronous error thrown in between also.
   2. It also catches the error thrown inside a precciding .then() after result, which will eventually led to rejection of promise thats why .catch() is placed at the end.

3. `.finally()` : It runs even a promise fullfilled or rejected. It is specially designed for cleanup logic. It recieves no argument and can't change the outcome and whatever it return is ignored not passed to next step.

ex:
```js
promise
  .then((result) => console.log("Success:", result))
  .catch((error) => console.log("Error:", error.message))
  .finally(() => console.log("This runs either way"));
```

### Promise Chaining & Return Transformation:

Each .then() call returns a new Promise not the original one. whatever value we return from inside a .then() callback automatically becomes the value of the new Promise that .then() implicitly created and returned which is exactly what the next .then() in the chain receives as its input.

when .then() callback returns a Promise then chain doesn't just move on with that Promise object itself. it automatically unwraps it, waiting for that returned Promise to settle first and then passes its value to the next .then().

.catch() block that doesn't re-throw and instead returns a normal value will provide to .then() calls after it will run normally again

### Microtasks vs. Macrotasks:

1. Run all synchronous code (the call stack empties)
2. Drain the ENTIRE microtask queue (including new microtasks added during this draining)
3. Run exactly ONE macrotask from the macrotask queue
4. Go back to step 2 (drain microtasks again)
5. Repeat forever

`queueMicrotask()`: directly scheduling a microtask, without needing a Promise.

ex:
```js
console.log("1");
queueMicrotask(() => console.log("2  microtask"));
console.log("3");

// Output: 1, 3, 2  microtask
```

### Promise Combinators:

Promise combinators allow executing multiple promises together.

1. Promise.all waits for all success otherwise fails.
2. Promise.any waits for the first success.
3. Promise.race returns the first settled promise could be any succes or failure.
4. Promise.allSettled returns results of all promises regardless of success or failure.