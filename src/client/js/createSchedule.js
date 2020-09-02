// import { Double } from "mongodb";
// ================================================================================================
var activeMenu = document.getElementsByClassName('active-menu')[0];
var activeMenuText = activeMenu.innerText;
var menuItems = document.getElementsByClassName('menu-item');
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


document.getElementsByClassName('remover')[0].addEventListener('click',function(){
    document.getElementsByClassName('form-container')[0].classList.remove('show-popUp');
});

document.getElementsByClassName('add-schedule')[0].addEventListener('click',function(){
    document.getElementsByClassName('form-container')[0].classList.add('show-popUp');
})

// =================================================================================================================
const dayInput = document.querySelector('select[name=day]');
const timeFromInput = document.querySelector('input[name=timeFrom]');
const timeToInput = document.querySelector('input[name=timeTo]');
const hospitalInput = document.querySelector('select[name=hospital]');
const interval = document.querySelector('input[name=interval]');
document.querySelector('input').addEventListener('focus',function(){
    document.querySelectorAll('.input-container').forEach(inputContainer => {
        inputContainer.classList.remove('box-shadow');
    })
})
document.querySelector('.form-container form').addEventListener('submit',function(){
    var valid = validate();
    console.log('Is form valid : ',valid);
    console.log(timeFromInput.value);
    console.log(timeToInput.value);
    // event.preventDefault();
    if(!valid)
        event.preventDefault();
})

function validate(){
    var valid = true;
    if(!dayInput.value){
        valid = false;
        dayInput.parentNode.classList.add('box-shadow');
    }
    if(!interval.value){
        valid = false;
        interval.parentNode.classList.add('box-shadow');
    }
    else if(isNaN(interval.value) || parseInt(interval.value)%5 != 0){
        valid = false;
        interval.parentNode.classList.add('box-shadow');
        showPopUp('Interval should be an Integer and multiple of 5');
    }
    if(!timeFromInput.value){
        valid = false;
        timeFromInput.parentNode.classList.add('box-shadow');
    }
    if(!timeToInput.value){
        valid = false;
        timeToInput.parentNode.classList.add('box-shadow');
    }
    if(timeFromInput.value >= timeToInput.value){
        valid = false;
        timeFromInput.parentNode.classList.add('box-shadow');
        timeToInput.parentNode.classList.add('box-shadow');
        showPopUp('Invalid timings: Starting time should be before end time of slot');
    }
    if(!hospitalInput.value){
        valid = false;
        hospitalInput.parentNode.classList.add('box-shadow');
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
    },5000);
    listenToRemovePopUp();
}
function listenToRemovePopUp(){
    document.querySelectorAll('.submit-error .fa-times').forEach(remover=>{
        remover.addEventListener('click',function(){
            document.querySelector('body').removeChild(this.parentNode.parentNode);
         })
    });
}
// ========================================================================================================
var viewSlotButtons = document.querySelectorAll('.view-slots-button');
for(var i = 0; i < viewSlotButtons.length; i++){
    viewSlotButtons[i].addEventListener('click',function(){
        this.parentNode.parentNode.parentNode.getElementsByClassName('slots-container')[0].classList.toggle('hide-slots');
    });
}
// ===========================================================================================================
var disabledSchedules = document.getElementsByClassName('disabled-schedule');
for(var i = 0; i < disabledSchedules.length; i++){
    disabledSchedules[i].querySelector('.actions .checkbox input[name="disabled"]').checked = true;
    disabledSchedules[i].querySelectorAll('.slot-checkbox-container form input[name="disabled"]').forEach(input => {
        input.checked = true;
    });
}

var disableSchduleForms = document.querySelectorAll('.actions .checkbox form');
disableSchduleForms.forEach(form => {
    form.querySelector('input[type=checkbox]').addEventListener('click',function(){
        this.parentNode.submit();
    })
})
// ================================================================================================================
var disabledSlots = document.querySelectorAll('.disabled-slot');
disabledSlots.forEach(disabledSlot => {
    disabledSlot.querySelector('form input[type=checkbox]').checked = true;
})

var disableSlotForms = document.querySelectorAll('.slot-checkbox-container form');
disableSlotForms.forEach(form => {
    form.querySelector('input[type=checkbox]').addEventListener('click',function(){
        this.parentNode.submit();
    })
})