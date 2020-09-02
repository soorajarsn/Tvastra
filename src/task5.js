// var result = [];
// const combination  = (candidates,target) => {
//     result = [];
//     find(candidates,target,0,0,...[]);
//     console.log(result);
// }
// const find = (candidates,target,sum,'start',...resultArray) => {
//     if(sum > target){
//         return;
//     }
//     else if(sum == target){
//         result.push(resultArray);
//     }
//     else{
//         for(var i = 'start'; i < candidates.length; i++){
//             find(candidates,target,sum+candidates[i],i,...resultArray,candidates[i]);
//         }
//     }
// }
// module.exports = combination;
// // combination([2,3,6,7],7)
// // combination([2,3,5],8)
// // combination([11,13,5,88],89)
// // combination([2,3,5],8)
// // combination([2,3,6,7],7)
// // combination([12,34,5,3],16)
// const pairSplit = string => {
//     var arr = [];
//     var count = 0;
//     while(count < string.length){
//         arr.push(string.substring(count,count+2));
//         count+=2;
//     }
//     if(arr[arr.length-1].length == 1)
//         arr[arr.length-1] = `${arr[arr.length-1]}_`;
//     console.log(arr);
// }
// module.exports = pairSplit;
// // pairSplit('abc')
// // pairSplit('abcdef')

// const decoder = number => {
//     object = {
//         'A':2,
//         'B':2,
//         'C':2,
//         'D':3,
//         'E':3,
//         'F':3,
//         'G':4,
//         'H':4,
//         'I':4,
//         'J':5,
//         'K':5,
//         'L':5,
//         'M':6,
//         'N':6,
//         'O':6,
//         'P':7,
//         'Q':7,
//         'R':7,
//         'S':7,
//         'T':8,
//         'U':8,
//         'V':8,
//         'W':9,
//         'X':9,
//         'Y':9,
//         'Z':9
//     }
//     var result = '';
//     for(var i = 0; i < number.length; i++){
//         if(number.charCodeAt(i) >= 65 && number.charCodeAt(i) <= 90){
//             result+=object[number[i]];
//         }
//         else{
//             result+=number[i];
//         }
//     }
//     console.log(result);
// }
// module.exports = decoder;
// // decoder("123-647-EYES");


const conjugate = (string,number) => {
    string = string.substring(0,string.length-3);
    var table = {
        1:{
            'start':'Io',
            'end':'o'
        },
        2:{
            'start':'Tu',
            'end':'i'
        },
        3:{
            'start':'Egli',
            'end':'a'
        },
        4:{
            'start':'Noi',
            'end':'iamo'
        },
        5:{
            'start':'Voi',
            'end':'ate'
        },
        6:{
            'start':'Essi',
            'end':'ano'
        }
    }
    var prefix = table[number]['start'];
    var suffix = table[number]['end'];
    var endsWith = string[string.length-1];
    if((endsWith == 'c'|| endsWith == 'g') && (number == 2 || number == 4)){
        suffix = 'h'+ suffix;
    }
    if(endsWith == 'i' && (number == 2 || number == 4))
        suffix = suffix.substring(1);
   console.log(`${prefix} ${string+suffix}`);
}
module.exports = conjugate;
conjugate("programmare", 5)