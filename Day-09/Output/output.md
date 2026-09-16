T1: Predict the exact console output order of this script:

```js
console.log("1: Script start");

setTimeout(() => {
  console.log("2: Timeout 0ms");
}, 0);

setTimeout(() => {
  console.log("3: Timeout 50ms");
}, 50);

console.log("4: Script end");
```

ans:
```
1: Script start
4: Script end
2: Timeout 0ms
3: Timeout 50ms
```

T2: What will print to the console?

```js
let status = "pending";

setTimeout(() => {
  status = "ready";
}, 100);

console.log(status);
```

ans:
```
pending
```

T3: Predict the output and explain why clearInterval is necessary:

```js
let count = 0;

const id = setInterval(() => {
  count += 1;
  console.log(`Count: ${count}`);

  if (count === 2) {
    clearInterval(id);
  }
}, 50);
```

ans:
```
Count: 1
Count: 2
```

clear Interval is necessary bcz if we didnt use it will run infinitely

T4: What happens if an error-first callback forgets to return after an error?

```js
const handleResult = (err, data) => {
  if (err) {
    console.log(`Failed: ${err}`);
  }
  console.log(`Result: ${data.value}`);
};

handleResult("Network Timeout", null);
```

ans:
```
Failed: Network Timeout
```

Then the function continues executing because there is no return after the error handling. It tries to access data.value, but data
is null, so a TypeError is thrown.