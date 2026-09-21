T1: Why is path.join("data", "/users", "records.json") safer than manual string concatenation?
sol: bcz it is machine independent and also it handles the misplaced slashes automatically.

T2: What will print to the console if you omit the second argument in fs.readFile()?

```js
import fs from "node:fs/promises";

const data = await fs.readFile("test.txt");
console.log(typeof data);   //object
console.log(data);          // <buffer ----->
```

sol: Then the default Buffer binary code will print .

T3: What happens when running fs.mkdir("a/b/c") if folder "a" does not exist, and how do you resolve it?

sol: If the a directory doesnt exist then we have to add { recursive: true } and it will automatically resolve in recursive if any directory is missing then it will create automaticall.

T4: Predict what happens in this error handling scenario:

```js
import fs from "node:fs/promises";

const removeFileSafely = async (targetPath) => {
  try {
    await fs.unlink(targetPath);
    console.log("Deleted");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("File already absent");
    } else {
      throw err;
    }
  }
};

await removeFileSafely("non_existent_file.log");
```

sol: File already absent