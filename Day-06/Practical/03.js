/*
Task 3: Nested Employee Directory 
Goal: Navigate and mutate nested object hierarchies.
*/

const company = {
    development: {
        employee1: {
            name: "Rahul",
            age: 28,
            role: "Frontend Developer",
            salary: 60000
        },

        employee2: {
            name: "Amit",
            age: 30,
            role: "Backend Developer",
            salary: 70000
        }
    },

    design: {
        employee1: {
            name: "Priya",
            age: 26,
            role: "UI Designer",
            salary: 55000
        },

        employee2: {
            name: "Neha",
            age: 29,
            role: "UX Designer",
            salary: 65000
        }
    }
};

console.log(`Increment in salary will be given to: `);
console.log(company["design"]["employee2"]);
company["design"]["employee2"]["salary"]=75000;
console.log(`salary updated to ${company["design"]["employee2"]["salary"]}`);
company["design"]["employee2"]["incrementGiven"]=true;
console.log(`Added Increment Property`)
console.log(company["design"]["employee2"]);
company["design"]["employee3"]={
            name: "Ashish",
            age: 25,
            role: "UI Designer",
            salary: 70000
        };
console.log(company["design"]["employee3"]);