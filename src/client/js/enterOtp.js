// ============================================================= making navbar not to work ===========================================================================
document.querySelector('.logo-container a').addEventListener('click',function(e){
    e.preventDefault();
     var div = document.createElement('div');
         var cls = document.createAttribute('class');
         cls.value = 'login-error';
         div.setAttributeNode(cls);
         div.innerHTML = `<div>
                             <i class='far fa-times-circle' style='margin-right:1rem;'></i>
                          </div>
                          <div>
                             <h4>Error:</h4>
                             <p>Please Enter the OTP!</p>
                          </div>`;
         document.querySelector('body').appendChild(div);
         setTimeout(() => {
             document.querySelector('body').removeChild(div);
         }, 2000);
 });;
 var navAs = document.querySelectorAll('.nav-open a');
 var l = navAs.length;
 for(var i = 0; i < l; i++){
     navAs[i].addEventListener('click',function(e){
         e.preventDefault();
         console.log('listening');
         var div = document.createElement('div');
         var cls = document.createAttribute('class');
         cls.value = 'login-error';
         div.setAttributeNode(cls);
         div.innerHTML = `<div>
                             <i class='far fa-times-circle' style='margin-right:1rem;'></i>
                          </div>
                          <div>
                             <h4>Error:</h4>
                             <p>Please Enter the OTP!</p>
                          </div>`;
         document.querySelector('body').appendChild(div);
         setTimeout(() => {
             document.querySelector('body').removeChild(div);
         }, 2000);
     });
 }
// FORM VALIDATION=================================================================================================================================================


var form = document.getElementById('otp-form');
form.addEventListener('submit',function(e){
    var otp = document.getElementById('otp').value;
    if(otp.length != 4 || isNaN(parseInt(otp))){
        e.preventDefault();
        var div = document.createElement('div');
         var cls = document.createAttribute('class');
         cls.value = 'login-error';
         div.setAttributeNode(cls);
         div.innerHTML = `<div>
                             <i class='far fa-times-circle' style='margin-right:1rem;'></i>
                          </div>
                          <div>
                             <h4>Failure:</h4>
                             <p>Please Enter the OTP!</p>
                          </div>`;
         document.querySelector('body').appendChild(div);
         setTimeout(() => {
             document.querySelector('body').removeChild(div);
         }, 3000);
    }  
})


// ======================================================================INPUT FIELD==================================================================================
var inputBox = document.getElementById('otp');
var active = 'dodgerblue';
var inactive = 'dimgrey';
function avoidSpace(event){
    var k = event ? event.which : window.event.keyCode;
    if(k == 32)
        return false;
}
inputBox.onkeyup = function(event){
    var contentContainer = document.getElementsByClassName('content')[0];
    var value = inputBox.value;
    inputBox.value = value.replace(/\s/g,"");
    var l = value.length;
    var backgroundClass = ['background-0','background-1','background-2','background-3'];
    var appliedClasses = inputBox.classList;
    var k = event ? event.which : window.event.keyCode;
    if(k == 8){
        for(var i = 0; i < 4; i++){
            inputBox.classList.remove(backgroundClass[i]);
            console.log('removed');
        }
    }
    if(l < 4)
        appliedClasses.add(backgroundClass[l]);
    var width = `${25*l}%`;
    var child = contentContainer.firstChild;
    while(child){
        contentContainer.removeChild(child);
        child = contentContainer.firstChild;
    }
    contentContainer.style.width = width;
    var values = value.split('');
    var length = values.length;
    for(var i = 0; i < length; i++){
        var span = document.createElement('span');
        span.innerHTML = values[i];
        contentContainer.appendChild(span);
    }
}
var secs = 60;
window.onload = decrement();


function decrement(){
    secs--;
    if(secs < 0){
        var button = document.createElement('p');
        var style = document.createAttribute('style');
        style.value = "color:dodgerBlue;font-size:1rem;border:0;background:none;margin:1.2rem 0 1rem 0;";
        button.setAttributeNode(style);
        button.setAttribute('id','resend-button');
        button.innerHTML = "Resend";
        var resendContainer = document.getElementsByClassName('resend')[0];
        console.log(resendContainer.firstElementChild);
        resendContainer.removeChild(resendContainer.firstElementChild);
        resendContainer.appendChild(button);
        return ;
    }
    document.getElementById('sec').innerHTML = secs;
    setTimeout('decrement()',1000);
}

window.onload = setTimeout("setPostButton()",1000*(secs+1)+450);
var postButton = null;
function setPostButton(){
    postButton = document.getElementById('resend-button');
    console.log('listening');
    postButton.addEventListener('click',function(){
        var form = document.getElementById('otp-form');
        form.setAttribute('action','/loginWithOtp');
        form.submit();
    })
    
}
inputBox.addEventListener('focusout',unsetFocused);
inputBox.addEventListener('focusin',setFocused);
var contentContainer = document.getElementsByClassName('content')[0];
contentContainer.addEventListener('click',function(){
    inputBox.focus();
    setFocused();
})
function unsetFocused(){
    contentContainer.style.color = 'rgb(114, 114, 114)';
    inputBox.classList.toggle('background-unfocused')
}
function setFocused(){
    contentContainer.style.color = 'rgb(0, 153, 255)'
    inputBox.classList.remove('background-unfocused');
}