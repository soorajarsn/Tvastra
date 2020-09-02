
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
                             <p>Sign Up required!</p>
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
                             <p>Sign Up required!</p>
                          </div>`;
         document.querySelector('body').appendChild(div);
         setTimeout(() => {
             document.querySelector('body').removeChild(div);
         }, 2000);
     });
 }


var form = document.getElementById('signup-form');
form.addEventListener('submit',function(e){
    var formElements = form.elements;

    const body =  {
        name:formElements.name.value,
        email:formElements.email.value,
        password:formElements.password.value,
        confirmPassword:formElements.confirmPassword.value,
        gender:formElements.gender.value,
        dob:formElements.dob.value,
        mobileNumber:formElements.mobileNumber.value,
        city:formElements.city.value,
        state:formElements.state.value,
        country:formElements.country.value
    }


    var validfields = true,validPaswd = true;
    

    //==========field validation=============
    for (var keys in body){

        if(!body[keys].trim()){
            var input = (document.querySelector(`input[name=${keys}]`)||document.querySelector(`select[name=${keys}]`));
            input.parentNode.style.boxShadow = "0 0 4px 1px red";
            input.style.boxShadow = "0 0 3px 0px red";
            console.log("It's invalid");
            validfields = false;
        }
        else{
            var input = (document.querySelector(`input[name=${keys}]`)||document.querySelector(`select[name=${keys}]`));
            input.parentNode.style.boxShadow = "none";
            input.style.boxShadow = "none";
        }

    }
    
    
    validPaswd = validatePassword(body.password,body.confirmPassword);


    if(!validfields){
        // document.getElementById('empty-fields').innerHTML = "All fields are required";
        // document.getElementById('empty-fields').style.display = "block";
        document.getElementById('password-error').innerHTML = "";
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
                            <p>Please fill in the fields!</p>
                         </div>`;
        document.querySelector('body').appendChild(div);
        setTimeout(() => {
            document.querySelector('body').removeChild(div);
        }, 2000);
    }
    else if(!validPaswd){
        // document.getElementById('empty-fields').style.display = 'none';
        // document.getElementById('password-error').innerHTML = "Passwords need to be the same!";
        document.querySelector('input[name=password]').parentNode.style.boxShadow =  "0 0 4px 1px red";
        document.querySelector('input[name=confirmPassword]').parentNode.style.boxShadow = "0 0 4px 1px red";
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
                            <p>Password did not match!</p>
                         </div>`;
        document.querySelector('body').appendChild(div);
        setTimeout(() => {
            document.querySelector('body').removeChild(div);
        }, 2000);
    }


});
function validatePassword(password,confirmPassword){
    if(password.trim() != confirmPassword.trim())
        return false;
    else
        return true;
}


// ================================================================show and hide password================================================================================
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


// =========================================================================================================================================================================
document.querySelector('.checkbox-input input[type="checkbox"]').addEventListener('click',function(){
    document.querySelector('.checkbox i').classList.toggle('active');
})