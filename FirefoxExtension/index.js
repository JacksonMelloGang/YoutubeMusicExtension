// get informations from youtube music page (firefox extension)
// and send it to the background script
var getInfos = function() {
    // get concerned elements
    var title_element = document.getElementsByClassName("title style-scope ytmusic-player-bar"); 
    var artist_element = document.getElementsByClassName("byline style-scope ytmusic-player-bar complex-string");
    //var time = document.querySelector('span.time-info[dir="ltr"].style-scope.ytmusic-player-bar');
    var time = document.getElementsByClassName('time-info style-scope ytmusic-player-bar')[0];

    var infos = {
        // get infos from youtube music page
        title: title_element.length != 0 ? title_element[0].textContent : "undefined",
        artist: artist_element.length != 0 ? artist_element[0].textContent.split("•")[0] : "undefined",
        time: time.innerHTML.trim().split(" / ")[0],
        max_time: time.innerHTML.trim().split(" / ")[1]
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

let title = getInfos().title;
let author = getInfos().artist;
let max_time = getInfos().max_time;

var intervalId = setInterval(function(){
    //console.log(`Saved title: ${title} | Saved author: ${author} | Saved max time: ${max_time}`);
    console.log(`Title: ${getInfos().title} | Author: ${getInfos().artist} | Time: ${getInfos().time} | Max Time: ${getInfos().max_time}`);

    if(title != getInfos().title || author != getInfos().artist || max_time != getInfos().max_time){

        title = getInfos().title;
        author = getInfos().artist;
        max_time = getInfos().max_time;

        setTimeout(() => {}, 3000);

        browser.runtime.sendMessage({
            infos: getInfos()
        });
    }
}, 1000)
