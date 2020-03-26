var appointmentButton = document.getElementsByClassName('appointment-btn');
for(var i = 0; i < appointmentButton.length; i++){
    appointmentButton[i].addEventListener('click',function(){
        location.href='/bookAppointment';
    })
}