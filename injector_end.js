chrome.storage.sync.get({
    downloadServer: ''
}, function (items) {
    var configScript = document.createElement("script");
    configScript.textContent = "const downloadServerURL = '" + items.downloadServer + "';"
    configScript.onload = function() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(configScript);
})

var payloadScript = document.createElement("script");
payloadScript.src = chrome.extension.getURL("payload_end.js");
payloadScript.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(payloadScript);