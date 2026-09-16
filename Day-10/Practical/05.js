/*
Task 5: Promisifying Error-First Callbacks

Goal: Manually convert legacy Node.js-style callback functions into modern Promise-returning functions.
*/

function getUserData(id, callback) {
    setTimeout(() => {

        if (id === 15150) {
            callback(null, {
                name: "Ashish",
                id: id
            });
        } else {
            callback(new Error("User not found"), null);
        }

    }, 1000);
}


function getUserDataPromise(id) {
    return new Promise((resolve, reject) => {

        getUserData(id, (err, data) => {

            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });

    });
}

getUserDataPromise(15150)
    .then((user) => {
        console.log("User:", user);
    })
    .catch((err) => {
        console.error("Error:", err.message);
    });