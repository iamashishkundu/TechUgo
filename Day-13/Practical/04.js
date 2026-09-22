/*
 
Task 4: Safe Directory Initializer 
Goal: Ensure directory structures exist before writing files.
 
*/

import fs from "node:fs/promises";

const dir = "./user/ashish/download/telegram/movies";

try{
    await fs.mkdir(dir,{recursive:true});
      await fs.writeFile(
        `${dir}/movie.txt`,
        "This is my movie file.");
    console.log(`Directories created succesfully`);
}catch(err){
    console.log("Error Creating Directories :", err);
}