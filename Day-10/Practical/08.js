/*
Task 8: Capstone Mini-Engine: Asynchronous User Onboarding Pipeline

Goal: Combine custom Promise construction, sequential chaining, timeouts, and combinators.
*/

function createUser() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "Ashish",
                email: "ashish@example.com"
            });
        }, 1000);
    });
}

function createProfile(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...user,
                profile: "Profile Created"
            });
        }, 1000);
    });
}

function sendEmail(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Welcome email sent");
        }, 1000);
    });
}

function setupAccount(user) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Account setup completed");
        }, 1000);
    });
}

createUser()
    .then((user) => {
        console.log("User created:", user.name);
        return createProfile(user);
    })
    .then((user) => {
        console.log(user.profile);

        return Promise.all([
            sendEmail(user),
            setupAccount(user)
        ]);
    })
    .then((results) => {
        console.log(results);
        console.log("Onboarding completed");
    })
    .catch((err) => {
        console.error("Onboarding failed:", err.message);
    });