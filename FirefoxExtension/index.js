// "M9,19H7V5H9ZM17,5H15V19h2Z" => playing
// "M6,4l12,8L6,20V4z" => paused


// get informations from youtube music page (firefox extension)
// and send it to the background script
var getInfos = function() {    
    var infos = {}
    let audio_title, audio_artist, audio_time, audio_max_time,  audio_status, audio_url, audio_thumbnail

    if(window.location.toString().includes("music.youtube.com")){
    // youtube music
        
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
        
        audio_title = title_element.length != 0 ? title_element[0].textContent : "undefined"
        audio_artist = artist_element.length != 0 ? artist_element[0].textContent.split("•")[0] : "undefined"
        audio_time = time.innerHTML.trim().split(" / ")[0]
        audio_max_time = time.innerHTML.trim().split(" / ")[1]
        audio_status =  status
        audio_url = window.location.href.split("&")[0] 
        audio_thumbnail = img
    

    } else {

        time = convertSecondstoHMS(Math.floor(document.querySelector("video").currentTime))
        max_time = convertSecondstoHMS(Math.floor(document.querySelector("video").duration))
        status = document.querySelector("video").paused ? "paused" : "playing"

        audio_title = document.getElementById("above-the-fold").querySelector("#title").querySelector("h1").textContent
        audio_artist = document.getElementById("upload-info").querySelector("a").text
        audio_time = time
        audio_max_time = max_time
        audio_url = window.location.href.split("&")[0] 

    }


    infos = {
        // get infos from youtube music page
        title: audio_title,
        artist: audio_artist,
        time: audio_time,
        max_time: audio_max_time,
        status: audio_status,
        url: audio_url,
        thumbnail: audio_thumbnail
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


function convertSecondstoHMS(seconds){
    var hours = Math.floor(seconds / 3600)
    var minutes = Math.floor((seconds % 3600) / 60 )
    var remainingseconds = seconds % 60

    return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + remainingseconds.toString().padStart(2, '0')
}