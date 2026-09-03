/*
Exercise 4: Person Bio Card
 Create variables for a person:
 firstName (string)
 currentYear (number, e.g., 2026)
 birthYear (number)
 isStudent (boolean)
 graduationYear (set to null)
 Calculate their age dynamically: const calculatedAge = currentYear - birthYear;.
 Print a neat bio card using template literals:
    --- BIO CARD ---
Name: Rahul
Age: 26
Student Status: true
Graduation: null
*/


let person ={
    "firstName" : "Rahul",
    "currentYear" : "2026",
    "birthYear" : "2000",
    "isStudent" : "true",
    "graduationYear" : "null"
};
console.log(`Name: ${person.firstName}
Age: ${person.currentYear - person.birthYear}
Student Status: ${person.isStudent}
Graduation: ${person.graduationYear}`);