myLat = 0;
myLng = 0;
var lmark2;
var map;
var marker;
var mapOptions;

var infowindow = new google.maps.InfoWindow();


function initialize() {

    mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(myLat, myLng)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
                                  mapOptions);
    getMyLocation();

}



function getMyLocation() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            elem = document.getElementById("info");
            elem.innerHTML = "<h1>You are in " + myLat + ", " + myLng + "</h1>";

            // Pan to new location
            map.panTo( new google.maps.LatLng( myLat, myLng ) );

            // Set the marker
            lmark2 = new google.maps.LatLng(myLat,myLng);
            var image = 'drum.png';

            marker = new google.maps.Marker({
                position: lmark2,
                map: map,
                title: "RickSoulen",
                icon: image
            });

            
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);
            });

            marker.setMap(map);

            console.log(distance(myLat, myLng, 0, 0));


        });

    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }

}

function HTTP_post (myLat, myLong, login) {

    var request = new XMLHttpRequest();

}


function distance(myLat, myLng, theirLat, theirLon) {
    Number.prototype.toRad = function() {
       return this * Math.PI / 180;
    }

    var lat2 = myLat; 
    var lon2 = myLng; 
    var lat1 = theirLat; 
    var lon1 = theirLon; 

    var R = 6371; // km 
    //has a problem with the .toRad() method below.
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

    // alert(d);
    return d;
}

