Day-09(15/09/2026)

## Synchronous vs. Asynchronous Execution:

Synchronous code runs line by line after finishing last line then new line will run.
Asynchronous code lets certain operations run in background without blocking the main thread.these are assigned to web api's in browser and node c++ bindings or libuv in Node. they are handeled at the end once the result is ready.

JS is single threaded . this is a intential design not a limitation. it avoids an entire category of complex bugs (race conditions, deadlocks) that come with true multi-threaded programming.


## The JavaScript Concurrency Model:

### Execution Context:

It happens in 2 phase:
1: Memory Allocation Phase
2: Code Execution Phase

Whenever a func. is invoked it will have its own seprate mini execution context and after completing its 2 phase then return its value to global execution context and will delete itself.

### Handling Asynchronous code involves :

1: **Call Stack:**
It executes our synchronous code. every time a function is called it is pushed inside call stack and after return it get popped off.

2: **Web API / Node API:**
This is where the async code is handeled and is passed to further callback queue or micro task queue depending on the type of async code.It can handle multiple asynchronous operation at same time. 

3: **Micro Task Queue:**
It include Promise callbacks (.then(), .catch(), .finally()), fetch api having .then(),queueMicrotask(), async await, Mutation observer. there result is ready just waiting for there turn to push inside call stack. It has high priority then callback queue. So first Micro task queue is executed completely and make empty then callback queue got the chance.

4: **Callback Queue:**
Where all the callback functions and rest which are left . they are just waiting for their turn as there result is ready to run.

5: **Event Loop:**
It contiously checks if the call stack is empty then push from the queues.


`setTimeout`: It runs something once after the given time in milliseconds (1sec=1000ms).Generally used for debounced search.

`clearTimeout`: It stops setTimeout from running.

`setInterval`: It runs something again and again after the given interval.

`clearInterval`: It stops setInterval from running forever.

**Synchronous Callback:** ex: `.map()`, `.filter()`, `.find()`, `.forEach()` , or any simple callback which does anything in that same call.

**Asynchronous Callback:** ex: setTimeout/setInterval, fetch, API calls, reading/writing files in Node generally prefered ones are asyncchronous, addEventListener.


## The Error-First Callback Pattern (Node.js Standard):

Before promises it became standard. when we have asynchronous code then normal try catch cant catch the error. so we have to use it . In which we have to pass first argumnet as err, and then data then check in first line if err then return so that we dont acces the undefined or errored data and get one different error.


## Callback Hell /Pyramid of Doom:

When we chain multiple asynchronous operations together using nested callbacks. each dependent on other result and code start expanding to the right and became hard to read.
other problems:
1: Hard to debug error
2: Control flow becomes hard to modify

This lead to creation of promises and async await