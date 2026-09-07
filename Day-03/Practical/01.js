/*
Task 1: Temperature Converter (day3_task1.js)
Goal: Write basic functions that take an input and return an output.
*/

function tempConverter(tempC){
    let tempF=(tempC*9/5)+32;
    console.log(`${tempC} degree celsius is equal to ${tempF} degree fahrenheit `);
}

tempConverter(30);//from celsius to fahrenheit