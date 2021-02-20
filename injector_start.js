chrome.storage.sync.get({
    downloadServer: ''
}, function (items) {
    var payloadScript = document.createElement('script');
    payloadScript.setAttribute('src', chrome.extension.getURL('payload_start.js'));
    payloadScript.setAttribute('data-url', items.downloadServer)
    payloadScript.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(payloadScript);
})