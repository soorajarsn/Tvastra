var accordians = document.getElementsByClassName('accordian');
for(var i = 0; i < accordians.length; i++){
    accordian = accordians[i];
    accordian.addEventListener('click',function(){
        // var active = document.getElementsByClassName('active')[0];
        // if(active)
        //     active.classList.remove('active');
        this.classList.toggle('active');
        this.childNodes[1].childNodes[3].childNodes[1].classList.toggle('fa-angle-up')
        // console.log(this.classList);
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
    })
}