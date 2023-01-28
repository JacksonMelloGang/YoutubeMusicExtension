// Path: background.js
// receive informations from the content script
// and send it to the popup
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received message");

    var infos = request.infos;

    console.log(infos);

    $.ajax({
        type: "POST",
        url: "http://localhost:3000/discord",
        data: JSON.stringify({
            "details": `Listening to ${infos.title}`,
            "state": `Made by ${infos.artist}`,
            "time": infos.time,
            "largeImageKey": "shiba",
            "largeImageText": "Large Image Text",
            "smallImageKey": "small_image",
            "smallImageText": "Small Image Text",
            "instance": false,
        }),

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
            console.log(data);
        },

        failure: function(errMsg) {
            console.log(errMsg);
        }
    });

    sendResponse({response: "Noice."});
    return true;
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      // Send a message to the content script
      browser.tabs.sendMessage(tabId, { message: "Tab updated" });
    }
    
}, {urls: ["https://music.youtube.com/*"]});
  
  