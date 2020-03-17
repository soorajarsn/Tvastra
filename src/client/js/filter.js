var checkboxes = document.getElementsByClassName('box');
var appended = [];
for(var i = 0; i < checkboxes.length; i++){
    checkbox = checkboxes[i];
    checkbox.addEventListener("click",function(){
        this.classList.toggle('selected');
        var e = document.querySelector('.applied-filters');
        var child = e.lastElementChild;
        while(child){
            e.removeChild(child);
            child = e.lastElementChild;
        }
        document.querySelectorAll('.selected input').forEach(function(selectedInput){
            var value = selectedInput.value;
            var div = document.createElement("div");
            div.innerHTML = value+"<span><i class='fas fa-times'></i></span>";
            console.log(div);
            console.log("Adding")
            document.getElementsByClassName('applied-filters')[0].appendChild(div);
        })
    })
};
