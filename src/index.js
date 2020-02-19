var facilityImages = {
    '01':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img1.png',
    '02':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img2.png',
    '03':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img3.jpeg',
    '04':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img4.jpeg',
    '05':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img5.jpg',
    '06':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img6.jpg',
    '07':'https://s3.ap-south-1.amazonaws.com/appdev.konfinity.com/css/tasks/img7.jpeg'
    }
var facilityHeading = {
    '01':"Fix Consultant",
    '02':"Upload Medical Reports",
    '03':"Consult With Doctor",
    '04':"Fix Surgery",
    '05':"Hospital Sent Estimates",
    '06':"Payment",
    '07':"Surgery Completed"
}
var mobileImg = "01";

highlightDefault();

var facilities = document.querySelectorAll('.facility-box');

console.log(facilities);

var facilityCount = facilities.length;

for(var i=0;i<facilityCount;i++){
    facilities[i].addEventListener('click',function(){
        var facilityNumber = this.innerText.slice(0,2);
        console.log('facilityNumber is :'+facilityNumber);
        highlightFacilityBox(facilityNumber);
    })
}

function highlightFacilityBox(facilityNumber){
    var highlighted = document.getElementsByClassName('highlight')['0'];
    console.log("hightlighted is :"+highlighted);
    highlighted.classList.remove('highlight')
    document.getElementsByClassName(mobileImg)['0'].classList.add('hidden');
    mobileImg = facilityNumber;
    document.getElementsByClassName(mobileImg)['0'].classList.remove('hidden');
    // document.getElementsByClassName(b)
//     hightlighted.classList.remove('highlighted');
    document.getElementById(facilityNumber).classList.add('highlight');
    document.getElementsByClassName('facility-img-desktop')['0'].setAttribute('src',facilityImages[facilityNumber]);
    document.getElementsByClassName('heading-under-facility-img')['0'].innerHTML = facilityHeading[facilityNumber];
}

function highlightDefault(){
    document.getElementById("01").classList.add('highlight');
}