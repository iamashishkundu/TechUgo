/*
Task 5: Object Merging & Settings Override 
Goal: Apply user preferences on top of default values using spread.
 */


const systemPrefer={
    theme:"Light",
    autoSave:true,
};

const userPreference={
    theme:"Dark",
    autoSave:false,
}

const finalPreference = {...systemPrefer,...userPreference};
console.log(finalPreference);
 