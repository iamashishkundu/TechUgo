/*
Task 5: Directory Scanner & File Type Filter

Goal: Read directory entries and filter files by extension.
*/

import fs from "node:fs/promises";
import path from "node:path";

const dir = "C:/Users/ashis/Downloads/Techugo/Day-13/Practical";

try {
    const files = await fs.readdir(dir);

    for (const file of files) {
        const extension = path.extname(file);

        if (extension === ".txt") {
            console.log(file);
        }
    }
} catch (err) {
    console.log("Error:", err);
}