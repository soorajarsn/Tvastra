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
                            <h4>Login Required!</h4>
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
                            <h4>Login Required!</h4>
                         </div>`;
        document.querySelector('body').appendChild(div);
        setTimeout(() => {
            document.querySelector('body').removeChild(div);
        }, 2000);
    });
}
document.querySelector('.nav-btn-container .nav-button-white').addEventListener('click',function(e){
    console.log('listening');
    this.setAttribute('onclick',"location.href='/login/?method=email'");
    location.href = "/login/?method=email";
    console.log(this.getAttribute('onclick'));
});
var form = document.getElementById('login-form');
form.addEventListener('submit',function(e){
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    var valid = true;
    if(!email.trim()){
        document.querySelector('input[name=email]').parentNode.style.boxShadow = "0 0 5px 1px red";
        valid = false;
    }
    if(!password.trim()){
        document.querySelector('input[name=password]').parentNode.style.boxShadow = "0  0 5px 1px red";
        valid = false;
    }
    if(!valid){
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
                            <p>Please fill in the fields!</p>
                         </div>`;
        document.querySelector('body').appendChild(div);
        setTimeout(() => {
            document.querySelector('body').removeChild(div);
        }, 2000);
    }
});
// document.getElementById('forget-password').addEventListener('click',function(){
//     const email = form.elements.email.value;
//     var emailpattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

//     if(!emailpattern.test(email)){
//         document.querySelector('input[name=email]').parentNode.style.boxShadow = " 0 0 5px 1px red";
//         var div = document.createElement('div');
//         var cls = document.createAttribute('class');
//         cls.value = 'login-error';
//         div.setAttributeNode(cls);
//         div.innerHTML = `<div>
//                             <i class='far fa-times-circle' style='margin-right:1rem;'></i>
//                          </div>
//                          <div>
//                             <h4>Error:</h4>
//                             <p>Please Check your email!</p>
//                          </div>`;
//         document.querySelector('body').appendChild(div);
//         setTimeout(() => {
//             document.querySelector('body').removeChild(div);
//         }, 2000);
//     }
//     else{
//         form.setAttribute('action','/forgetPassword');
//         form.submit();
//     }
// })




// ==========================================================show and hide password===================================================================================
//Done for both PASSWORD and CONFIRMPASSWORD FIELDS because this js file is used in both EMAIL LOGIN PAGE and CHANGEPASSWORD PAGE
const passwordEye = document.getElementsByClassName('password-eye');
const confirmPasswordEye = document.getElementsByClassName('confirm-password-eye');

for(var i = 0; i < 2; i++){
    showAndHidePassword(i,passwordEye,'password');
}
for(var i = 0; i < 2; i++){
    showAndHidePassword(i,confirmPasswordEye,'confirmPassword');
}

function showAndHidePassword(i,eye,tobeToggled){
    eye[i].addEventListener('click',function(){
        eye[0].classList.toggle('active');
        eye[1].classList.toggle('active');
        if(document.querySelector(`input[name=${tobeToggled}] ~ .fa-eye-slash`).classList.contains('active')){
            document.querySelector(`input[name=${tobeToggled}]`).setAttribute('type','text');
        }
        else{
            document.querySelector(`input[name=${tobeToggled}]`).setAttribute('type','password');
        }
    })
}