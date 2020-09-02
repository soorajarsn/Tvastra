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
