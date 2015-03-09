#Lab 6: Messages#

Eric Peterson

epeter09

The goals of this lab are to:

* Learn how to send and receive HTTP requests

* Learn how to use javascript to modify html elements



Correctness: Everything has been implemented correctly

Collaboration: I did not collaborate with anyone on this assignment

Time: I spent about 1 hour on the assignment


NOTE: Explanation of error on gh-pages:

"XMLHttpRequest cannot load http://messagehub.herokuapp.com/messages.json. Origin http://tuftsdev.github.io is not allowed by Access-Control-Allow-Origin."

This error is caused because the server at http://messagehub.herokuapp.com/ has not given permission for http://tuftsdev.github.io to make GET
requests. 

This halts the javascript computation, and is the reason why the code does not display on the gh-pages site, but does display on local.
