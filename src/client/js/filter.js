var checkboxes = document.getElementsByClassName('box');
var toBeAppended = {
    location:[],
    treatment:[],
    hospital:[],
    yearsOfExperience:[]
}
var appendedChilds = [];
var defaultDoctorChildsHidden = false;//used to hide all the defaultly rendered doctor cards and start showing the result based on filters when any checkbox is checked for the first time
var numberOfItemsPerPage = document.querySelectorAll('#page0 .doctor-and-slot-container').length;
var numberOfPages = document.querySelectorAll('.pages div').length;
for(var i = 0; i < checkboxes.length; i++){
    checkbox = checkboxes[i];
    checkbox.addEventListener("click",function(){
        var selected = this.classList.toggle('selected');
        if(selected)
            this.querySelector('input').checked = true;
        else
            this.querySelector('input').checked = false;
        
        var e = document.querySelector('.applied-filters');
        var child = e.lastElementChild;
        while(child){
            e.removeChild(child);
            child = e.lastElementChild;
        }
        if(!defaultDoctorChildsHidden){//when 0th, that is, first filter is applied hide all the default results for all the pages and page numbers
           hideDoctors();
           hidePageNumbers();
           defaultDoctorChildsHidden = true;
        }
        document.querySelectorAll('.selected input').forEach(function(selectedInput){
            // if(selectedInput.checked){
            // selectedInput.checked = true;
            var value = selectedInput.value;
            var inputName = selectedInput.getAttribute('name');
            bringToPageOne();
            queryDoctors(inputName,value);
            // }
            var div = document.createElement("div");
            div.innerHTML = value+"<span><i class='fas fa-times'></i></span>";
            document.getElementsByClassName('applied-filters')[0].appendChild(div);
            listenToRemoveFilter(div.querySelector('.fa-times'));
        });

        dispatchInputChangeEvent(this.querySelector('input'));//the change in input happening at the top of this block;
    })
}
function hideDoctors(){
    document.querySelectorAll('.parent-container .doctor-and-slot-container').forEach(doctorContainer => {
        doctorContainer.classList.add('hidden');
    });
}
function hidePageNumbers(){
    document.querySelectorAll('.pages div').forEach(pageNumber => {
        if(pageNumber.getAttribute('id') != 'pageNumber1')
            pageNumber.classList.add('hidden');
    })
}
function queryDoctors(inputName,value){
    // console.log('querying doctors for ',inputName,' and value ',value);
    document.querySelectorAll(`.doctor-and-slot-container .${inputName}`).forEach(p => {
        var val = p.innerText;
        var appendNode = false;


        if(inputName != 'yearsOfExperience'){
            if(val.toLowerCase().includes(value.toLowerCase()))
                appendNode = true;
        } 
        else{
            if(parseInt(val.split(' ')[0]) > parseInt(value)){
                appendNode = true;
            }
        }


        if(appendNode){
            var doctorContainer = p.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            console.log(doctorContainer.querySelector('.filtered-with'));
            console.log(`.filtered-${inputName}`);
            var filteredWith = doctorContainer.querySelector('.filtered-with').querySelector(`.filtered-${inputName}`);
            console.log(filteredWith);
            if(!filteredWith.innerText.includes(value))
                filteredWith.innerText = filteredWith.innerText + "&" +value;//so that we can know whether which cards are filtered with how many filters when a filter is removed;
            
            doctorContainer.classList.remove('hidden');
            if(!doctorContainer.classList.contains('filtered')){
                appendDoctor(doctorContainer);  
            }
        }

    })
}
function appendDoctor(doctor){
    var parentContainers = document.querySelectorAll('.parent-container');
    // console.log('found parent Containers ',parentContainers);
    for(var i = 0; i < parentContainers.length; i++){
        // console.log(`page ${i} contains ${parentContainers[i].querySelectorAll('.filtered').length} number of filtered items`);
        if(parentContainers[i].querySelectorAll('.filtered').length < numberOfItemsPerPage){
            doctor.classList.add('filtered');
            parentContainers[i].prepend(doctor);
            var pageNumber = document.querySelector(`.pages #pageNumber${i+1}`);
            pageNumber.classList.remove('hidden');
            break;
        }
    }
}
function listenToRemoveFilter(remover){
    remover.addEventListener('click',function(){
        var filter = this.parentNode.parentNode;
        var filterValue = filter.innerText;
        var input = document.querySelector(`input[value="${filterValue}"]`);
        input.checked = false;
        input.parentNode.classList.remove('selected');
        filter.parentNode.removeChild(filter);
        dispatchInputChangeEvent(input);//dispatches input change event;
    });
}
function dispatchInputChangeEvent(input){
    var event;
    if(document.createEvent){
        event = document.createEvent('HTMLEvents');
        event.initEvent('change',true,true);
        event.eventName = 'change';
        input.dispatchEvent(event);
    }
    else{
        event = document.createEventObject();
        event.eventName = 'change';
        event.eventType = 'change';
        input.fireEvent('on' + event.eventType, event);
    }
}
function bringToPageOne(){
    document.getElementsByClassName('active-page')[0].classList.remove('active-page');
    document.querySelector('.pages .active').classList.remove('active');
    document.getElementById(`page0`).classList.add('active-page');
    document.querySelector(".pages #pageNumber1").classList.add('active');
}
document.querySelectorAll('input[type=checkbox]').forEach(input => {
    input.addEventListener('change',function(){
        console.log('listening to input change and isunChecked : ',!input.checked);
        if(!input.checked){
            var name = input.getAttribute('name');
            var inputValue = input.value;
            console.log('going to call handleDoctorCardRemoval() : ',document.querySelector('.applied-filters').querySelector('div'));
            if(document.querySelector('.applied-filters').querySelector('div'))
                handleDoctorCardRemoval(name,inputValue);
            else
                location.reload();
        }
    });
});
function handleDoctorCardRemoval(inputName,inputValue){
    
    document.querySelectorAll('.filtered').forEach(filteredDoctor => {
        var filteredWith = filteredDoctor.querySelector('.filtered-with');
        var locationFilters = filteredWith.querySelector('.filtered-location');
        var treatmentFilters = filteredWith.querySelector('.filtered-treatment');
        var hospitalFilters = filteredWith.querySelector('.filtered-hospital');
        var yearsOfExperienceFilters = filteredWith.querySelector('.filtered-yearsOfExperience');
        var operatable;//the filter which implies with the given inputName;
        
        switch(inputName){

            case "location":
                if(locationFilters.innerText == `&${inputValue}` && !yearsOfExperienceFilters.innerText && !treatmentFilters.innerText && !hospitalFilters.innerText)
                    removeDoctor(filteredDoctor);
                else if(locationFilters.innerText.includes(`&${inputValue}`))
                    operatable = locationFilters;
                break;

            
            case "treatment":
                if(treatmentFilters.innerText == `&${inputValue}` && !locationFilters.innerText && !yearsOfExperienceFilters.innerText && !hospitalFilters.innerText)
                    removeDoctor(filteredDoctor);
                else if(treatmentFilters.innerText.includes(`&${inputValue}`))
                    operatable = treatmentFilters;
                break;


            case "hospital":
                if(hospitalFilters.innerText == `&${inputValue}` && !locationFilters.innerText && !treatmentFilters.innerText && !yearsOfExperienceFilters.innerText)
                    removeDoctor(filteredDoctor);
                else if(hospitalFilters.innerText.includes(`&${inputValue}`))
                    operatable = hospitalFilters;
                break;


            case "yearsOfExperience":
                if(yearsOfExperienceFilters.innerText == `&${inputValue}` && !locationFilters.innerText && !treatmentFilters.innerText && !hospitalFilters.innerText)
                    removeDoctor(filteredDoctor);
                else if(yearsOfExperienceFilters.innerText.includes(`&${inputValue}`))
                    operatable = yearsOfExperienceFilters;
                break;

        }
        
        if(operatable){
            console.log('going to remove value label');
            var innertext = operatable.innerText;
            var index = innertext.indexOf(`&${inputValue}`);
            operatable.innerText = innertext.substring(0,index)+innertext.substring(index+inputValue.length+1);//+1 for &;
        }
    
    });
    // function removeLable(filteredWith,inputName){
    //     var index = filteredWith.innerText.indexOf(inputName);
    //     filteredWith.innerText = filteredWith.innerText.substring(0,index)+filteredWith.innerText.substring(index+inputName.length);
    // }
    // if(inputName == 'yearsOfExperience'){
    //     document.querySelectorAll('.filtered').forEach(filteredDoctor => {
    //         var filteredWith = filteredDoctor.querySelector('.filtered-with').queryse;
    //         var yearsOfExperience = filteredDoctor.querySelector('.yearsOfExperience').innerText.split(' ')[0];
    //         if(filteredWith.innerText.trim() == 'yearsOfExperience' && verifyYearsOfExperienceToRemove(yearsOfExperience)){
    //             console.log('going to call removeDoctor()');
    //             removeDoctor(filteredDoctor);
    //         }
    //         else if(filteredWith.innerText.includes('yearsOfExperience') && verifyYearsOfExperienceToRemove(yearsOfExperience)){
    //             removeLable(filteredWith,inputName);
    //         }
    //     });
    // }
    // else{
    //     document.querySelectorAll('.filtered').forEach(filteredDoctor => {
    //         var filteredWith = filteredDoctor.querySelector('.filtered-with');
    //         var location = filteredDoctor.querySelector('.location').innerText;
    //         var treatments = filteredDoctor.querySelector('.treatment').innerText;
    //         var hospitals = filteredDoctor.querySelector('.hospital').innerText;
    //         if(inputName == 'location' && filteredWith.innerText.trim() == 'location' && location.includes(inputValue)){
    //             removeDoctor(filteredDoctor);
    //         }
    //         else if( inputName == 'location' && filteredWith.innerText.includes('location') && location.includes(inputValue)){
    //             removeLable(filteredWith,inputName);
    //         } 
    //     })
    // }
}
// function verifyYearsOfExperienceToRemove(yearsOfExperience){
//     console.log('verify years of .... called',document.querySelectorAll('input[name=yearsOfExperience]'));
//     var result = true;
//     // document.querySelectorAll('input[name=yearsOfExperience]').forEach(input => {
//     //     console.log(input.value,input.checked);
//     //     if(input.checked){
//     //         console.log('verifying years of exp to remove; parseInt(input.value) : ',parseInt(input.value),' and parseInt(yearsOfExperience) : ',parseInt(yearsOfExperience));
//     //     }
//     //     if(input.checked && parseInt(input.value) < parseInt(yearsOfExperience))
//     //         result = false;
//     // })
//     // console.log('going to return ',result,' from verify method');
//    return result;
// }
function removeDoctor(filteredDoctor){
    var newInnerHTML = `<p class='filtered-location'></p>
                        <p class="filtered-treatment"></p>
                        <p class="filtered-hospital"></p>
                        <p class="filtered-yearsOfExperience"></p>`;
    filteredDoctor.querySelector('.filtered-with').innerHTML = newInnerHTML;
    filteredDoctor.classList.remove('filtered');
    filteredDoctor.classList.add('hidden');
    var containerPage = filteredDoctor.parentNode;
    var pages = document.querySelectorAll('.parent-container');
    var lastPage = pages[pages.length-1];
    var pageOfFilteredDoctor = filteredDoctor.parentNode;
    fillCavity(pageOfFilteredDoctor);
    lastPage.appendChild(filteredDoctor);

}
function fillCavity(pageOfFilteredDoctor){

    var filterContainingLastPage;
    var pageNumber;
    var parentContainers = document.querySelectorAll('.parent-container');
    for(var i = 0; i < parentContainers.length; i++){
        if(parentContainers[i].querySelector('.filtered'))
            filterContainingLastPage = parentContainers[i];
        else{
            pageNumber = parseInt(parentContainers[i].getAttribute('id').substring(4))+1;
            document.querySelector(`.pages #pageNumber${pageNumber}`).classList.add('hidden');
        }
    }

    console.log('filter containing last page is ',filterContainingLastPage);
    console.log(parseInt(filterContainingLastPage.getAttribute('id').substring(4)),parseInt(pageOfFilteredDoctor.getAttribute('id').substring(4)));


    if(parseInt(filterContainingLastPage.getAttribute('id').substring(4)) > parseInt(pageOfFilteredDoctor.getAttribute('id').substring(4))){
        var filtered = filterContainingLastPage.querySelector('.filtered');
        filterContainingLastPage.removeChild(filtered);
        pageOfFilteredDoctor.appendChild(filtered);
    }


    // managing number of pages shown
    if(!filterContainingLastPage.querySelector('.filtered')){
        var pageNumber = parseInt(filterContainingLastPage.getAttribute('id').substring(4))+1;
        document.querySelector(`.pages #pageNumber${pageNumber}`).classList.add('hidden');
    }

}   

var lctn = "Delhi";
var searchFor = "hospital";
var search = "AIIMS";
if(searchFor == "hospital" || search == "treatment"){
    var input = document.querySelector(`input[value=${search}]`);
    if(!input){
        var div = document.createElement('div');
        div.className = "filter-form-row";
        div.innerHTML = `<div class='box selected'>
                            <i class="fas fa-check unchecked checked"></i>
                            <input type="checkbox" name=${searchFor} value=${search} checked>
                        </div>
                        <div class="labet-container">
                            <label for="">${search}</label>
                        </div>`;
        document.querySelector(`form#${searchFor}`).prependChild(div);
    }
}
else{

}