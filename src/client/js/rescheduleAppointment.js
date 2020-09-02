const containers = document.getElementsByClassName('cards-container');


for(var i = 0; i < containers.length; i++){
    const uniqueId = containers[i].classList[0];
    const prevButton = document.getElementsByClassName(`${uniqueId}`)[0].querySelector(`.prev-button`);
    const nextButton = document.getElementsByClassName(`${uniqueId}`)[0].querySelector(`.next-button`);
    // console.log('prevButton is : ',prevButton,' next button is : ',nextButton,' uniqueId is : ',uniqueId);
    setDefaultsOnLoad(prevButton,nextButton,uniqueId);
    listenForClickOnNextButton(prevButton,nextButton,uniqueId);
    listenForClickOnPrevButton(prevButton,nextButton,uniqueId);
    listenForClickOnSlide(uniqueId);
}  

function listenForClickOnSlide(uniqueId){
    var slides = document.getElementsByClassName(`${uniqueId}`)[0].querySelectorAll('.card');
    for(var i = 0; i < slides.length; i++){
        slides[i].addEventListener('click',function(){
            const openedSlide = document.getElementsByClassName(`${uniqueId}`)[0].querySelector('.slide-open');
            if(openedSlide)
                openedSlide.classList.remove('slide-open');
            this.classList.add('slide-open');
        });
    }
}

function activateSlides(index,uniqueId){
    const screenWidth = window.innerWidth;
    var noOfActiveSlides = 3;
    var noOfSlides = document.getElementsByClassName(`${uniqueId}`)[0].querySelectorAll('.card').length;
    console.log(screenWidth);
    if(screenWidth<=320){
        noOfActiveSlides = 1;
        // console.log('no of active slides set to ',noOfActiveSlides);
    }
    else if(screenWidth <= 550){
        noOfActiveSlides = 2;
        // console.log('no of active slides set to',noOfActiveSlides);
    }
    else if(screenWidth < 700){
        noOfActiveSlides = 3;
        // console.log('no of active slides set to',noOfActiveSlides);
    }
    else if(screenWidth >= 700 && screenWidth <= 1000){
        noOfActiveSlides = 2;
        // console.log('no of active slides set to',noOfActiveSlides);
    }
    if(noOfActiveSlides >= 1){
        document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${index}`)[0].classList.add('active-slide');
    }
    if(noOfActiveSlides >= 2 && index+1 <= noOfSlides){
        document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${index+1}`)[0].classList.add('active-slide');
    }
    if(noOfActiveSlides >= 3 && index+2 <= noOfSlides){
        document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${index+2}`)[0].classList.add('active-slide');
    }
}
function disableOrActivateButtons(prevButton,nextButton,uniqueId){
    const activeSlides = document.getElementsByClassName(`${uniqueId}`)[0].querySelectorAll(`.active-slide`);
    // console.log('going to disable or activate');
    
    if(activeSlides[0].classList[0] == 1){
        if(!prevButton.classList.contains('disabled'))  //check for already disabled?
            prevButton.classList.add('disabled');//disable prev button
    }
    else
        prevButton.classList.remove('disabled'); //////Activate button
    
    if(activeSlides[activeSlides.length-1].classList[0] == document.getElementsByClassName(`${uniqueId}`)[0].querySelectorAll(`.card`).length){
        // console.log('going to disable next button');
        if(!nextButton.classList.contains('disabled'))
            nextButton.classList.add('disabled');
    }
    else{
        nextButton.classList.remove('disabled');
        // console.log('next button activated');
    }
}

function setDefaultsOnLoad(prevButton,nextButton,uniqueId){
    // window.addEventListener('load',function(){
        activateSlides(1,uniqueId);
        disableOrActivateButtons(prevButton,nextButton,uniqueId);
    // });
}

function listenForClickOnPrevButton(prevButton,nextButton,uniqueId){
    prevButton.addEventListener('click',function(){
        if(!prevButton.classList.contains('disabled')){
            const activeSlides = document.getElementsByClassName(`${uniqueId}`)[0].querySelectorAll(`.active-slide`);
            var newActiveIndex = parseInt(activeSlides[0].classList[0])-1;
            console.log('new Active slide index is',newActiveIndex);
            for(var i = 0; i < activeSlides.length; i++)
                activeSlides[i].classList.remove('active-slide');
            activateSlides(newActiveIndex,uniqueId);
            disableOrActivateButtons(prevButton,nextButton,uniqueId);
        }
    });
    
}

function listenForClickOnNextButton(prevButton,nextButton,uniqueId){
    nextButton.addEventListener('click',function(){
        if(!nextButton.classList.contains('disabled')){
            const activeSlides = document.getElementsByClassName(`${uniqueId}`)[0].querySelectorAll(`.active-slide`);
            var newActiveIndex = parseInt(activeSlides[0].classList[0])+1;
            for(var i = 0; i < activeSlides.length; i++)
                activeSlides[i].classList.remove('active-slide');
            activateSlides(newActiveIndex,uniqueId);
            disableOrActivateButtons(prevButton,nextButton,uniqueId);
        }
    })
}

window.addEventListener('resize',function(){
    const cardsContainer = document.getElementsByClassName('cards-container');
    for(var i = 0; i < cardsContainer.length; i++){
        const uniqueId = cardsContainer[i].classList[0];
        makeSlidesResponsive(uniqueId);
    }
})

function makeSlidesResponsive(uniqueId){
    const activeSlides = document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`active-slide`);
    const screenWidth = window.innerWidth;
    // var noOfActiveSlides = 3;
    // console.log(activeSlides);
    console.log(screenWidth);
    if(screenWidth<=320){
        if(activeSlides[1])
            activeSlides[1].classList.remove('active-slide');
        if(activeSlides[2])
            activeSlides[2].classList.remove('active-slide');
    }
    else if(screenWidth <= 550){
        noOfActiveSlides = 2;
        if(!activeSlides[1]){
            const secondSlideId = parseInt(activeSlides[0].classList[0])+1;
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${secondSlideId}`)[0].classList.add('active-slide');
        }
        if(activeSlides[2])
            activeSlides[2].classList.remove('active-slide');
    }
    else if(screenWidth < 700){
        noOfActiveSlides = 3;
        if(!activeSlides[1]){
            const secondSlideId = parseInt(activeSlides[0].classList[0])+1;
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${secondSlideId}`)[0].classList.add('active-slide');
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${secondSlideId+1}`)[0].classList.add('active-slide');
        }
        else if(!activeSlides[2]){
            const thirdSlideId = parseInt(activeSlides[0].classList[0])+2;
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${thirdSlideId}`)[0].classList.add('active-slide');
        }
    }
    else if(screenWidth >= 700 && screenWidth <= 1000){
        noOfActiveSlides = 2;
        if(!activeSlides[1]){
            const secondSlideId = parseInt(activeSlides[0].classList[0])+1;
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${secondSlideId}`)[0].classList.add('active-slide');
        }
        if(activeSlides[2])
            activeSlides[2].classList.remove('active-slide');
    }
    else{
        if(!activeSlides[1]){
            const secondSlideId = parseInt(activeSlides[0].classList[0])+1;
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${secondSlideId}`)[0].classList.add('active-slide');
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${secondSlideId+1}`)[0].classList.add('active-slide');
        }
        else if(!activeSlides[2]){
            const thirdSlideId = parseInt(activeSlides[0].classList[0])+2;
            document.getElementsByClassName(`${uniqueId}`)[0].getElementsByClassName(`${thirdSlideId}`)[0].classList.add('active-slide');
        }
    }
}

// var appointmentButton = document.getElementsByClassName('appointment-btn');
// for(var i = 0; i < appointmentButton.length; i++){
//     appointmentButton[i].addEventListener('click',function(){
//         event.preventDefault();
//         // location.href='/bookAppointment';
//         this.parentNode.parentNode.parentNode.getElementsByClassName('slots-container')[0].classList.add('show-slots');
//         this.parentNode.parentNode.getElementsByClassName('img-container')[0].classList.add('hide-image');
//     })
// }

document.getElementsByClassName('slots-container')[0].classList.add('show-slots');

// ================================================================
var cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('click',function(){
        var dateString = this.getElementsByClassName('date')[0].innerText.split(' ').join('-');
        var slotMainHospitalContainer = this.parentNode.parentNode.getElementsByClassName(dateString)[0];
        var slotMainContainer = slotMainHospitalContainer.getElementsByClassName('slot-main-container')[0];
        var hospitals = slotMainHospitalContainer.getElementsByClassName('hospitals')[0];
        var hospitalName = slotMainContainer.classList[1];
        console.log(slotMainContainer.classList);
        var alreadyOpenedSlide = document.getElementsByClassName('slide-open')[0];
        if(alreadyOpenedSlide)
            alreadyOpenedSlide.classList.remove('slide-open');
        if(!this.classList.contains('slide-open')){
            this.classList.add('slide-open');
        }
        var alreadyActiveSlotMainHospitalContainer = this.parentNode.parentNode.getElementsByClassName('active-slot-main-hospital-container')[0];
        if(alreadyActiveSlotMainHospitalContainer){
            alreadyActiveSlotMainHospitalContainer.classList.remove('active-slot-main-hospital-container');
        }
        if(!slotMainHospitalContainer.classList.contains('active-slot-main-hospital-container')){
            slotMainHospitalContainer.classList.add('active-slot-main-hospital-container');
        }
        var alreadyActiveSlotMainContainer = slotMainHospitalContainer.getElementsByClassName('active-slot-main-container')[0];
        if(alreadyActiveSlotMainContainer)
            alreadyActiveSlotMainContainer.classList.remove('active-slot-main-container');
        if(!slotMainContainer.classList.contains('active-slot-main-container')){
            slotMainContainer.classList.add('active-slot-main-container');
        }
        var activeHospital = hospitals.querySelector(`.active-hospital`);
        if(activeHospital)
            activeHospital.classList.remove('active-hospital');
        console.log(hospitalName);
        if(hospitalName && !hospitals.querySelector(`.${hospitalName}`).classList.contains('active-hospital'))
            hospitals.querySelector(`.${hospitalName}`).classList.add('active-hospital');
    });
});
// ==================================================================
//changing the displayed slots clicking on different hospital name, labeled below them
var hospitals = document.querySelectorAll('.hospitals .hospital');
hospitals.forEach(hospital => {
    hospital.addEventListener('click',function(){
        if(!this.classList.contains('active-hospital')){
            var activeHospital = hospital.parentNode.getElementsByClassName('active-hospital')[0];
            if(activeHospital)
                activeHospital.classList.remove('active-hospital');
            this.classList.add('active-hospital');
            var hospitalName = this.classList[1];
            var slotMainHospitalContainer = this.parentNode.parentNode;
            slotMainHospitalContainer.querySelectorAll('.slot-main-container').forEach(slotMainContainer => {
                slotMainContainer.classList.remove('active-slot-main-container');
            });
            slotMainHospitalContainer.querySelector(`.${hospitalName}`).classList.add('active-slot-main-container');
        }
        else{
            console.log('done nothing');
        }
    })
})

// =========================================================================
// post to /bookSlot after clicking on a slot;
var slots = document.querySelectorAll('.slot');
slots.forEach(slot => {
    slot.addEventListener('click',function(){
        this.parentNode.submit();
    })
})