Day-13(21/09/2026)

## Node.js Built-in Core Modules & The node: Protocol:

Node gives us built in core modules which we can use immediately without installing using npm but we need to import them before using and there are 2 ways :

```js
const fs = require("fs");     // CommonJS style
import fs from "fs";          // ES Module style
```

So instead of this we specify them like node:fs so that we can defferentiate that they are built in not externally installed.

ex:
```js
const fs = require("node:fs");
import fs from "node:fs";
```

### Core Modules:

| Module | Purpose |
|---|---|
| node:fs | File system reading/writing files |
| node:path | Cross-platform file path handling |
| node:http | Building web servers |
| node:os | Operating system info |
| node:crypto | Hashing, encryption, generating random values |
| node:process | Info about the currently running Node process (env variables, arguments) |
| node:util | Utility functions, including promisify() |

### Cross-Platform Path Handling (node:path)

**path.join():**

As in windows for file path we use / backslash but in mac os, linux we use \ forward slash. So to make it machine independent we use node:path(.join)

```js
import path from "node:path";
const fullPath = path.join("folder", "subfolder", "file.txt");

console.log(fullPath);
// "folder/subfolder/file.txt" on Mac/Linux
// "folder\subfolder\file.txt" on Windows
```

It can manage the extra or misplaced placed slash also automatically

**path.resolve:**

path.resolve() always returns a full absolute path.It will resolve from the current working directory if needed.

ex:
```js
console.log(path.resolve("data", "file.txt"));
// "/Users/ashish/project/data/file.txt"
```

**path.basename(), path.dirname(), path.extname():** extracting pieces of a path

```js
const fullPath = "/users/ashish/documents/report.pdf";

console.log(path.basename(fullPath)); // "report.pdf"
console.log(path.dirname(fullPath));  // "/users/ashish/documents" directory
console.log(path.extname(fullPath));  // ".pdf"
```

**__dirname:** It will give the absolute path of the current file's directory.
In older JS __dirname was automatically available. In modern ES Modules __dirname doesn't exist by default we have to reconstruct it

ex:
```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname); // absolute path to the current file's folder
```

### Buffers vs. UTF-8 Strings:

Buffer is the nodes default way of representing the binary data. Buffers are mutable and fixed-length

ex:
```js
import fs from "node:fs/promises";

const data = await fs.readFile("photo.jpg");
console.log(data); // <Buffer ff d8 ff e0 00 10 4a 46 49 46 ...>
```

To convert a buffer into readable string we must specify encoding

```js
const buffer = Buffer.from("Hello, World!");

console.log(buffer.toString()); // "Hello, World!"
console.log(buffer.toString("utf8"));
```

### The Modern Asynchronous File System API:

Node gives us three ways one is synchronous, Error first callback and the promises one in which we can sipmly use await in front and try catch for error handling

Core methods in node:fs/promises

```js
import fs from "node:fs/promises";

// Reading a file
const content = await fs.readFile("data.txt", "utf8");

// Writing a file creates it if it doesn't exist, OVERWRITES if it does
await fs.writeFile("output.txt", "Hello, World!");

// Appending to a file adds to the end, doesn't overwrite existing content
await fs.appendFile("log.txt", "New log entry\n");

// Deleting a file
await fs.unlink("oldfile.txt");

// Checking if a path exists / getting file info
const stats = await fs.stat("data.txt");
console.log(stats.size); // file size in bytes
console.log(stats.isFile()); // true
console.log(stats.isDirectory()); // false

// Creating a directory
await fs.mkdir("newFolder");

// Reading a directory's contents
const files = await fs.readdir("./uploads");
console.log(files); // ["photo1.jpg", "photo2.jpg", "document.pdf"]
```

### Handling Common File System Errors:

most common error codes:

| Code | Meaning |
|---|---|
| ENOENT | "Error NO ENTry" |
| EACCES | Permission denied |
| EISDIR | tried to read/write a path as a file, but it's actually a directory |
| ENOTDIR | tried to treat a path as a directory, but it's actually a file |
| EEXIST | tried to create something (eg: via mkdir) that already exists |
| EMFILE | Too many files open simultaneously (a resource exhaustion error) |