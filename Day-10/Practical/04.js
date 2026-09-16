/*
Task 4: Error Recovery & Fallbacks

Goal: Catch an error midway through a chain, recover with a fallback value, and allow downstream steps to continue.
*/

function getUser() {
    return new Promise((resolve) => {
        resolve({
            name: "Ashish",
            id: 15150
        });
    });
}

function getOrder(userId) {
    return new Promise((resolve, reject) => {
        reject(new Error("Unable to fetch order"));
    });
}

getUser()
    .then((user) => {
        return getOrder(user.id);
    })
    .catch((err) => {
        console.log("Error:", err.message);
        return {
            deliveryDate: "Not Available"
        };
    })
    .then((order) => {
        console.log("Delivery Date:", order.deliveryDate);
    });