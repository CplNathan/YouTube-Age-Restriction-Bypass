var s = document.createElement('script');
s.src = chrome.runtime.getURL('payload_end.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);