/*
Task 2: Nested Configuration Unpacking 
Goal: Unpack deeply nested values in a single line.
 
*/
const person = {
    name: "Ashish",
    address: {
        city: "Mohali",
        location: {
            state: "Punjab",
            country: "India"
        }
    }
};

const {
    name,
    address: {
        city,
        location: {
            state,
            country
        }
    }
} = person;

console.log(name);     // Ashish
console.log(city);     // Mohali
console.log(state);    // Punjab
console.log(country);  // India