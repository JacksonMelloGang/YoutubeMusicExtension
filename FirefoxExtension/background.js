// Path: background.js
// receive informations from the content script
// and send it to the popup
console.log("Received message");

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received message");

    var infos = request.infos;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "localhost:3000/discord", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ 
        "details": `Listening to ${infos.title}`, 
        "state": `Made by ${infos.artist}`, 
        "largeImageKey": "shiba", 
        "largeImageText": "Large Image Text", 
        "smallImageKey": "small_image", 
        "smallImageText": "Small Image Text", 
        "instance": false
    }));

    sendResponse({response: "Noice."});

});



