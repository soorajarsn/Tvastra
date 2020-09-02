document.getElementsByClassName('fa-bars')[0].addEventListener('click',function(){
    document.getElementsByClassName('fa-bars')[0].classList.toggle('fa-times');
    // console.log('toggled');
    document.getElementsByClassName('nav-open')[0].classList.toggle('display-nav');
})
window.addEventListener('resize',function(){
    var width = screen.width;
    // console.log(width);
    if(width > 1100){
        document.getElementsByClassName('nav-open')[0].classList.remove('display-nav');
        document.getElementsByClassName('fa-bars')[0].classList.remove('fa-times');
    }
})