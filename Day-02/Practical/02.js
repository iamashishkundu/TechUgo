/*
 
Task 2: Movie Ticket Pricing (day2_task2.js)
 
Goal: Practice if, else if, else, and comparison operators.
A cinema prices tickets based on age:
 Under 5 years old: Free (Cost: 0)
 Ages 5 to 12: Child ticket (Cost: 10)
 Ages 13 to 59: Adult ticket (Cost: 20)
 60 and older: Senior ticket (Cost: 12)
 Declare a variable age = 25.
 Declare a let ticketPrice;.
 Use an if / else if / else structure to set the correct ticketPrice based on age.
 Print: Age: 25 | Ticket Price: $20.
 Change age to 4, then 10, then 65, to ensure all cases work as expected.
 */

 var age = 65;
 let ticketPrice = 0;

 if(age<5){
    ticketPrice=0;
 }else if(age<=12){
    ticketPrice=10;
 }else if(age<=59){
    ticketPrice=20;
 }else{
    ticketPrice=12;
 }
 console.log(`Age: ${age} | Ticket Price: $${ticketPrice}.`);