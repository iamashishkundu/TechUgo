/*
Task 5: Robust Error-First Data Fetcher 
Goal: Implement strict error-first callback conventions.
*/

function standard(err,data){
    if(err){
        console.log(`error: ${err}`);
    return;
    }
    console.log(data);
}

standard("API Fails","Hello");