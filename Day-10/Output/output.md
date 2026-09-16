T1: Predict the exact console output order:

```js
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");
```

ans:
```
1
4
3
2
```

T2: What will print to the console?

```js
Promise.resolve(10)
  .then((val) => {
    console.log(val);
    return val * 2;
  })
  .then((val) => {
    console.log(val);
  })
  .then((val) => {
    console.log(val);
  });
```

ans:
```
10
20
undefined
```

T3: How does error bubbling behave in this chain?

```js
Promise.resolve("Initial Data")
  .then((data) => {
    console.log(`Step 1: ${data}`);
    throw new Error("Failure in Step 2");
  })
  .then(() => {
    console.log("Step 3: Will this run?");
  })
  .catch((err) => {
    console.log(`Caught: ${err.message}`);
    return "Recovered";
  })
  .then((msg) => {
    console.log(`Step 4: ${msg}`);
  });
```

ans:
```
Step 1: Initial Data
Caught: Failure in Step 2
Step 4: Recovered
```

T4: What will Promise.all() output in this scenario?

```js
const p1 = Promise.resolve("Success A");
const p2 = Promise.reject(new Error("Failure B"));
const p3 = Promise.resolve("Success C");

Promise.all([p1, p2, p3])
  .then((results) => console.log("Results:", results))
  .catch((err) => console.log("Aborted:", err.message));
```

ans:
```
Aborted: Failure B
```