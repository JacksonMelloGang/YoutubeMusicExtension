// "M9,19H7V5H9ZM17,5H15V19h2Z" => playing
// "M6,4l12,8L6,20V4z" => paused


// get informations from youtube music page (firefox extension)
// and send it to the background script
var getInfos = function() {
    // get concerned elements
    var title_element = document.getElementsByClassName("title style-scope ytmusic-player-bar"); 
    var artist_element = document.getElementsByClassName("byline style-scope ytmusic-player-bar complex-string");
    //var time = document.querySelector('span.time-info[dir="ltr"].style-scope.ytmusic-player-bar');
    var time = document.getElementsByClassName('time-info style-scope ytmusic-player-bar')[0];
    var pl_pa_button = document.getElementsByClassName("play-pause-button style-scope ytmusic-player-bar")[0];
    var status = "stopped";
    
    // get url of img inside a div using jquery
    var img = document.getElementsByClassName("thumbnail style-scope ytmusic-player no-transition")[0].getElementsByTagName("img")[0].src;

    // stopped
    if(pl_pa_button.innerHTML.includes("M6,4l12,8L6,20V4z") && time.innerHTML.trim().split(" / ")[0] == time.innerHTML.trim().split(" / ")[1]){
        status = "stopped";
    }

    // paused
    if(pl_pa_button.innerHTML.includes("M6,4l12,8L6,20V4z")){
        status = "paused";
    }

    // playing
    if(pl_pa_button.innerHTML.includes("M9,19H7V5H9ZM17,5H15V19h2Z")){
        status = "playing";
    }
    
    var infos = {
        // get infos from youtube music page
        title: title_element.length != 0 ? title_element[0].textContent : "undefined",
        artist: artist_element.length != 0 ? artist_element[0].textContent.split("•")[0] : "undefined",
        time: time.innerHTML.trim().split(" / ")[0],
        max_time: time.innerHTML.trim().split(" / ")[1],
        status: status,
        url: window.location.href.split("&")[0],
        thumbnail: img
    };

    return infos;
};

// handle events from the background script
var handleEvent = function(request, sender, sendResponse) {
    console.log("Received message from background script");

    browser.runtime.sendMessage({
        infos: getInfos()
    });

};

browser.runtime.onMessage.addListener(handleEvent);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let title = getInfos().title;
let author = getInfos().artist;
let max_time = getInfos().max_time;
let status = getInfos().status;
let time = getInfos().time;

var intervalId = setInterval(function(){
    //console.log(`Saved title: ${title} | Saved author: ${author} | Saved max time: ${max_time}`);
    console.log(`Title: ${getInfos().title} | Author: ${getInfos().artist} | Time: ${getInfos().time} | Max Time: ${getInfos().max_time} | status: ${getInfos().status}`);

    if(title != getInfos().title || author != getInfos().artist || max_time != getInfos().max_time || status != getInfos().status, time != getInfos().time){

        title = getInfos().title;
        author = getInfos().artist;
        max_time = getInfos().max_time;
        status = getInfos().status;
        time = getInfos().time;

        browser.runtime.sendMessage({
            infos: getInfos()
        });
    }
}, 1000)
