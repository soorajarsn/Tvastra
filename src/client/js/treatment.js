var activeCarousals = ['slide-out-left','slide-out-left','active'];
var cards,length = activeCarousals.length,mytimer;
window.addEventListener('load',function(){
        startCarousal(activeCarousals,0);
});
async function startCarousal(activeCarousals,call){
    console.log("call " + call);
    var lastCardStatus = activeCarousals[length-1];
    var activeCarousals = activeCarousals.slice(0,length-1);
    activeCarousals.unshift(lastCardStatus);
    cards = document.getElementsByClassName('card-container');
    for(var i = 0; i < cards.length; i++){
        cards[i].classList.remove('active');
        cards[i].classList.remove('inactive');
        cards[i].classList.remove('slide-out-left');
        cards[i].classList.add(activeCarousals[i]);
    }
    console.log('calling...');
    mytimer = window.setInterval(function(){
        return startCarousal(activeCarousals,call+1);
    },4000);
}
function sleep(time){
    return new Promise(resolve=>setTimeout(resolve,time));
}