var result = [];
const combination  = (candidates,target) => {
    result = [];
    find(candidates,target,0,0,...[]);
    console.log(result);
    return result;
}
const find = (candidates,target,sum,start,...resultArray) => {
    if(sum > target){
        return;
    }
    else if(sum == target){
        result.push(resultArray);
    }
    else{
        for(var i = start; i < candidates.length; i++){
            find(candidates,target,sum+candidates[i],i,...resultArray,candidates[i]);
        }
    }
}
// // combination([11,13,5,88],89);
// var count = 0;
// const uniquePath = (m,n) => {
//     count = 0;
//     startCounting(1,1,m,n);
//     return count;
// }
// function startCounting(r,c,m,n){
//     if(r > m || c > n)
//         return ;
//     else if(r == m && c == n){
//         count++;
//         return;
//     }
//     else{
//         startCounting(r+1,c,m,n);
//         startCounting(r,c+1,m,n);
//     }
// }
// module.exports = uniquePath;
// console.log(uniquePath(3,2));
function convertInto24Hour(time12h){
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}
function createSlots(timeFrom,timeTo,interval){
    var hoursToAdd = parseInt(interval/60);
    var minsToAdd = parseInt(interval%60);
    var modifier = timeFrom.substring(6,8);
    var start = timeFrom;
    var slots = [];
    while(convertInto24Hour(start) < convertInto24Hour(timeTo)){
        var hh = parseInt(start.substring(0,2));
        var mm = parseInt(start.substring(3,5));
        hh = parseInt(hh)+hoursToAdd;
        mm = parseInt(mm)+minsToAdd;
        if(mm >= 60){
            mm = mm - 60;
            hh = hh+1;
            if(hh == 12){
                modifier == 'AM' ? modifier = 'PM' : modifier = 'AM';
            }
            else if(hh == 13){
                hh = 1;
            }
        } 
        if(hh < 10)
            hh = '0'+hh.toString();
        if(mm < 10)
            mm = '0'+mm.toString();
        end = `${hh}:${mm} ${modifier}`;
        slots.push([start,end].join(' - '));
        start = end;
    }
    return slots;
}
console.log(createSlots('01:00 AM','11:00 PM',30));
// console.log(convertInto24Hour('01:00 PM')<convertInto24Hour('01:00 PM'));