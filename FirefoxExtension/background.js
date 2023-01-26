// Path: background.js
// receive informations from the content script
// and send it to the popup
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type == "infos") {
        browser.runtime.sendMessage({
            type: "infos",
            infos: request.infos
        });

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ "details": "John", "state": 30, "startTimestamp": new Date(), "largeImageKey": "large_image", "largeImageText": "Large Image Text", "smallImageKey": "small_image", "smallImageText": "Small Image Text", "instance": true }));
    }
});



