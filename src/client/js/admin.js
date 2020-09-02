// // import { Double } from "mongodb";

// const ctx = document.getElementById('myChart').getContext('2d');
// function setCanvas(canvas){
//     console.log('called');
//     canvas.style.width = '100%';
//     canvas.style.height = '100%';
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;
// }
// window.onload = setWidth();
// window.addEventListener('resize',function(){
//     if(window.innerWidth < 600)
//         setWidth();
//     else{
//         let chart = document.getElementById('myChart');
//         // canvas.style.height = "400px";
//         chart.parentNode.style.height = '300px';
//     }
// })
// function setWidth(){
//     if(window.innerWidth < 400)
//         setCanvas(document.getElementById('myChart'));
//     else{
//         var canvas = document.getElementById('myChart');
//         console.log('resetting');
//         canvas.width = 400,
//         canvas.height = 150
//     }
// }
// var myChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: ['2019-1','2019-2','2019-3', '2019-4', '2019-5', '2019-6', '2019-7', '2019-8','2019-9','2019-10','2019-11','2019-12'],
//         datasets: [{
//             label: 'Patients',
//             data: [5, 7, 7, 8, 9, 8 , 8 , 10, 11 ,11 ,13,12],
//             backgroundColor:[
//                 'rgba(0,0,0,0)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     mainAspectRatio:false,
//     responsive:true,
//     options: {
//         title:{
//             display:true,
//             text:'Hospital Survey',
//             fontSize:10
//         },
//         scales:{
//             yAxes:[{
//                 stacked:true,
//                 gridLines:{
//                     display:true,
//                     color:'dodgerBlue'
//                 },
//                 ticks:{
//                     beginAtZero:false,
//                     fontColor:'blue'
//                 }
//             }],
//             xAxes:[{
//                 gridLines:{
//                     diplay:true,
//                     color:'dodgerBlue'
//                 },
//                 ticks:{
//                     beginAtZero:true,
//                     fontColor:'blue'
//                 }
//             }]
//         },
//         legend:{
//             display: true,
//             labels:{
//                 fontColor:'rgb(255,23,123)',
//                 fontSize:16,
//                 boxWidth:15
//             }
//         }
//     }
// });

// window.addEventListener('beforeprint',function(event){
//     for(var id in Chart.instances){
//         Chart.instances[id].resize();
//     }
// })
// // window.addEventListener('resize',function(){
// //     // console.log(this.screen.width)
// //     if(this.screen.width < 700){
// //         this.document.getElementById('myChart').height = 400;
// //         this.console.log(this.document.getElementById('myChart').height);
// //     }
// // })
new Morris.Area({
    element:'myChart',
    data:[
        
        {month:'2019-1',value:20},
        {month:'2019-2',value:18},
        {month:'2019-3',value:19},
        {month:'2019-4',value:21},
        {month:'2019-5',value:30},
        {month:'2019-6',value:27},
        {month:'2019-7',value:33},
        {month:'2019-8',value:32},
        {month:'2019-9',value:29},
        {month:'2019-10',value:31},
        {month:'2019-11',value:34},
        {month:'2019-12',value:32},
        
    ],
    xkey:'month',
    ykeys:['value'],
    labels:['Value'],
    behaveLikeLine:true,
    fillOpacity:0
});
new Morris.Donut({
    element:'dounutChart',
    data:[
        
        {month:'2019-1',value:25},
        {month:'2019-2',value:18},
        {month:'2019-3',value:19},
        {month:'2019-4',value:21},
        {month:'2019-5',value:30},
        {month:'2019-6',value:27}
    ],
    formatter:function(y,data){
        return '';
    },
    xkey:'month',
    ykeys:['value'],
    labels:['Value'],
    behaveLikeLine:true,
    fillOpacity:0
})
// new Morris.Line({
//     // ID of the element in which to draw the chart.
//     element: 'myChart',
//     // Chart data records -- each entry in this array corresponds to a point on
//     // the chart.
//     data: [
//       { year: '2008', value: 20 },
//       { year: '2009', value: 10 },
//       { year: '2010', value: 5 },
//       { year: '2011', value: 5 },
//       { year: '2012', value: 20 }
//     ],
//     // The name of the data record attribute that contains x-values.
//     xkey: 'year',
//     // A list of names of data record attributes that contain y-values.
//     ykeys: ['value'],
//     // Labels for the ykeys -- will be displayed when you hover over the
//     // chart.
//     labels: ['Value']
//   });

// {month:'2018-1',value:20},
// {month:'2018-2',value:18},
// {month:'2018-3',value:18},
// {month:'2018-4',value:23},
// {month:'2018-5',value:33},
// {month:'2018-6',value:27},
// {month:'2018-7',value:30},
// {month:'2018-8',value:31},
// {month:'2018-9',value:29},
// {month:'2018-10',value:30},
// {month:'2018-11',value:35},
// {month:'2018-12',value:30}