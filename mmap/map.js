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
            myName = "RickSoulen"
            marker = new google.maps.Marker({
                position: lmark2,
                map: map,
                title: myName,
                icon: image
            });

            contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<h3 id="firstHeading" class="firstHeading">' + myName + '</h3>'+

              '</div>'+
              '</div>';
            infowindow = new google.maps.InfoWindow({
                  content: contentString
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            marker.setMap(map);

            console.log(distance(myLat, myLng, 0, 0));

            HTTP_post(myLat, myLng, "RickSoulen");
        });

    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }

}

function HTTP_post (myLat, myLong, myLogin) {
    var request = new XMLHttpRequest();
    


    var params = "login=" + myLogin + "&lat=" + myLat + "&lng=" + myLng;

    var url = "https://secret-about-box.herokuapp.com/sendLocation";
    request.open("POST", url, true);

    //Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Content-length", params.length);
    request.setRequestHeader("Connection", "close");
    
    console.log("about to send request")
    request.send(params);  

    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == 4 && request.status == 200) {
            data = JSON.parse(request.responseText);
            console.log(data);
            text = JSON.stringify(data);
            // elem = document.getElementById("info");
            // elem.innerHTML = "<h1>" + text + "</h1>";
            process_response(data);
        }
    }

}

function process_response(data) {
    console.log("in process response");
    length = data.length;
    console.log(length);


    var infowindow = new google.maps.InfoWindow();

    var s_marker, i;

    for (i = 0; i < length-1; i++) {  
        login = data[i]["login"];
        if (login != "RickSoulen") {
            lat = data[i]["lat"];
            lng = data[i]["lng"]
            lat_lng = new google.maps.LatLng(lat, lng);
            var infowindow = new google.maps.InfoWindow();

            s_marker = new google.maps.Marker({
                position: lat_lng,
                map: map,
                title: login
            });
            d = Math.round(distance(myLat, myLng, lat, lng)*100) / 100;
            contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h3 id="firstHeading" class="firstHeading">' + login + '</h3>'+
                '<p> Distance from ' + myName + ": " + d + " miles </p>"
                '</div>' + '</div>';  
            console.log(contentString);
            elem = document.getElementById("info");
            elem.innerHTML = contentString;
            google.maps.event.addListener(s_marker, 'click', (function(s_marker, i) {
                return function() {
                      infowindow.setContent(contentString);
                      infowindow.open(map, s_marker);
                }
            })(s_marker));

            // google.maps.event.addListener(s_marker, 'click', function() {
            //         infowindow.setContent(contentString);
            //         infowindow.open(map, s_marker);

            //     });
        }
    }
}
        



function distance(myLat, myLng, theirLat, theirLng) {
    Number.prototype.toRad = function() {
       return this * Math.PI / 180;
    }

    var lat2 = myLat; 
    var lon2 = myLng; 
    var lat1 = theirLat; 
    var lon1 = theirLng; 

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

