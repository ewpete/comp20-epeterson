var myLat;
var myLng;
var me;
var request;
var gmap;
var meMarker;
var myLogin = "ErinHair";
var info = new google.maps.InfoWindow;

function init() {
    /* Initialize map, zoom in on Tufts */
    var map_canvas = document.getElementById("map_canvas");
    var tufts = new google.maps.LatLng(42.406484, -71.119023);
    var options = {zoom: 15, center: tufts};

    gmap = new google.maps.Map(map_canvas, options);

    locateMe();
}

function locateMe() {
    if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
        navigator.geolocation.getCurrentPosition(function(position) {
            myLat = position.coords.latitude;
            myLng = position.coords.longitude;
            renderMap();
        });
    } else {
        alert("Please try a different browser.");
    }
}

function renderMap() {
    me = new google.maps.LatLng(myLat, myLng);
    gmap.panTo(me);

    marker = new google.maps.Marker({
        position: me,
        title: "This is me, " + myLogin + ".",
        icon: "panda-icon.png"
    });
    marker.setMap(gmap);

    google.maps.event.addListener(marker, 'click',
        function() {
            info.close();
            info.setContent(this.title);
            info.open(gmap, this);
        }
    );

    reportLocation(me);
}


function reportLocation(pos) {
    request = new XMLHttpRequest();
    request.open("POST", "https://fast-thicket-9263.herokuapp.com/sendLocation");
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = locateOthers;

    request.send("login=" + myLogin +
                 "&lat="  + pos.lat() +
                 "&lng="  + pos.lng());
}

function locateOthers() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var others = JSON.parse(request.responseText);

            for(person in others) {
                if(others[person]["login"] != myLogin) {
                    var personPos = new google.maps.LatLng(others[person]["lat"], others[person]["lng"]);

                    var personMarker = new google.maps.Marker({
                        position: personPos,
                        title: "Here lies " + others[person]["login"] + ", " + calculateDistance(me, personPos) + " miles away."
                    });

                    personMarker.setMap(gmap);

                    google.maps.event.addListener(personMarker, 'click',
                        function() {
                            info.close();
                            info.setContent(this.title);
                            info.open(gmap, this);
                        }
                    );
                }
            }
        } else {
            alert("Something went wrong. Please try again.");
        }
    }
}

// https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
function calculateDistance(pos1, pos2) {
    var lat1 = pos1.lat(); 
    var lon1 = pos1.lng(); 
    var lat2 = pos2.lat(); 
    var lon2 = pos2.lng(); 

    Number.prototype.toRad = function() { return this * Math.PI / 180; };

    var R = 6371; // km 
    var x1 = lat2-lat1;
    var dLat = x1.toRad();  
    var x2 = lon2-lon1;
    var dLon = x2.toRad();  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

    return d;
}

