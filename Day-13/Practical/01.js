/*

Task 1: Cross-Platform Path Normalizer 
Goal: Practice safe path construction, decomposition, and normalization.
*/

import path from "node:path";

const fullPath = path.join("user","ashish","downloads","index.js");
console.log(fullPath);
const fileName = path.basename(fullPath);
console.log(fileName);
const directories = path.dirname(fullPath);
console.log(directories);
const extName = path.extname(fullPath);
console.log(extName);
const pathObject = path.parse(fullPath);
console.log(pathObject);