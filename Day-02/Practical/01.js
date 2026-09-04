/*
 
Task 1: Strict vs. Loose Equality Experiment (day2_task1.js)
 
Goal: Understand why strict equality matters.
 Create two variables: enteredPin = "1234" (string) and actualPin = 1234 (number).
 Compare them using == and print the result.
 Compare them using === and print the result.
 Add a comment in your code explaining why === is safer.
 */

 let enteredPin = "1234";
 let actualPin = 1234;

 
 function loose(){
    if(enteredPin == actualPin){
    console.log(`coercision happened`);
 }
 }

 function strict(){
    if(enteredPin === actualPin){
    console.log(`Both value and type matched`);
 }
 else{
    console.log(`coercision doesn't happend beacuse it is Strict Equality it compares both value and type`);
 }
 }

 loose();
 strict();
 