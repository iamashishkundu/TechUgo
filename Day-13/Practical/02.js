/*

Task 2: File Creation & Sequential Appending 
Goal: Create files, read their content, and append subsequent lines asynchronously.
 */

import fs from "node:fs/promises";

const data = await fs.readFile("./ex.txt","utf8");
console.log(data);

const updated = await fs.appendFile("./ex.txt"," kundu");
const updatedFile = await fs.readFile("./ex.txt","utf8");
console.log(updatedFile);