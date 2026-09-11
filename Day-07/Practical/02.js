function calcAverage(arr,start,end){
    let n = arr.length;
    if (n === 0) {
    return "Array cannot be empty";
    }
    else if(start>end){
        return(`Invalid Start and End value. `);

    }
    else if(end>=n){
        return(`Invalid End value it must be in between 0 to ${n}`);
    }else if(start>=n||start<0){
        return(`Invalid Start value it must be in between 0 to ${n}`);

    }
    let total =0;
    for(let i=start;i<=end;i++){
        total += arr[i];
    }
    let average = total/(end-start+1);
    return average;
}

let arr =[1,56,38,15,68,12,31,35,48,65,4,63,45];
let ans = calcAverage(arr,2,17);
console.log(ans);