/*

Task 3: Number Classifier (day3_task3.js)
Goal: Combine conditionals (if/else) inside functions with early returns.
*/

function classifier(n){
    if(n==0){
        return (`The number is Even and Zero`);
    }
    else if(n>0){
        if(n%2==0){
            return (`The number is Positive and Even`);
        }else{
            return (`The number is Positive and Odd`);
        }
    }
    else{
         if(n%2==0){
            return (`The number is Negative and Even`);
        }else{
            return (`The number is Negative and Odd`);
        }
    }
}

let number = 6;

let ans = classifier(number);

console.log(ans);