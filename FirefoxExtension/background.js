// Path: background.js
// receive informations from the content script
// and send it to the popup
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Received message from content script");

    var infos = request.infos;

    switch(infos.status.toLowerCase()){
        case "playing":
            postDiscordRequest(infos, "playing");
        break;
        case "paused":
            postDiscordRequest(infos, "paused");
            break;
        case "stopped":
            postDiscordRequest(infos, "stopped");
            break;
        default:
            console.log("Unknown type");
        break;
    }



    sendResponse({response: "Noice."});
    return true;
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
      // Send a message to the content script
      browser.tabs.sendMessage(tabId, { message: "Tab updated" });
    }
    
}, {urls: ["https://music.youtube.com/*", "https://youtube.com/*"]});
  
  
function postDiscordRequest(infos, type){
    console.log("sending request to discord");

    let request = $.ajax({
        type: "POST",
        url: "http://localhost:3000/discord",
        data: JSON.stringify({
            "type": type,
            "details": `Listening to ${infos.title}`,
            "state": `Made by ${infos.artist}`,
            "time": infos.time,
            "maxTime": infos.max_time,
            "url": infos.url,
            "thumbnail": infos.thumbnail,
            
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

    return request;
}