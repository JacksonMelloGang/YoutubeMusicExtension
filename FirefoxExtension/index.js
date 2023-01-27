// get informations from youtube music page (firefox extension)
// and send it to the background script
var getInfos = function() {
    // get concerned elements
    var title_element = document.getElementsByClassName("title style-scope ytmusic-player-bar");
    var artist_element = document.getElementsByClassName("yt-simple-endpoint style-scope yt-formatted-string")
    var progress_bar = document.getElementById("progress-bar")

    var infos = {
        // get infos from youtube music page
        title: title_element.length != 0 ? title_element[0].textContent : "undefined",
        artist: artist_element.length != 0 ? artist_element[0].textContent : "undefined",
        playedtime: progress_bar.value,
        maxtime: progress_bar.ariaValueMax,
        time: progress_bar.ariaValueText
    };
    
    console.log(infos);

    postDiscord(infos);
};

function postDiscord(infos){   


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/discord", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    xhr.send(JSON.stringify({ 
        "details": `Listening to ${infos.title}`, 
        "state": `Made by ${infos.artist}`, 
        "largeImageKey": "shiba", 
        "largeImageText": "Large Image Text", 
        "smallImageKey": "small_image", 
        "smallImageText": "Small Image Text", 
        "instance": false
    }));


    xhr.onprogress = function(event) { // triggers periodically
        // event.loaded - how many bytes downloaded
        // event.lengthComputable = true if the server sent Content-Length header
        // event.total - total number of bytes (if lengthComputable)
        alert(`Received ${event.loaded} of ${event.total}`);
    };

    xhr.onerror = function() { // only triggers if the request couldn't be made at all
        error('Network Error');
    };
}

setTimeout(getInfos(), 1e3);



