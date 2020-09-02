const mediaStream = new MediaStream();
// const socket = io('http://localhost:3000');
var speciality = ['Allergy and immunology','Anesthesiology','Aerospace medicine','Cardiology','Cardiothoracic Surgery','Dentistry','Dermatology','Bariatrics','Geriatrics','Hematology','Infection desease','Multi Organ Transplant','Neonatology','Neurology','Neurosurgery','Ophthalmology','Palliative Care','Pathology','Pediatrics','Pediatric Surgery','Radiology','Urology','Vascular Surgery'];
var treatmentList = ['Surgery','Radiation Therapy','Chemotherapy','Immunotherapy','Hormone Therapy','Stem Cell Transplant','Precision Medicine','Blood Transfustion','Vaccine Therapy','Palliative Care'];
var hospitalList = ['AIIMS','Apollo Hospital','Primus Super Speciality Hospital','Fortis Hospital','Rockland Hospital'];
var qualification = ['MBBS','MD','BDS','BHMS','DHMS','BAMS','BUMS','B.Pharm','D.Pharm','BOT','BMLT','BPT','BNYS','BVSc & AH'];
var activeMenu = document.getElementsByClassName('active-menu')[0];
var activeMenuText = activeMenu.innerText;
var menuItems = document.getElementsByClassName('menu-item');
var appliedSpeciality=[];
var appliedHospitalList=[];
var appliedQualification=[];
var appliedTreatmentList = [];
const popUps = document.getElementsByClassName('pop-up');
for(var i = 0; i < menuItems.length; i++){
    if(activeMenuText.includes(menuItems[i].innerText.trim())){
        menuItems[i].classList.add('active-menu-item');
    }
    else{
        menuItems[i].classList.remove('active-menu-item');
    }
}
activeMenu.addEventListener('click',function(event){
    document.getElementsByClassName('menu-container')[0].classList.toggle('inactive');
    activeMenu.getElementsByClassName('fas')[0].classList.toggle('fa-angle-up');
});
const imgInput = document.querySelector('input[type=file]');
imgInput.addEventListener('change',function(event){
    const file = imgInput.files;
    if(file.length !== 0){
        setTimeout(() => {
            document.querySelector('.img img').setAttribute('src',URL.createObjectURL(file[0]));
        }, 500);
    }
});

document.getElementById('edit-button').addEventListener('click',function(event){
    showpopUp(popUps[0]);
});
function showpopUp(popUp){
    popUp.classList.remove('inactive');
}
var removePopUpButton = document.getElementsByClassName('remove-pop-up');
for(var i = 0; i < removePopUpButton.length; i++){
    removePopUpButton[i].addEventListener('click',function(){
        removePopUp(this);
    })
}
function removePopUp(popUp){
    console.log(popUp);
    var container = popUp.parentNode.parentNode;
    if(!container.classList.contains('inactive'))
        container.classList.add('inactive');
}
document.getElementById('mobileNumberSubmit').addEventListener('click',function(){
    const input= document.getElementById('updateMobile');
    const number = input.value;
    if(number.length == 10 && !isNaN(number)){
        document.querySelector('form[action="/updateMobileNumber"]').submit();
    }
    else{
        popUpError('Please Enter 10 digit mobile Number correctly!');
        input.classList.add('box-shadow');
    }
});

document.querySelectorAll('input').forEach(input=>{
    input.addEventListener('focus',function(event){
        this.classList.remove('box-shadow');
    })
})
function popUpError(msg){
    var div = document.createElement('div');
        var cls = document.createAttribute('class');
        cls.value = 'error';
        div.setAttributeNode(cls);
        div.innerHTML = `<div>
                            <i class='far fa-times-circle' style='margin-right:1rem;'></i>
                        </div>
                        <div>
                            <h4>Failure:</h4>
                            <p>${msg}</p>
                        </div>`;
        document.querySelector('body').appendChild(div);
        setTimeout(() => {
            document.querySelector('body').removeChild(div);
        }, 5000);
}

document.getElementsByClassName('data-container')[0].addEventListener('submit',function(event){
    var valid = validateForm();
    var isdoctor = document.getElementsByClassName('doctor-input')[0];
    var validDoctorFields = true;
    if(isdoctor)
        validDoctorFields = validation();
    if(!valid || !validDoctorFields){
        event.preventDefault();
    }
    else{
        specialityInput.value = appliedSpeciality.join(',');
        treatmentListInput.value = appliedTreatmentList.join(',');
        console.log(treatmentListInput.value);
        hospitalListInput.value = appliedHospitalList.join(',');
        console.log(hospitalListInput.value);
        qualificationInput.value = appliedQualification.join(',');
        console.log(qualificationInput.value);
    }
})
function validateForm(){
    var requiredFields = {};
    requiredFields.email = document.querySelector('input[name=email]');
    requiredFields.name = document.querySelector('input[name=name]');
    requiredFields.gender = document.querySelector('input[name=gender]');
    requiredFields.dob = document.querySelector('input[name=dob]');
    requiredFields.city = document.querySelector('input[name=city]');
    requiredFields.state = document.querySelector('input[name=state]');
    requiredFields.country = document.querySelector('input[name=country]');
    valid = true;
    if(!requiredFields.email.value){
        valid = false
        requiredFields.email.classList.add('box-shadow');
    }
    if(!requiredFields.name.value){
        valid = false
        requiredFields.name.classList.add('box-shadow');
    }
    if(!requiredFields.gender.value){
        valid = false
        requiredFields.gender.classList.add('box-shadow');
    }
    if(!requiredFields.dob.value){
        valid = false
        requiredFields.dob.classList.add('box-shadow');
    }
    if(!requiredFields.city.value){
        valid = false
        requiredFields.city.classList.add('box-shadow');
    }
    if(!requiredFields.state.value){
        valid = false
        requiredFields.state.classList.add('box-shadow');
    }
    if(!requiredFields.country.value){
        valid = false
        requiredFields.country.classList.add('box-shadow');
    }
    return valid;
}

// ================================================================
// ==============================================================
// =========================================================
if(document.getElementsByClassName('doctor-input')[0]){
    var specialityInput = document.querySelector('input[name="speciality"]');
var treatmentListInput = document.querySelector('input[name="treatmentList"]');
var hospitalListInput = document.querySelector('input[name="hospitalList"]');
var qualificationInput = document.querySelector('input[name="qualification"]');
specialityInput.addEventListener('keyup',() => showSuggestions(specialityInput,'speciality'));
treatmentListInput.addEventListener('keyup',() => showSuggestions(treatmentListInput,'treatmentList'));
hospitalListInput.addEventListener('keyup',() => showSuggestions(hospitalListInput,'hospitalList'));
qualificationInput.addEventListener('keyup',() => showSuggestions(qualificationInput,'qualification'));
window.addEventListener('load',function(){
    specialityInput.value.split(',').forEach(e => {
        // appliedSpeciality.push(e);
        var element = document.createElement('li');
        element.innerHTML = e;
        acceptSuggestion(element,'speciality');
    });
    treatmentListInput.value.split(',').forEach(e => {
        var element = document.createElement('li');
        element.innerHTML = e;
        acceptSuggestion(element,'treatmentList');
    });
    hospitalListInput.value.split(',').forEach(e => {
        var element = document.createElement('li');
        element.innerHTML = e;
        acceptSuggestion(element,'hospitalList');
    });
    qualificationInput.value.split(',').forEach(e => {
        var element = document.createElement('li');
        element.innerHTML = e;
        acceptSuggestion(element,'qualification');
    });
    console.log(appliedHospitalList,appliedQualification,appliedSpeciality,appliedTreatmentList);
});
//===========================================================removing suggestions on focus: listening for focus======================================================
document.querySelectorAll('.doctor-input input').forEach(input=>input.addEventListener('focus',event => {
    eraseInput(event.srcElement.getAttribute('name'));
    event.srcElement.parentNode.classList.remove('error');
    hideSuggestions();
}));
document.querySelectorAll('.doctor-input').forEach(container => {
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
    console.log('showing suggestions');
    var value = input.value;
    console.log(value);
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
    console.log('suggestions are ',suggestions);
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
    if(inputName !== 'location' && inputName !== 'achievements' && inputName !== 'yearsOfExperience' && inputName !== 'profileImg' && inputName !== 'awards')
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
        console.log(appliedHospitalList);
        console.log(appliedQualification);
        console.log(appliedSpeciality);
        console.log(appliedTreatmentList);
        this.parentNode.parentNode.removeChild(this.parentNode);
    })
}

function validation(){
    specialityInputValue = appliedSpeciality.join(',');
    treatmentListInputValue = appliedTreatmentList.join(',');
    hospitalListInputValue = appliedHospitalList.join(',');
    qualificationInputValue = appliedQualification.join(',');
    var yearsOfExperience = document.querySelector('input[name="yearsOfExperience"]');
    var avgFees = document.querySelector('input[name="avgFees"]');
    var location = document.querySelector('input[name=location]');
    var awards = document.querySelector('input[name=awards]');
    var valid = true;
    if(!specialityInputValue){
        valid = false;
        specialityInput.parentNode.classList.add('box-shadow');
    }
    if(!treatmentListInputValue){
        valid = false;
        treatmentListInput.parentNode.classList.add('box-shadow');
    }
    if(!hospitalListInputValue){
        valid = false;
        hospitalListInput.parentNode.classList.add('box-shadow');
    }
    if(!qualificationInputValue){
        valid = false;
        qualificationInput.parentNode.classList.add('box-shadow');
    }
    if(!yearsOfExperience.value){
        valid = false;
        yearsOfExperience.classList.add('box-shadow');
    }
    else if(isNaN(parseInt(yearsOfExperience.value))){
        valid = false;
        yearsOfExperience.classList.add('box-shadow');
        showPopUp('Only integer input expected in experience field');
    }
    else{
        yearsOfExperience.value = parseInt(yearsOfExperience.value);
    }
    if(!avgFees.value){
        valid = false;
        avgFees.classList.add('box-shadow');
    }
    if(!location.value){
        valid = false;
        location.classList.add('box-shadow');
    }
    if(!awards.value){
        valid = false;
        awards.classList.add('box-shadow');
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
                        <p>Only Integer input for experience field!</p>
                     </div>
                     <div>
                        <i class="fas fa-times"></i>
                     </div>
                     `;
    document.querySelector('body').appendChild(div);
    listenToRemovePopUp();
}
function listenToRemovePopUp(){
    document.querySelector('.submit-error .fa-times').addEventListener('click',function(){
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    });
}

}