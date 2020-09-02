const profileButton = document.getElementsByClassName('profile')[0];

profileButton.addEventListener('click',function(){
    document.getElementsByClassName('profile-open')[0].classList.toggle('active');
});

document.getElementsByClassName('img-section')[0].addEventListener('click',function(){
    location.href = `/admin/userProfile?_id=${this.getAttribute('id')}`;
});
const menu = document.getElementsByClassName('menu-container')[0];
document.querySelector('.search-and-bar-container .bars').addEventListener('click',function(){
    menu.classList.add('show');
});
document.querySelector('.menu-container .fa-times').addEventListener('click',function(){
    menu.classList.remove('show');
})