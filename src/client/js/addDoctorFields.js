var speciality = ['Allergy and immunology','Anesthesiology','Aerospace medicine','Cardiology','Cardiothoracic Surgery','Dermatology','Dentistry','Bariatrics','Geriatrics','Hematology','Infection desease','Multi Organ Transplant','Neonatology','Neurology','Neurosurgery','Ophthalmology','Palliative Care','Pathology','Pediatrics','Pediatric Surgery','Radiology','Urology','Vascular Surgery'];
var treatmentList = ['Surgery','Radiation Therapy','Chemotherapy','Immunotherapy','Hormone Therapy','Stem Cell Transplant','Precision Medicine','Blood Transfustion','Vaccine Therapy','Palliative Care'];
var hospitalList = ['AIIMS','Apollo Hospital','Care Hospital','Super Speciality Hospital','Fortis Hospital','Rockland Hospital','Lilavati Hospital','Ganga Ram Hospital','Manipal Hospital'];
var qualification = ['MBBS','MD','BDS','BHMS','DHMS','BAMS','BUMS','B.Pharm','D.Pharm','BOT','BMLT','BPT','BNYS','BVSc & AH'];
var appliedSpeciality=[];
var appliedHospitalList=[];
var appliedQualification=[];
var appliedTreatmentList=[];



var about = document.querySelector('textarea[name="about"]');
about.addEventListener('focus',()=>{
    about.classList.remove('error');
})
//=======================================================================showing suggestions=========================================================================
var specialityInput = document.querySelector('input[name="speciality"]');
var treatmentListInput = document.querySelector('input[name="treatmentList"]');
var hospitalListInput = document.querySelector('input[name="hospitalList"]');
var qualificationInput = document.querySelector('input[name="qualification"]');
specialityInput.addEventListener('keyup',() => showSuggestions(specialityInput,'speciality'));
treatmentListInput.addEventListener('keyup',() => showSuggestions(treatmentListInput,'treatmentList'));
hospitalListInput.addEventListener('keyup',() => showSuggestions(hospitalListInput,'hospitalList'));
qualificationInput.addEventListener('keyup',() => showSuggestions(qualificationInput,'qualification'));

//===========================================================removing suggestions on focus: listening for focus======================================================
document.querySelectorAll('input').forEach(input=>input.addEventListener('focus',event => {
    eraseInput(event.srcElement.getAttribute('name'));
    event.srcElement.parentNode.classList.remove('error');
    hideSuggestions();
}));
document.querySelector('form').addEventListener('submit',function(event){
    var valid = validation();
    if(!valid){
        event.preventDefault();
        document.querySelectorAll('input').forEach(input => {
            eraseInput(input.getAttribute('name'));
        });
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
document.querySelectorAll('.input-container').forEach(container => {
    container.addEventListener('click',function(event){
        var suggestionContainer = container.getElementsByClassName('suggestions')[0];
        if(suggestionContainer)
            if(!suggestionContainer.firstElementChild)///since in this form, if any input comes in focus its value is lost, and hence if there are more than one suggestions, then clicking one of them will bring the respective input focused(since inside input-container), and all the other suggestions would lost, hence to avoid that this condition is used, so that input inside any input-container comes in foucs on clicking input-container also for the first time only when the applied-suggestion container is empty
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
    var value = input.value;
    var suggestions = [];
    if(value.length >= 1)
        suggestions = eval(inputName).filter(filter => filter.toLowerCase().includes(value.toLowerCase()));
    suggestions = suggestions.filter(element => !eval(`applied${inputName[0].toUpperCase()+inputName.substring(1)}`).includes(element));
    var applicableFilters = document.getElementById(`applicable-${inputName}`);
    if(applicableFilters){
        var child = applicableFilters.firstElementChild;
        while(child){
            applicableFilters.removeChild(child);
            child = applicableFilters.firstElementChild;
        }
    }
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
    if(inputName !== 'location' && inputName !== 'achievements' && inputName !== 'yearsOfExperience' && inputName !== 'profileImg' && inputName !== 'awards' && inputName != 'hospitalList' && inputName != 'avgFees')
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
    var profileImg = document.querySelector('input[name="profileImg"]');
    var location = document.querySelector('input[name="location"]');
    var valid = true;
    if(!specialityInputValue){
        valid = false;
        specialityInput.parentNode.classList.add('error');
    }
    if(!treatmentListInputValue){
        valid = false;
        treatmentListInput.parentNode.classList.add('error');
    }
    if(!hospitalListInputValue){
        valid = false;
        hospitalListInput.parentNode.classList.add('error');
    }
    if(!qualificationInputValue){
        valid = false;
        qualificationInput.parentNode.classList.add('error');
    }
    if(!yearsOfExperience.value){
        valid = false;
        yearsOfExperience.parentNode.classList.add('error');
    }
    else if(isNaN(parseInt(yearsOfExperience.value))){
        valid = false;
        yearsOfExperience.parentNode.classList.add('error');
        showPopUp('Only integer input expected in experience field');
    }
    else{
        yearsOfExperience.value = parseInt(yearsOfExperience.value);
    }
    if(!avgFees.value){
        valid = false;
        avgFees.parentNode.classList.add('error');
    }
    if(profileImg.files.length == 0){
        valid = false;
        profileImg.parentNode.classList.add('error');
    }
    if(!about.value){
        valid = false;
        about.classList.add('error');
    }
    if(!location.value){
        valid = false;
        location.parentNode.classList.add('error');
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
