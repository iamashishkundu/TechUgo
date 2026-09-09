/*
Task 8: The Target Locator

Given an array of objects, use .find() to locate a specific target.
 Safely handle the case where the target does not exist by using nullish handling.
 */

 let students = [{"name":"Ashish","marks":80,},{"name":"Aryan","marks":2,},{"name":"Aditya","marks":50,},{"name":"Arjun","marks":20,},{"name":"karan","marks":90,},];

 let ans = students.find(st=>st.name=="Arjun");
 if(ans==undefined){
    console.log(`User not found`)
 }else{
 console.log(ans);
 }