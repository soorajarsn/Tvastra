const redirectProfileButton = document.getElementsByClassName('profile');
for(var i = 0; i < redirectProfileButton.length; i++){
    redirectProfileButton[i].addEventListener('click',function(){
        var id = this.getAttribute('id');
        location.href = `/admin/userProfile?_id=${id}`;
        console.log('clicked and id is ',id);
    });
}