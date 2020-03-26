var activeCarousals = ['slide-out-left','slide-out-left','active'];
// window.addEventListener("resize",function(){
//     if(screen.width>700){
//         startCarousal(activeCarousals);
//     }
// });

var cards,length = activeCarousals.length;
console.log(activeCarousals,"logging from outside the function ");
window.addEventListener('load',function(){
    // window.setInterval(function(){
        startCarousal(activeCarousals);
    // },3000);
})
async function startCarousal(activeCarousals){
    console.log("startCarousal called");
    var lastCardStatus = activeCarousals[length-1];
    var activeCarousals = activeCarousals.slice(0,length-1);
    activeCarousals.unshift(lastCardStatus);
    cards = document.getElementsByClassName('card-container');
    for(var i = 0; i < cards.length; i++){
        cards[i].classList.remove('active');
        cards[i].classList.remove('inactive');
        cards[i].classList.remove('slide-out-left');
        cards[i].classList.add(activeCarousals[i]);
        console.log(activeCarousals);
    }
    window.setTimeout(function(){
        return startCarousal(activeCarousals);
    },4000);
}
function sleep(time){
    return new Promise(resolve=>setTimeout(resolve,time));
}
// }