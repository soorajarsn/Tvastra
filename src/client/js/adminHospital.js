var speciality = ['Allergy and immunology','Anesthesiology','Aerospace medicine','Cardiology','Cardiothoracic Surgery','Dentistry','Dermatology','Bariatrics','Geriatrics','Hematology','Infection desease','Multi Organ Transplant','Neonatology','Neurology','Neurosurgery','Ophthalmology','Palliative Care','Pathology','Pediatrics','Pediatric Surgery','Radiology','Urology','Vascular Surgery'];
var treatmentList = ['Surgery','Radiation Therapy','Chemotherapy','Immunotherapy','Hormone Therapy','Stem Cell Transplant','Precision Medicine','Blood Transfustion','Vaccine Therapy','Palliative Care'];
var appliedSpeciality=[];
var appliedTreatmentList = [];
var invalidnoOfBeds = false;
var edit = document.getElementsByClassName('edit-hospital');
const editForm = document.querySelector('.form-container form');
const nameInput = editForm.querySelector('input[name=name]');
const locationInput = editForm.querySelector('input[name=location]');
const noOfBedsInput = editForm.querySelector('input[name=noOfBeds]');
const packageInput = editForm.querySelector('textarea[name=package]');
const doctorInput = editForm.querySelector('input[name=doctors]');
const chargeInput = editForm.querySelector('input[name=charge]');
const infrastructureInput = editForm.querySelector('textarea[name=infrastructure]');
const membershipInput = editForm.querySelector('textarea[name=membership]');
for(var i = 0; i < edit.length; i++){
    edit[i].addEventListener('click',function(){
        const id = this.parentNode.getAttribute('id');
        document.getElementsByClassName('form-container')[0].classList.add('show-popUp');
        let name =  document.getElementById(`${id}`).querySelector(`.info-container h2`).innerText;
        let location = document.getElementById(`${id}`).querySelector(`.info-container .location`).innerText;
        let noOfBeds = parseInt(document.getElementById(`${id}`).querySelector(`.info-container .noOfBeds`).innerText);
        let infrastructure = document.getElementById(`${id}`).querySelector(`.hidden-data .infrastructure`).innerText;
        let membership = document.getElementById(`${id}`).querySelector(`.hidden-data .membership`).innerText;
        let pckg = document.getElementById(`${id}`).querySelector(`.hidden-data .package`).innerText;
        let doctors = document.getElementById(`${id}`).querySelector(`.hidden-data .doctors`).innerText;
        let charge = document.getElementById(`${id}`).querySelector(`.hidden-data .charge`).innerText;
        let treatments = document.getElementById(`${id}`).querySelector('.info-container .treatments').innerText.split(', ').join(',');
        let specialityValue = document.getElementById(`${id}`).querySelector('.hidden-data .specialization').innerText;
        
        resetForm();

        console.log(noOfBeds);
        nameInput.value = name;
        if(location != 'N/A')
            locationInput.value = location;
        if(noOfBeds > 1)
            noOfBedsInput.value = noOfBeds;
        if(infrastructure)
            infrastructureInput.value = infrastructure;
        if(pckg)
            packageInput.value = pckg;
        if(doctors)
            doctorInput.value = doctors;
        if(charge)
            chargeInput.value = charge;
        if(membership)
            membershipInput.value = membership;
        treatments.split(',').forEach(e => {
            var element = document.createElement('li');
            element.innerHTML = e;
            acceptSuggestion(element,'treatmentList');
        });
        specialityValue.split(',').forEach(e => {
            var element = document.createElement('li');
            element.innerHTML = e;
            acceptSuggestion(element,'speciality');
        });
        
        editForm.setAttribute('action',`/verifyHospital?id=${id}`);
    });
}
document.getElementsByClassName('remover')[0].addEventListener('click',function(){
    document.getElementsByClassName('form-container')[0].classList.remove('show-popUp');
});
document.querySelector('input').addEventListener('focus',function(){
    document.querySelectorAll('.input-container').forEach(inputContainer => {
        inputContainer.classList.remove('box-shadow');
    })
})
editForm.addEventListener('submit',event => {
    const valid = validate();
    const validFiltered = validation();
    if(!valid || !validFiltered){
        event.preventDefault();
        if(invalidnoOfBeds)
            showPopUp('Please Enter Integer for number of beds!');
        else
            showPopUp('All the highLighted fields are required!');
    }
    else{
        specialityInput.value = appliedSpeciality.join(',');
        treatmentListInput.value = appliedTreatmentList.join(',');
    }
})

function resetForm(){
    nameInput.value = '';
    locationInput.value = '';
    noOfBedsInput.value = '';
    packageInput.value = '';
    doctorInput.value = '';
    chargeInput.value = '';
    infrastructureInput.value = '';
    membershipInput.value = '';
    appliedSpeciality = [];
    appliedTreatmentList = [];
}

function validate(){
    var valid = true;
    if(!nameInput.value){
        valid = false;
        nameInput.parentNode.classList.add('box-shadow');
    }
    if(!locationInput.value){
        valid = false;
        locationInput.parentNode.classList.add('box-shadow');
    }
    if(!noOfBedsInput.value){
        valid = false;
        noOfBedsInput.parentNode.classList.add('box-shadow');
    }
    else if(isNaN(noOfBedsInput.value)){
        valid = false;
        noOfBedsInput.parentNode.classList.add('box-shadow');
        invalidnoOfBeds = true;
    }
    else{
        invalidnoOfBeds = false;
    }
    if(!infrastructureInput.value){
        valid = false;
        infrastructureInput.parentNode.classList.add('box-shadow');
    }
    if(!packageInput.value){
        valid = false;
        packageInput.parentNode.classList.add('box-shadow');
    }
    if(!chargeInput.value){
        valid = false;
        chargeInput.parentNode.classList.add('box-shadow');
    }
    if(!doctorInput.value){
        valid = false;
        doctorInput.parentNode.classList.add('box-shadow');
    }
    if(!membershipInput.value){
        valid = false;
        membershipInput.parentNode.classList.add('box-shadow');
    }
    return valid;
}


// ========================================================================================================================================================
// ========================================================================================================================================================
// ========================================================================================================================================================
var specialityInput = document.querySelector('input[name="speciality"]');
var treatmentListInput = document.querySelector('input[name="treatmentList"]');
specialityInput.addEventListener('keyup',() => showSuggestions(specialityInput,'speciality'));
treatmentListInput.addEventListener('keyup',() => showSuggestions(treatmentListInput,'treatmentList'));

//===========================================================removing suggestions on focus: listening for focus======================================================
document.querySelectorAll('.display-flex input').forEach(input=>input.addEventListener('focus',event => {
    eraseInput(event.srcElement.getAttribute('name'));
    hideSuggestions();
}));
document.querySelectorAll('.display-flex').forEach(container => {
    container.addEventListener('click',function(event){
        var suggestionContainer = container.getElementsByClassName('suggestions')[0];
        if(suggestionContainer)
            if(!suggestionContainer.firstElementChild)///since in this form, if any input comes in focus its value is lost, and hence if there are more than one suggestions, then clicking one of them will bring the respective input focused(since inside doctor-input), and all the other suggestions would lost, hence to avoid that this condition is used, so that input inside any doctor-input comes in foucs on clicking doctor-input also for the first time only when the applied-suggestion container is empty
                this.getElementsByTagName('input')[0].focus();
    });
});
document.querySelectorAll('.suggestions').forEach(suggestion => {
    suggestion.addEventListener('click',event => { 
        event.preventDefault();
    });
});
// =======================================================================utility methods=============================================================================

//this method shows suggestions based on the value that is being typed in inputs
function showSuggestions(input,inputName){
    // console.log('showing suggestions');
    var value = input.value;
    // console.log(value);
    var suggestions = [];
    if(value.length >= 1)
        suggestions = eval(inputName).filter(filter => filter.toLowerCase().startsWith(value.toLowerCase()));
    suggestions = suggestions.filter(element => !eval(`applied${inputName[0].toUpperCase()+inputName.substring(1)}`).includes(element));
    var applicableFilters = document.getElementById(`applicable-${inputName}`);
    if(applicableFilters){
        var child = applicableFilters.firstElementChild;
        while(child){
            applicableFilters.removeChild(child);
            child = applicableFilters.firstElementChild;
        }
    }
    // console.log('suggestions are ',suggestions);
    suggestions.forEach(element => {
        var li = document.createElement('li');
        li.innerHTML = element;
        // li.style.display = "block";
        listenForClicks(li,inputName);
        applicableFilters.appendChild(li);
    })
}

//=================================================this method hides the suggestions when any other input comes in focus==============================================
function hideSuggestions(){
    var suggestions = document.getElementsByClassName('suggestions');
    var nOfSuggestions = suggestions.length;
    for(var i = 0; i < nOfSuggestions; i++){
            var child = suggestions[i].firstElementChild;
            while(child){
                suggestions[i].removeChild(child);
                child = suggestions[i].firstElementChild;
            }
    }
}

//=================================================this method adds the clicked value to the respective input Array;==================================================
function acceptSuggestion(element,inputName){//inputName suggests whether the active input was speciality, hospitalList, TreatmentList or qualification
    var appliedArray = eval(`applied${inputName[0].toUpperCase()+inputName.substring(1)}`);
    appliedArray.unshift(element.innerHTML);
    console.log('input name is ',inputName,appliedArray);
    var appliedContainer = document.getElementById(`applied-${inputName}`);
    var child = appliedContainer.firstElementChild;
    while(child){
        appliedContainer.removeChild(child);
        child = appliedContainer.firstElementChild;
    }
    appliedArray.forEach(e => {
        var li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-times"></i> ${e}`;
        removeAppliedSuggestionOnclick(li,inputName);
        appliedContainer.appendChild(li);
    })
}

//================================= this method lets the event listener start listening for clicks on currently suggested li===========================================
function listenForClicks(element,inputName){//element denotes that li which now shown now under suggestions
    element.addEventListener('click',function(){
        acceptSuggestion(element,inputName);
        showSuggestions(document.querySelector(`input[name=${inputName}]`),inputName);
    });
}
// ===================================================================================================================================================================
function eraseInput(inputName){
    console.log('erasing');
    if(inputName == 'speciality' || inputName == 'treatmentList')
        document.querySelector(`input[name=${inputName}]`).value = "";
}

function removeAppliedSuggestionOnclick(li,inputName){
    li.getElementsByTagName('i')[0].addEventListener('click',function(){
        var value = this.parentNode.innerText;
        inputArrayName = `applied${inputName[0].toUpperCase()+inputName.substring(1)}`;
        switch(inputArrayName){
            case 'appliedSpeciality':
                appliedSpeciality = appliedSpeciality.filter(e => e !== value);
                break;
            case 'appliedTreatmentList':
                appliedTreatmentList = appliedTreatmentList.filter(e => e !== value);
                break;
            case 'appliedQualification':
                appliedQualification = appliedQualification.filter(e => e !== value);
                break;
            case 'appliedHospitalList':
                appliedHospitalList = appliedHospitalList.filter(e => e !== value);
                break;
        }
        // console.log(appliedHospitalList);
        // console.log(appliedQualification);/
        // console.log(appliedSpeciality);
        // console.log(appliedTreatmentList);
        this.parentNode.parentNode.removeChild(this.parentNode);
    })
}

function validation(){
    specialityInputValue = appliedSpeciality.join(',');
    treatmentListInputValue = appliedTreatmentList.join(',');
    var valid = true;
    if(!specialityInputValue){
        valid = false;
        specialityInput.parentNode.classList.add('box-shadow');
    }
    if(!treatmentListInputValue){
        valid = false;
        treatmentListInput.parentNode.classList.add('box-shadow');
    }
    return valid;
}
function showPopUp(msg){
    var div = document.createElement('div');
    var cls = document.createAttribute('class');
    cls.value = 'submit-error';
    div.setAttributeNode(cls);
    div.innerHTML = `<div>
                        <i class='far fa-times-circle' style='margin-right:1rem;'></i>
                      </div>
                     <div>
                        <h4>Error:</h4>
                        <p>${msg}</p>
                     </div>
                     <div>
                        <i class="fas fa-times"></i>
                     </div>
                     `;
    document.querySelector('body').appendChild(div);
    setTimeout(function(){
        document.querySelector('body').removeChild(div);
    },3000);
    listenToRemovePopUp();
}
function listenToRemovePopUp(){
    document.querySelector('.submit-error .fa-times').addEventListener('click',function(){
       document.querySelector('body').removeChild(this.parentNode.parentNode);
    });
}
