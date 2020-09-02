var hospitalCard = document.getElementsByClassName('doctor-container');
var l = hospitalCard.length;
for(var i = 0; i < l; i++){
    hospitalCard[i].addEventListener("click",function(){
        var id = this.getAttribute("id");
        location.href = `/hospitalDetail/?id=${id}`;
    })
}