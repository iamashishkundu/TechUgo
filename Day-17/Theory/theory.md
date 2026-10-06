Day-17(01/10/2026)

## HTTP Server:

It is a program that listens incoming requests and sends back responses.It doesnt do anything until it recieves any request.

HTTP defines thee xact structure to be followed by both request and response so that any client can talk to any sever making it independent of language and technology used in both ends.

Request consist of: Header,Method,Path/URL,Body (Optional)
Response consist of: Header, Status Code, Body

## Express.js:

it is a framework for node. It is built on top off node:http module.

It is better to use bcz it give Clean, declarative routing, Middleware, Built-in response helpers ex:res.json(), res.send(), res.status()

### Express Server:

```js
import express from "express"; // 1. import the framework

const app = express();          // 2. create the application instance
const PORT = 3000;              // 3. define which port to listen on

app.get("/", (req, res) => {    // 4. define a route
  res.send("Hello, Ashish!");
});

app.listen(PORT, () => {        // 5. start the server, listening for requests
  console.log(`Server running on port ${PORT}`);
});
```

middleware and routes executes top to bottom
So always define this at starting so that all the routs can use this middleware to access there body in json format

```js
app.use(express.json());
```

**express.Router():** splitting routes across multiple files

creates a mini, self contained version of app we define routes on it exactly the same way but it lives in its own file and only gets called to the main app using app.use(prefix, router)

**express.static():** serving files directly without writing a route for each one

ex:
```js
app.use(express.static("public"));
```

**app.route():** chaining multiple methods for the same path

ex:
```js
app.route("/users/:id")
  .get((req, res) => { /* fetch user */ })
  .put((req, res) => { /* update user */ })
  .delete((req, res) => { /* delete user */ });
```

**app.set():** application-level configuration

ex:
```js
app.set("trust proxy", true);
```

### The Request (req) and Response (res) Objects:

**The req object:** reading data from the incoming request

`req.params`: dynamic URL segments
any segment in the route path prefixed with : becomes available on req.params keyed by that same name.

`req.query`: URL query string parameters
every value on req.query is a string

`req.body`: the parsed request body to access we use express.json()

**The res object:** sending data back to the client

`res.send()` — a genuinely flexible, general-purpose response method

`res.json()` — explicitly, deliberately sending JSON

`res.status()` — setting the HTTP status code