function parse() {

    var request = new XMLHttpRequest();
   
    // var params = "login=" + myLogin + "&lat=" + myLat + "&lng=" + myLng;

    var url = "http://messagehub.herokuapp.com/messages.json"
    request.open("GET", url, true);

    //Send the proper header information along with the request
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // request.setRequestHeader("Content-length", params.length);
    request.setRequestHeader("Connection", "close");
    
    request.send();  

    request.onreadystatechange = function() {//Call a function when the state changes.
        if(request.readyState == 4 && request.status == 200) {
            data = JSON.parse(request.responseText);
            // process_response2(data);
            process_data(data);
        }
    }
}

function process_data(data) {
    messages = document.getElementById('messages');
    content = ''
    var d;
    for (i = 0; i < data.length; i++) {
        d = new Date(data[i].created_at);
        content += '<div id="content">'+
                '<h3>' + data[i].username + '</h3>'+
                '<p>' + data[i].content + "  <span class =\"date\" >"
                + d.toISOString()+ "</span> </p>"

    }
    messages.innerHTML = content


}