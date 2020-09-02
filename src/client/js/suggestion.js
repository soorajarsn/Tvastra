var places = ["New Delhi","Abu Dhabi","Amravati","Amritser","Ahemdabad","Agra","Ayodhya","Bhuvneshwar","Bareily","Badlapur","Banda","Bangalore",
                "Greater Noida","Ghaziabad","Calicut","Goa","Lucknow","Jhansi","Kanpur","Barabanki","Varanasi","Allahabad","Mumbai","Kolkata","Vishakhapatnam",
                "Chennai","Trivendram","Jaipur","Gandhi Nagar","ShriNagar","Shimla","Sikkim","Dishpur","Patna","Gorakhpur","MujaffarNagar","Gonda","Bahraich",
                "Ayodhya","Prayag","Sitapur","Bhopal","Hardoi","Dehradun"];
places.sort((a,b)=>{
    if(a>b)
        return -1;
    else if(b > a)
        return 1;
    else
        return 0;
});
// autofill();
var userLocation = '';
var searchedFor = "";
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
    console.log("It's listening");
    var val = this.value;
    console.log(val);
    // console.log(this.innerText);
    var response = [];
    if(val.length >= 2)
        for(var i = 0; i < places.length; i++){
            if(places[i].toLowerCase().startsWith(val.toLowerCase()))
                response.unshift(places[i]);//add in the starting of the list
            else if(places[i].toLowerCase().includes(val.toLowerCase()))
                response.push(places[i]);
        }
    var datalist = document.getElementById('places');
    var child = datalist.firstElementChild;
    while(child){
        datalist.removeChild(child);
        child = datalist.firstElementChild;
    }
    for(var i = 0; i < response.length; i++){
        var div = document.createElement('div');
        var textNode = document.createTextNode(response[i]);
        div.appendChild(textNode);
        datalist.appendChild(div);
        listenForClicks(div);
    }
});
function listenForClicks(div){
    div.addEventListener('click',function(){
        document.querySelector('.location input').value = div.innerText;
        userLocation = div.innerText;
        div.parentNode.innerHTML = "";
    });
}

document.querySelector('.search-input').addEventListener('keyup',function(){
    var value = this.value;
    console.log(value);
    var datalist = document.querySelector('#search-for-doctors-and-all');
    var child = datalist.firstElementChild;
    while(child){
        datalist.removeChild(child);
        child = datalist.firstElementChild;
    }
    if(value.length >= 4){
        for(var i = 0; i < 3; i++){
            var div = document.createElement('div');
            
            if(i == 0)
                div.innerHTML = `${value} <i class="fas fa-user-md"></i>`;
            else if(i == 1)
                div.innerHTML = `${value} <i class="fas fa-stethoscope"></i>`;
            else 
                div.innerHTML = `${value} <i class="far fa-hospital"></i>`;
            
            datalist.appendChild(div);
            listenForClicksOnSecondInput(div);
        }
    }
})
function listenForClicksOnSecondInput(div){
    div.addEventListener('click',function(){
        var value = div.innerText;
        var classList = div.querySelector('i').classList;
        document.querySelector('.search input').value = value;
        if(classList.contains('fa-user-md'))
            searchedFor = "doctor:"+value;
        else if(classList.contains('fa-stethoscope'))
            searchedFor = "treatment:"+value;
        else if(classList.contains('fa-hospital'))
            searchedFor = "hospital:"+value;
        div.parentNode.innerHTML = "";
    });
}

document.getElementsByTagName('form')[0].addEventListener('submit',function(event){
    event.preventDefault();
    var valid = true;
    var locationInput = document.querySelector('.location input');
    var searchedForInput = document.querySelector('.search input');
    if(!userLocation || userLocation != locationInput.value){
        document.querySelector('.location').classList.add('error-box-shadow');
        valid = false;
    }
    if(!searchedFor || searchedFor.split(":")[1] !== searchedForInput.value){
        document.querySelector('.search').classList.add("error-box-shadow");
        valid = false;
    }
    if(valid){
        searchedForInput.value = searchedFor;
        this.submit();
    }
})
