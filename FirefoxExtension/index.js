console.log("AAAAAAAAAAAAAAA");

// get informations from youtube music page (firefox extension)
// and send it to the background script
var getInfos = function() {
    var infos = {
        // get infos from youtube music page
        title: document.querySelector(".title").textContent,
        artist: document.querySelector(".artist").textContent,
        album: document.querySelector(".album").textContent,
        cover: document.querySelector(".cover-art-image").src
    };
    
    browser.runtime.sendMessage({
        type: "infos",
        infos: infos
    });
};



