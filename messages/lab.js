function parse() {

    var request = new XMLHttpRequest();
   
    // var params = "login=" + myLogin + "&lat=" + myLat + "&lng=" + myLng;

    var url = "http://messagehub.herokuapp.com/messages.json"
    request.open("GET", url, true);

    //Send the proper header information along with the request
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
        d = format_date(data[i].created_at)
        content += '<div id="content">'+
                '<h3>' + data[i].username + '</h3>'+
                '<p>' + data[i].content + "  </p> <p class =\"date\" >"
                + d+ "</span> </p>"

    }
    messages.innerHTML = content


}
function format_date(string) {
    var m_names = new Array("January", "February", "March", 
    "April", "May", "June", "July", "August", "September", 
    "October", "November", "December");

    var d = new Date(string);
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    return m_names[curr_month] + " " + curr_date + ", " + 
    + curr_year
}
//-->