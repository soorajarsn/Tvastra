var name;
var mobileNumber;
var email;
const nameInput = document.querySelector('input[name=name]');
const mobileNumberInput = document.querySelector('input[name=patientMobileNumber]');
const emailInput = document.querySelector('input[name=patientEmail]');

if(document.querySelector('.appointment-details')){
    //book Appointment
    window.addEventListener('load',function(){
        name =  nameInput.value;
        mobileNumber = document.querySelector('input[name=mobileNumber]').value;
        email = emailInput.value;
    });
    
    document.querySelectorAll('input[type=radio]').forEach( input => {
        input.addEventListener('change',function(){
            var forHimself = document.querySelector('input[value=patient]').checked;
            var forSomeoneElse = document.querySelector('input[value=someoneElse]').checked;
            if(forHimself){
                nameInput.value = name;
                mobileNumberInput.value = mobileNumber;
                emailInput.value = email;
            }
            else if(forSomeoneElse){
                nameInput.value = '';
                mobileNumberInput.value = '';
                emailInput.value = '';
            }
        })
    });
    
    document.querySelector('.appointment-details form').addEventListener('submit',function(){
        var valid = validate();
        if(!valid){
            event.preventDefault();
            showPopUp('All fields are required!');
        }
    });
    
    document.querySelectorAll('.information input').forEach(input => {
        input.addEventListener('focus',function(){
            this.parentNode.classList.remove('box-shadow');
        })
    })
    
    function validate(){
        var valid = true;
        if(!document.querySelector('input[name=mobileNumber]').value)
            valid = false;
        if(!nameInput.value){
            valid = false;
            nameInput.parentNode.classList.add('box-shadow');
        }
        if(!mobileNumberInput.value){
            valid = false;
            mobileNumberInput.parentNode.classList.add('box-shadow');
        }
        if(!emailInput.value){
            valid = false;
            emailInput.parentNode.classList.add('box-shadow');
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
        },3000);
    }
    
}
else{
    // ===================================================================================================================================
    //after confirmation

    document.querySelector('#cancel').addEventListener('click',function(){
        document.querySelector('.pop-up').classList.add('show-pop-up');
    });

    document.querySelector('.pop-up #no').addEventListener('click',function(){
        document.querySelector('.pop-up').classList.remove('show-pop-up');
    });
}