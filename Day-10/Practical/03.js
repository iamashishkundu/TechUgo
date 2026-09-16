/*
Task 3: Value Transformation Chain

Goal: Pass transformed data across a series of dependent .then() handlers.
*/

function getUser() {
    return new Promise((resolve) => {
        resolve({
            name: "Ashish",
            id: 15150,
        });
    });
}

function getOrder(userId) {
    return new Promise((resolve) => {
        resolve({
            userId: userId,
            packedDate: "13/09/2026",
            deliveryDate: "16/09/2026",
        });
    });
}

function getDeliveryDate(deliveryDate) {
    return new Promise((resolve) => {
        resolve(`Ashish your order will be delivered on ${deliveryDate}`);
    });
}

getUser()
    .then((user) => getOrder(user.id))
    .then((order) => getDeliveryDate(order.deliveryDate))
    .then((details) => console.log("Details:", details))
    .catch((err) => console.error("Something failed:", err.message));