T1: What is logged to the console, and in what exact order?
const compute = async () => {
  console.log("Inside compute: 1");
  const value = await Promise.resolve(100);
  console.log("Inside compute: 2", value);
  return value * 2;
};
 
console.log("Script start");
compute().then((res) => console.log("Result:", res));
console.log("Script end");

ans:
Script start
Inside compute: 1
Script end
Inside compute: 2 100
Result: 200

 
T2: Predict the execution time of this snippet:
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
 
const runBatch = async () => {
  console.time("batchTimer");
  await delay(200);
  await delay(200);
  await delay(200);
  console.timeEnd("batchTimer");
};
 
runBatch();
 
ans:
600 ms
 
T3: Predict the console output when handling uncaught rejections with try...catch:
const riskyOperation = async () => {
  throw new Error("Database timeout");
};
 
const orchestrator = async () => {
  try {
    const result = await riskyOperation();
    console.log("Success:", result);
  } catch (err) {
    console.log("Intercepted:", err.message);
  } finally {
    console.log("Audit complete.");
  }
};
 
orchestrator();

ans:
Intercepted: Database timeout
Audit complete.
 
 
T4: What will print to the console?
const fetchItem = async (id) => ({ id, status: "ok" });
 
const run = async () => {
  const ids = [1, 2, 3];
  const results = ids.map(async (id) => {
    return await fetchItem(id);
  });
  console.log(results);
};
 
run();
 
ans:
[ Promise { <pending> }, Promise { <pending> }, Promise { <pending> } ]