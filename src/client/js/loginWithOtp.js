
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
var form = document.getElementById('login-form');
form.addEventListener('submit',function(e){
    // if(document.querySelector('input[name=mobileNumber]').parentNode.classList.contains('active')){
        const mobileNumber = form.elements.mobileNumber.value;
        // document.querySelector('input[name=email]').parentNode.style.boxShadow = "none";
        // document.querySelector('input[name=password]').parentNode.style.boxShadow = 'none';
        console.log('mobileNumber : ',mobileNumber);
        if(!mobileNumber.trim()){
            document.querySelector('input[name=mobileNumber]').parentNode.style.boxShadow = "0 0 5px 1px red";
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
                                <p>Please fill in your Mobile Number!</p>
                             </div>`;
            document.querySelector('body').appendChild(div);
            setTimeout(() => {
                document.querySelector('body').removeChild(div);
            }, 2000);
        }
    // }
    // else{
    //     const email = form.elements.email.value;
    //     const password = form.elements.password.value;
    //     var valid = true;
    //     document.querySelector('input[name=mobileNumber]').parentNode.style.boxShadow = "none";
    //     if(!email.trim()){
    //         document.querySelector('input[name=email]').parentNode.style.boxShadow = "0 0 5px 1px red";
    //         valid = false;
    //     }
    //     if(!password.trim()){
    //         document.querySelector('input[name=password]').parentNode.style.boxShadow = "0  0 5px 1px red";
    //         valid = false;
    //     }
    //     if(!valid)
    //         e.preventDefault();
    // }
})