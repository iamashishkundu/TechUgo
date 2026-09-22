/*
 
Task 3: JSON File Persistence Helper 
Goal: Serialize objects to JSON files and deserialize them back safely.
 
*/

import { read } from "node:fs";
import fs from "node:fs/promises";

const person ={
    "name":"Ashish Kundu",
    "age":"25",
    "gender":"Male",
};
const data = JSON.stringify(person);
await fs.writeFile("./ex.txt",data);
const readData = await fs.readFile("./ex.txt","utf8");
console.log(readData);

const reversedData = JSON.parse(readData);
console.log(reversedData);
