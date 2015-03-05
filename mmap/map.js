myLat = 0;
myLng = 0;
var lmark2;
var map;
var marker;
var mapOptions;

function initialize() {

     mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(myLat, myLng)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
                                  mapOptions);

    lmark2 = new google.maps.LatLng(myLat,myLng);
    marker = new google.maps.Marker({
        position: lmark2,
        map: map,
        title: "RickSoulen"
    });

    marker.setMap(map);
    
    getMyLocation();

    // // This is a global info window...
    // var infowindow = new google.maps.InfoWindow();
    
    // // Open info window on click of marker
    // google.maps.event.addListener(marker, 'click', function() {
    //     infowindow.setContent(marker.title);
    //     infowindow.open(map, marker);
    // });

}



function getMyLocation() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
                myLat = position.coords.latitude;
                myLng = position.coords.longitude;
                elem = document.getElementById("info");
                elem.innerHTML = "<h1>You are in " + myLat + ", " + myLng + "</h1>";

            });
    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }


}