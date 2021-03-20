
// Form
function sendEvents() {

    document.getElementById("sendevents").disabled = true;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "api/send-event-matches");
    xhr.send();
}

