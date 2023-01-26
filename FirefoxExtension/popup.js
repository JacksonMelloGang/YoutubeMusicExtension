// Path: popup.js
// receive informations from the background script
// and send it to the content script
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.type == "infos") {
        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                type: "infos",
                infos: request.infos
            });
        });
    }
});

