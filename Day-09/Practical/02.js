/*
 
Task 2: Terminal Countdown Timer 
Goal: Implement a recurring countdown loop using setInterval and clearInterval.

*/

function countdown(num){
    let count=setInterval(() => {
      console.log(num);
      num--;  
       if(num==0){
        clearInterval(count);
    }
    },1000);
   
}

countdown(9);