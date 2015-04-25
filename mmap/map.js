//eric peterson
//comp20
//assignment 2 - marauder's map

// map.js - javascript script to get current location, and request location of
//          other users and display them on the map, along with 
//          the distances from each user to me

//initial myLat and myLng are Tufts'
myLat = 42.4069;
myLng =71.1198;

var lmark2;
var map;
var marker;
var mapOptions;


function initialize() {

    mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(myLat, myLng)
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
                                  mapOptions);
    getMyLocation();

}
// this function gets my location, sets my image and marker on the map,
// and then calls HTTP_post to postmy location and receive info about 
// everyone else in the class

var http = require('http');

var options = {
  host: 'example.com',
  port: 80,
  path: '/foo.html'
};

http.get(options, function(resp){
  resp.on('data', function(chunk){
    //do something with chunk
  });
}).on("error", function(e){
  console.log("Got error: " + e.message);
});

function getMyLocation() {
    if (navigator.geolocation) { // if you support geolocation...
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
           
            // Pan to new location
            map.panTo(new google.maps.LatLng(myLat, myLng));

            // Set the marker
            my_position = new google.maps.LatLng(myLat,myLng); 
            //set my image           
            var my_icon = new google.maps.MarkerImage("ness.png");

            myName = "RickSoulen"
            marker = new google.maps.Marker({
                position: my_position,
                map: map,
                title: myName,
                icon: my_icon
            });
            //set my marker label when clicked
            marker.content = '<div id="content"> <h3>' + myName + '</h3> </div>';

            my_info_window = new google.maps.InfoWindow();
            // set the infowindow to pop up when clicking my marker
            google.maps.event.addListener(marker, 'click', function() {
                my_info_window.setContent(this.content);
                my_info_window.open(this.getMap(), this);
            });
            // now that all of my coordinates//marker//image//content are 
            // complete, begin the second phase of the HTTP requesting
            // to send my info and 
            HTTP_post(myLat, myLng, "RickSoulen");
        });

    }
    else {
        alert("Geolocation is not supported by your web browser.  What a shame!");
    }

}
// this function posts my position and my login to the server, and recieves
// the response with the json object of everyone else in the class' location
// and name
function HTTP_post (myLat, myLong, myLogin) {
    //initialize request
    var request = new XMLHttpRequest();
    var params = "login=" + myLogin + "&lat=" + myLat + "&lng=" + myLng;
    // var url = "https://secret-about-box.herokuapp.com/sendLocation";
    var url = "https://frozen-temple-1955.herokuapp.com/sendLocation";
    console.log("before posting");
    request.open("POST", url, true);

    //Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log("before sending post");
    request.send(params);  
    //this function is called everytime a readystate change, and only calls
    // the next function, process_response, when the final ready state is
    // reached with an OK message (ie, 200)
    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == 4 && request.status == 200) {
            //parse data
            data = JSON.parse(request.responseText);
            process_response(data);
        }
    }

}

//this function runs through every person in the JSON response and 
// calls the helper function make_marker, to add them to the map
function process_response(data) {
    length = data.length;
    for (i = 0; i < length; i++) {
        console.log(data[i]);
        make_marker(data[i], "RickSoulen");
       
    }
}
// this function takes in a single JSON object and places their marker on 
// the map
function make_marker(data, myName) {
     login = data["login"];
        if (login != myName) { //ignore myself, i've already been added
            console.log("aa");
            lat = data["lat"];
            lng = data["lng"];
            lat_lng = new google.maps.LatLng(lat, lng);
            marker = new google.maps.Marker({
                position: lat_lng,
                map: map,
                title: login
            });
            //calculate the distance from me using the haversine formula
            // d = Math.round(haversine(myLat, myLng, lat, lng)*100) / 100;
            d = 5;
            contentString = '<div id="content">'+
                '<h3>' + login + '</h3>'+
                '<p> Distance from ' + myName + ": " + d + " miles </p>"
                '</div>';  
            marker.content = contentString;
            infowindow = new google.maps.InfoWindow();
            //make the marker 
            google.maps.event.addListener(marker, 'click', function() {
                //this.XXX means marker.XXX in thie context
                infowindow.setContent(this.content);
                infowindow.open(this.getMap(), this);
            });
        }

}

//this function takes in two coordinates and calculates their distance 
//in miles - code taken from the web.
function haversine(myLat, myLng, theirLat, theirLng) {
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

