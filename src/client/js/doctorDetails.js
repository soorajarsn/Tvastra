var accordians = document.getElementsByClassName('accordian');
for(var i = 0; i < accordians.length; i++){
    accordian = accordians[i];
    accordian.addEventListener('click',function(){
        this.classList.toggle('active');
        this.childNodes[1].childNodes[3].childNodes[1].classList.toggle('fa-angle-up');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
          panel.style.margin = "0";
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
          panel.style.margin = "1rem 0";
        } 
    })
}
var appointmentButton = document.getElementsByClassName('appointment-btn');
for(var i = 0; i < appointmentButton.length; i++){
    appointmentButton[i].addEventListener('click',function(){
        location.href='/bookAppointment';
    })
}