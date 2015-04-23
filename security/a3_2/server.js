// Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo initialization and connect to database
var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mapserver';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
});

app.post('/sendLocation', function(request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    response.set("Content-Type", "application/json");

    var login = request.body.login;
    var lat = request.body.lat;
    var lng = request.body.lng;

    if(login && lat && lng) {
        var toInsert = {
            "login": login,
            "lat": lat,
            "lng": lng,
            "created_at": new Date()
        };

        db.collection('locations', function(error1, coll) {
            var id = coll.insert(toInsert, function(error2, saved) {
                if(error2) {
                    response.send(500);
                }
                else {
                    
                    db.collection('locations', function(error1, coll) {
                        coll.find().toArray(function(err, cursor) {
                            response.send(JSON.stringify(cursor));
                        });
                    });

                }
            });
        });
    } else {
        response.send('{"error":"Whoops, something is wrong with your data!"}');
    }

});

app.get('/location.json', function(request, response) {

    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");

    response.set("Content-Type", "application/json");

    var login = request.param("login");

    if(login) {
        db.collection('locations', function(error1, coll) {
            coll.find({login:login}).toArray(function(err, cursor) {
                response.send(JSON.stringify(cursor));
            });
        });
    } else {
        response.send("{}");
    }

});

app.get('/', function(request, response) {

    response.set("Content-Type", "text/html");

    var indexPage = '';
    db.collection('locations', function(er, collection) {
        collection.find().toArray(function(err, cursor) {
            if (!err) {
                indexPage += "<!DOCTYPE HTML><html><head><title>Map Locations</title></head><body>";
                for (var count = 0; count < cursor.length; count++) {
                    indexPage += "<p>" + cursor[count].login + " checked in at " + cursor[count].lat + ", " + cursor[count].lng + " on " + cursor[count].created_at + "</p>";
                }
                indexPage += "</body></html>";
                response.send(indexPage);
            } else {
                response.send('<!DOCTYPE HTML><html><head><title>Map Locations</title></head><body><h1>Whoops, something went terribly wrong!</h1></body></html>');
            }
        });
    });


});

app.listen(process.env.PORT || 3000);
