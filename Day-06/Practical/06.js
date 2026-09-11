/*
Task 6: Grouping Data by Property 
Goal: Group flat records into categorized buckets inside an object.
*/
const employees=[
   { name: "A", department: "IT" },
   { name: "B", department: "HR" },
   { name: "C", department: "IT" },
   { name: "D", department: "Finance" },
   { name: "E", department: "HR" },
   { name: "F", department: "IT" },
   { name: "G", department: "Finance" },
];

const departmentSorted = {};

employees.forEach(emp=>{
    const departments=emp.department;
    if(!(departments in departmentSorted)){
        departmentSorted[departments]=[];
    }
    departmentSorted[departments].push(emp);
});
console.log(departmentSorted);