var settings = document.getElementsByClassName('settings')[0];
var count = 0;


settings.addEventListener('click',function(){
    console.log(screen.width);
    // if(screen.width >= 1000)/{
        count++;
        applySettings(count%4);
    // }/
});


function resetSettings(bodyContainer){
    bodyContainer.classList.remove('version-101');
    bodyContainer.classList.remove('version-102');
    bodyContainer.classList.remove('version-101-102');
}


function applySettings(type){
    var bodyContainer = document.getElementsByClassName('body-container-2')[0];
    if(!bodyContainer){
        bodyContainer = document.getElementsByClassName('body-container')[0];
    }
    resetSettings(bodyContainer);
    var version = settings.querySelector('div');
    if(type == 0)
        version.innerText = "Version 1.0.0";
    else if(type == 1){
        bodyContainer.classList.add('version-101');
        version.innerText = "Version 1.0.1";
    }   
    else if(type == 2){
        bodyContainer.classList.add('version-102');
        version.innerText = "Version 1.0.2";
    }   
    else if(type == 3){
        bodyContainer.classList.add('version-101');
        bodyContainer.classList.add('version-102');
        bodyContainer.classList.add('version-101-102');
        version.innerText = "Version 1.0.3"
    }    
}