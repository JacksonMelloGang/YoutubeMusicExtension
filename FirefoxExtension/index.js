// get informations from youtube music page (firefox extension)
// and send it to the background script
var getInfos = function() {
    // get concerned elements
    var title_element = document.getElementsByClassName("title style-scope ytmusic-player-bar"); 
    var artist_element = document.getElementsByClassName("byline style-scope ytmusic-player-bar complex-string");
    var progress_bar = document.getElementsByTagName("tp-yt-paper-slider")[2];
    var time = document.getElementsByClassName("time-info style-scope ytmusic-player-bar")[0].innerText.toString().split(' / ')[1];

    var infos = {
        // get infos from youtube music page
        title: title_element.length != 0 ? title_element[0].textContent : "undefined",
        artist: artist_element.length != 0 ? artist_element[0].textContent.split("•")[0] : "undefined",
        time: time,
        //playedtime: progress_bar.value,
        //maxtime: progress_bar.ariaValueMax
        //time: progress_bar.ariaValueText
    };

    return infos;
};

console.log("Content script loaded");

// when getting a message from the background script, execute getInfos function
// and send the result to the background script
browser.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Received message from background script");

        // send infos to the background script
        browser.runtime.sendMessage({
            infos: getInfos()
        });

        sendResponse({response: "Message Received! (content)"});
        return true;
    });



