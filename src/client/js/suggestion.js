var places = ["Delhi","Abu Dhabi","Amravati","Amritser","Ahemdabad","Agra","Ayodhya","Bhuvneshwar","Bareily","Badlapur","Banda","Bangalore","Noida","Ghaziabad","Calicut","Goa","Lucknow","Jhansi","Kanpur","Barabanki","Varanasi","Allahabad","Mumbai","Kolkata","Vishakhapatnam","Chennai","Trivendram","Jaipur","Gandhi Nagar","ShriNagar","Shimla","Sikkim","Dishpur","Patna"];
places.sort((a,b)=>{
    if(a>b)
        return -1;
    else if(b > a)
        return 1;
    else
        return 0;
});
// autofill();
function autofill(){
    var input = document.querySelector('.location input');
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){
            input.setAttribute("value", "Lattd:"+pos.coords.latitude+" lngtd:"+pos.coords.longitude);
        });
    }
    else{
        input.setAttribute("value","Ahemdabad");
    }
}
document.querySelector(".location input").addEventListener("keyup",function(){
    // console.log("It's listening");
    var val = this.getAttribute('value');
    console.log(val);
    var response = [];
    for(var i = 0; i < places.length; i++){
        if((places[i].toLowerCase()).startsWith(val.toLowerCase()))
            response.unshift(places[i]);//add in the starting of the list
        else if((places[i].toLowerCase).includes(val.toLowerCase()))
            response.push(places[i]);
    }
    var datalist = document.getElementById('places');
    for(var i = 0; i < response.length; i++){
        var p = document.createElement('p');
        var node = document.createTextNode(response[i]);
        p.appendChild(node);
        datalist.appendChild(p);
    }
});
// document.getElementsByTagName('form')[0].addEventListener('submit',function(event){
//     event.preventDefault();
// })