// ===============================================================================================
// menu
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


// document.getElementsByClassName('remover')[0].addEventListener('click',function(){
//     document.getElementsByClassName('form-container')[0].classList.remove('show-popUp');
// });

// document.getElementsByClassName('add-schedule')[0].addEventListener('click',function(){
//     document.getElementsByClassName('form-container')[0].classList.add('show-popUp');
// })
// ====================================================================================================
// show and hide password
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
// =========================================================================================================
// form validation 
document.querySelectorAll('input').forEach(input=>{
    input.addEventListener('focus',function(){
        this.parentNode.classList.remove('box-shadow');
    })
})
document.querySelector('form ').addEventListener('submit',function(){
    const password = document.querySelector('input[name=password]');
    const confirmPassword = document.querySelector('input[name=confirmPassword]');
    var valid = true;
    if(!password.value){
        valid = false;
        password.parentNode.classList.add('box-shadow');
    }
    if(!confirmPassword.value){
        valid = false;
        confirmPassword.parentNode.classList.add('box-shadow');
    }
    if(valid && password.value.trim() != confirmPassword.value.trim()){
        valid = false;
        password.parentNode.classList.add('box-shadow');
        confirmPassword.parentNode.classList.add('box-shadow');
        var div = document.createElement('div');
                var cls = document.createAttribute('class');
                cls.value = 'submit-error';
                div.setAttributeNode(cls);
                div.innerHTML = `<div>
                                    <i class='far fa-check-circle' style='margin-right:1rem;'></i>
                                </div>
                                <div>
                                    <h4>Failure:</h4>
                                    <p>Both password didn't match!</p>
                                </div>`;
                document.querySelector('body').appendChild(div);
                setTimeout(() => {
                    document.querySelector('body').removeChild(div);
                }, 5000);
    }
    if(!valid)
        event.preventDefault();
})