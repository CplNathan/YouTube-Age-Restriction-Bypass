chrome.storage.sync.get({
    downloadServer: ''
}, function (items) {
    var payloadScript = document.createElement('script');
    payloadScript.setAttribute('src', chrome.extension.getURL('payload_start.js'));
    payloadScript.setAttribute('data-url', items.downloadServer)
    payloadScript.setAttribute('data-errorurl', chrome.extension.getURL('html/youtube/errormessage.html'))
    payloadScript.setAttribute('data-loadingurl', chrome.extension.getURL('html/youtube/loadingmessage.html'))
    payloadScript.setAttribute('data-playerurl', chrome.extension.getURL('html/youtube/fakeplayer.html'))
    payloadScript.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(payloadScript);
})

window.addEventListener('requestAgeRestrictionBypassSettingsOpen', function (e) {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('html/options/options.html'));
    }
});