
var map;
var service;
var infowindow;
       
function initMap() {
  var noida = new google.maps.LatLng(28.5355, 77.3910);
  infowindow = new google.maps.InfoWindow();
       
  map = new google.maps.Map(document.getElementById('map'), {center:noida,zoom:13});
  createMarker({geometry:{location:noida}});
}
       
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });;
}