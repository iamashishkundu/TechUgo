/*
 
Task 6: Sequential Callback Chaining
Goal: Coordinate sequential steps using nested callbacks.
 
*/

function step1(callback) {
    setTimeout(() => {
        console.log("Step 1 completed");
        callback(null, "Data from Step 1");
    }, 1000);
}

function step2(data, callback) {
    setTimeout(() => {
        console.log("Step 2 completed");
        callback(null, `${data} -> Data from Step 2`);
    }, 1000);
}

function step3(data, callback) {
    setTimeout(() => {
        console.log("Step 3 completed");
        callback(null, `${data} -> Data from Step 3`);
    }, 1000);
}

step1((err, data1) => {
    if (err) {
        console.log(`Error: ${err}`);
        return;
    }

    step2(data1, (err, data2) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }

        step3(data2, (err, finalData) => {
            if (err) {
                console.log(`Error: ${err}`);
                return;
            }

            console.log("Final Result:", finalData);
        });
    });
});